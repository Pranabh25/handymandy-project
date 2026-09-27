import type { Prisma } from "../../src/generated/prisma/client";
import type { OrderStatus, PaymentStatus } from "../../src/generated/prisma/enums";
import { calculateTotals, type PricingCoupon, type PricingSettings } from "../../src/lib/pricing";
import { FULFILMENT_STEPS, ORDER_STATUS_META, PAYMENT_METHOD_LABEL } from "../../src/lib/order-status";
import { transitHops, type GiftAddress, type OrderSpec } from "./orders";

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

/** Small deterministic PRNG so every seed run produces the same data. */
export function createRng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1));
  const chars = (n: number, alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789") =>
    Array.from({ length: n }, () => alphabet[int(0, alphabet.length - 1)]).join("");
  const digits = (n: number) => chars(n, "0123456789");
  return { next, int, chars, digits };
}
export type Rng = ReturnType<typeof createRng>;

type ProductRef = { id: string; name: string; sku: string; price: number; mrp: number };
type CustomerRef = { id: string; email: string; addresses: GiftAddress[] };

export type BuiltOrder = {
  order: Prisma.OrderUncheckedCreateInput;
  payments: Omit<Prisma.PaymentUncheckedCreateInput, "orderId">[];
  /** Index into `payments` of the captured payment that the refund belongs to. */
  refund?: Omit<Prisma.RefundUncheckedCreateInput, "orderId" | "paymentId"> & { paymentIndex: number };
  cancellation?: Omit<Prisma.CancellationRequestUncheckedCreateInput, "orderId">;
};

type Ev = { status?: OrderStatus; title: string; note?: string; location?: string; at: Date };

function orderNumberFor(date: Date, rng: Rng, used: Set<string>) {
  const ymd = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  let num: string;
  do num = `LA${ymd}${rng.digits(4)}`;
  while (used.has(num));
  used.add(num);
  return num;
}

function awbFor(courier: string, rng: Rng) {
  if (courier === "Blue Dart") return rng.digits(11);
  if (courier === "Delhivery") return `1${rng.digits(13)}`;
  if (courier === "DTDC") return `D${rng.digits(9)}`;
  return rng.chars(12, "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789");
}

export function buildOrder(
  spec: OrderSpec,
  ctx: {
    now: Date;
    rng: Rng;
    usedNumbers: Set<string>;
    products: Map<string, ProductRef>;
    customers: Map<string, CustomerRef>;
    coupons: Map<string, PricingCoupon>;
    settings: PricingSettings;
  },
): BuiltOrder {
  const { now, rng } = ctx;
  const customer = ctx.customers.get(spec.customer);
  if (!customer) throw new Error(`Unknown customer ${spec.customer}`);
  const address: GiftAddress =
    typeof spec.address === "object" ? spec.address : customer.addresses[spec.address ?? 0];

  const lines = spec.items.map(([slug, quantity]) => {
    const p = ctx.products.get(slug);
    if (!p) throw new Error(`Unknown product ${slug}`);
    return { p, quantity };
  });
  const coupon = spec.coupon ? ctx.coupons.get(spec.coupon) ?? null : null;
  if (spec.coupon && !coupon) throw new Error(`Unknown coupon ${spec.coupon}`);
  const isCod = spec.method === "COD";
  const totals = calculateTotals(
    lines.map((l) => ({ price: l.p.price, mrp: l.p.mrp, quantity: l.quantity })),
    ctx.settings,
    { coupon, giftWrap: spec.giftWrap, cod: isCod },
  );
  if (coupon && coupon.type !== "FREE_SHIPPING" && totals.couponDiscount === 0) {
    throw new Error(`Coupon ${coupon.code} not applicable to order for ${spec.customer}`);
  }

  const created = new Date(now.getTime() - spec.hoursAgo * HOUR);
  const at = (h: number) => new Date(created.getTime() + h * HOUR);
  const events: Ev[] = [];
  const payments: BuiltOrder["payments"] = [];
  let refund: BuiltOrder["refund"];
  let cancellation: BuiltOrder["cancellation"];
  let courier: string | null = null;
  let trackingNumber: string | null = null;
  let paymentStatus: PaymentStatus = "PENDING";

  // ── Placement & payment
  if (isCod) {
    events.push({ title: "Order placed", note: "Cash on Delivery selected", at: created });
    events.push({ status: "CONFIRMED", title: "Order confirmed", note: ORDER_STATUS_META.CONFIRMED.description, at: at(1 / 60) });
  } else {
    events.push({ status: "PENDING_PAYMENT", title: "Order placed", note: "Awaiting payment", at: created });
    if (spec.failedAttempt) {
      payments.push({
        method: spec.method, amount: totals.total, status: "FAILED", failureReason: spec.failedAttempt,
        createdAt: at(1 / 60), updatedAt: at(2 / 60),
      });
      events.push({ title: "Payment failed", note: spec.failedAttempt, at: at(2 / 60) });
    }
    if (spec.status === "PENDING_PAYMENT") {
      payments.push({ method: spec.method, amount: totals.total, status: "PENDING", createdAt: at(3 / 60), updatedAt: at(3 / 60) });
      paymentStatus = spec.failedAttempt ? "FAILED" : "PENDING";
    } else {
      payments.push({
        method: spec.method, amount: totals.total, status: "PAID", providerPaymentId: `pay_demo_${rng.chars(8)}`,
        createdAt: at(3 / 60), updatedAt: at(4 / 60),
      });
      paymentStatus = "PAID";
      events.push({ title: "Payment received", note: `Paid via ${PAYMENT_METHOD_LABEL[spec.method]}`, at: at(4 / 60) });
      events.push({ status: "CONFIRMED", title: "Order confirmed", note: ORDER_STATUS_META.CONFIRMED.description, at: at(5 / 60) });
    }
  }
  if (isCod) payments.push({ method: "COD", amount: totals.total, status: "PENDING", createdAt: created, updatedAt: created });

  // ── Fulfilment
  const reached: OrderStatus = spec.status === "CANCELLED" ? spec.cancel!.at : spec.status;
  const stage = FULFILMENT_STEPS.indexOf(reached);
  const packedAt = at(16 + rng.int(0, 4) + rng.next());
  if (stage >= 1) {
    events.push({ status: "PACKED", title: ORDER_STATUS_META.PACKED.label, note: "Gift-packed and sealed at our Bengaluru studio", at: packedAt });
  }
  if (stage >= 2) {
    courier = spec.courier ?? "Delhivery";
    trackingNumber = awbFor(courier, rng);
    const shipAt = at(23 + rng.int(0, 2) + rng.next());
    events.push({ title: "Tracking details added", note: `${courier} · AWB ${trackingNumber}`, at: shipAt });
    events.push({ status: "SHIPPED", title: "Shipped", note: `Handed over to ${courier}`, at: new Date(shipAt.getTime() + 5 * MIN) });
    const scans: Ev[] = [];
    let t = shipAt.getTime() + 3 * HOUR;
    scans.push({ title: "Picked up", note: "Shipment picked up from LushAura warehouse", location: "Bengaluru Hub", at: new Date(t) });
    for (const hop of transitHops[address.city] ?? []) {
      t += 10 * HOUR;
      scans.push({ title: `In transit — ${hop}`, note: "Shipment in transit", location: hop, at: new Date(t) });
    }
    t += 10 * HOUR;
    scans.push({ title: "Arrived at destination hub", location: `${address.city} Hub`, at: new Date(t) });
    const cutoff = spec.status === "SHIPPED" ? now.getTime() - 30 * MIN : Infinity;
    events.push(...scans.filter((s) => s.at.getTime() < cutoff));
  }
  if (stage >= 3) {
    events.push({ status: "OUT_FOR_DELIVERY", title: ORDER_STATUS_META.OUT_FOR_DELIVERY.label, note: ORDER_STATUS_META.OUT_FOR_DELIVERY.description, location: address.city, at: at(80 + rng.next()) });
  }
  if (stage >= 4) {
    const deliveredAt = at(84 + rng.int(0, 3) + rng.next());
    events.push({ status: "DELIVERED", title: ORDER_STATUS_META.DELIVERED.label, note: ORDER_STATUS_META.DELIVERED.description, location: address.city, at: deliveredAt });
    if (isCod) {
      Object.assign(payments[payments.length - 1], { status: "PAID", providerPaymentId: `cod_demo_${rng.chars(8)}`, updatedAt: deliveredAt });
      paymentStatus = "PAID";
    }
  }

  // ── Cancellation
  const lastAt = () => events[events.length - 1].at;
  if (spec.status === "CANCELLED") {
    const c = spec.cancel!;
    if (c.by === "customer") {
      const reqAt = new Date(lastAt().getTime() + 3 * HOUR);
      const resolvedAt = new Date(reqAt.getTime() + 4 * HOUR);
      events.push({ title: "Cancellation requested", note: c.reason, at: reqAt });
      events.push({ status: "CANCELLED", title: "Order cancelled", note: `Cancellation approved: ${c.reason}`, at: resolvedAt });
      cancellation = {
        reason: c.reason, comment: c.comment ?? null, status: "APPROVED",
        adminNote: "Approved — order had not left the warehouse", createdAt: reqAt, resolvedAt,
      };
    } else {
      events.push({ status: "CANCELLED", title: "Order cancelled", note: `Cancelled by LushAura: ${c.reason}`, at: new Date(lastAt().getTime() + 20 * HOUR) });
    }
    const cancelledAt = lastAt();
    const paidIndex = payments.findIndex((p) => p.status === "PAID");
    payments.forEach((p) => {
      if (p.status === "PENDING") Object.assign(p, { status: "FAILED", failureReason: "Order cancelled", updatedAt: cancelledAt });
    });
    if (paidIndex >= 0) {
      events.push({ title: "Refund initiated", note: "Refund will reach the original payment method in 5–7 working days", at: new Date(cancelledAt.getTime() + MIN) });
      const status = c.refund ?? "PENDING";
      const reference = status === "PROCESSED" ? `rfnd_demo_${rng.chars(10)}` : null;
      const processedAt = status === "PROCESSED" ? new Date(cancelledAt.getTime() + 50 * HOUR) : null;
      refund = {
        paymentIndex: paidIndex, amount: totals.total, reason: `Cancellation approved: ${c.reason}`,
        status, reference, processedAt, createdAt: cancelledAt,
      };
      if (status === "PROCESSED") {
        Object.assign(payments[paidIndex], { status: "REFUNDED", updatedAt: processedAt });
        paymentStatus = "REFUNDED";
        events.push({ title: "Refund processed", note: `₹${totals.total.toLocaleString("en-IN")} refunded · Ref ${reference}`, at: processedAt! });
      }
    }
  } else if (spec.cancellationRequest) {
    const reqAt = new Date(lastAt().getTime() + (now.getTime() - lastAt().getTime()) / 2);
    events.push({ title: "Cancellation requested", note: spec.cancellationRequest.reason, at: reqAt });
    cancellation = {
      reason: spec.cancellationRequest.reason, comment: spec.cancellationRequest.comment ?? null,
      status: "REQUESTED", createdAt: reqAt,
    };
  }

  for (let i = 1; i < events.length; i++) {
    if (events[i].at < events[i - 1].at) throw new Error(`Event order broken for ${spec.customer} order (${events[i].title})`);
  }
  if (lastAt() > now) throw new Error(`Future event for ${spec.customer} ${spec.status} order: ${events[events.length - 1].title}`);

  const shippingAddress = {
    fullName: address.fullName, phone: address.phone, line1: address.line1, line2: address.line2 ?? null,
    landmark: address.landmark ?? null, city: address.city, state: address.state, pincode: address.pincode, type: address.type,
  };

  return {
    order: {
      orderNumber: orderNumberFor(created, rng, ctx.usedNumbers),
      userId: customer.id,
      status: spec.status,
      paymentStatus,
      paymentMethod: spec.method,
      subtotal: totals.subtotal,
      mrpTotal: totals.mrpTotal,
      discount: totals.couponDiscount,
      shippingFee: totals.shippingFee,
      giftWrapFee: totals.giftWrapFee,
      codFee: totals.codFee,
      total: totals.total,
      couponCode: coupon?.code ?? null,
      giftWrap: !!spec.giftWrap,
      giftMessage: spec.giftMessage ?? null,
      shippingAddress,
      email: customer.email,
      phone: address.phone,
      courier,
      trackingNumber,
      estimatedDelivery: new Date(created.getTime() + 5 * 24 * HOUR),
      createdAt: created,
      updatedAt: lastAt(),
      items: {
        create: lines.map((l) => ({
          productId: l.p.id, name: l.p.name, sku: l.p.sku, price: l.p.price, mrp: l.p.mrp, quantity: l.quantity,
        })),
      },
      events: {
        create: events.map((e) => ({
          status: e.status ?? null, title: e.title, note: e.note ?? null, location: e.location ?? null, createdAt: e.at,
        })),
      },
    },
    payments,
    refund,
    cancellation,
  };
}
