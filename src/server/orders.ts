import "server-only";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import { calculateTotals, couponIneligibility, type PricingCoupon } from "@/lib/pricing";
import { CANCELLABLE_STATUSES, NEXT_STATUSES, ORDER_STATUS_META } from "@/lib/order-status";
import { getStoreSettings, toPricingSettings } from "@/server/settings";
import type { ShippingAddress } from "@/types";

/**
 * Order domain service. All order state transitions go through here so that
 * the storefront, account area and admin panel stay consistent.
 * Callers are responsible for authentication/authorisation.
 */

export class OrderError extends Error {}

type Tx = Prisma.TransactionClient;

// ─── Coupons ───────────────────────────────────────────────────────────────

export async function findValidCoupon(code: string, subtotal: number) {
  const coupon = await db.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  const now = new Date();
  if (!coupon || !coupon.isActive) return { ok: false as const, error: "This coupon code is not valid" };
  if (coupon.startsAt && coupon.startsAt > now) return { ok: false as const, error: "This coupon is not active yet" };
  if (coupon.endsAt && coupon.endsAt < now) return { ok: false as const, error: "This coupon has expired" };
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false as const, error: "This coupon has reached its usage limit" };
  }
  const pricing: PricingCoupon = {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minOrder: coupon.minOrder,
    maxDiscount: coupon.maxDiscount,
  };
  const reason = couponIneligibility(pricing, subtotal);
  if (reason) return { ok: false as const, error: reason };
  return { ok: true as const, coupon: pricing, description: coupon.description };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function newOrderNumber() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = parseInt(randomBytes(3).toString("hex"), 16).toString().slice(-4).padStart(4, "0");
  return `LA${ymd}${rand}`;
}

function demoId(prefix: string) {
  return `${prefix}_demo_${randomBytes(7).toString("base64url")}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function reserveStock(tx: Tx, orderId: string) {
  const items = await tx.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    if (!item.productId) continue;
    const res = await tx.product.updateMany({
      where: { id: item.productId, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    });
    if (res.count === 0) throw new OrderError(`${item.name} just went out of stock. Please update your cart.`);
  }
}

async function releaseStock(tx: Tx, orderId: string) {
  const items = await tx.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    if (!item.productId) continue;
    await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
  }
}

/** Whether stock has been taken for this order (it is reserved once confirmed). */
function hasReservedStock(status: OrderStatus) {
  return status !== "PENDING_PAYMENT" && status !== "CANCELLED";
}

// ─── Checkout ──────────────────────────────────────────────────────────────

export type CreateOrderInput = {
  userId: string;
  lines: { productId: string; quantity: number }[];
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string | null;
  giftWrap?: boolean;
  giftMessage?: string | null;
  email?: string | null;
};

/**
 * Creates an order from cart lines using authoritative DB prices.
 * - COD orders are confirmed immediately (stock reserved).
 * - Prepaid orders start as PENDING_PAYMENT until the demo payment succeeds.
 */
export async function createOrder(input: CreateOrderInput) {
  if (!input.lines.length) throw new OrderError("Your cart is empty");
  const settings = await getStoreSettings();
  if (input.paymentMethod === "COD" && !settings.codEnabled) {
    throw new OrderError("Cash on Delivery is currently unavailable");
  }

  const products = await db.product.findMany({
    where: { id: { in: input.lines.map((l) => l.productId) } },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  const lines = input.lines.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product || product.status !== "ACTIVE") throw new OrderError("An item in your cart is no longer available");
    if (line.quantity < 1 || line.quantity > 10) throw new OrderError("Invalid quantity");
    if (product.stock < line.quantity) {
      throw new OrderError(
        product.stock === 0 ? `${product.name} is out of stock` : `Only ${product.stock} left of ${product.name}`,
      );
    }
    return { product, quantity: line.quantity };
  });

  const subtotalForCoupon = lines.reduce((n, l) => n + l.product.price * l.quantity, 0);
  let coupon: PricingCoupon | null = null;
  if (input.couponCode) {
    const res = await findValidCoupon(input.couponCode, subtotalForCoupon);
    if (!res.ok) throw new OrderError(res.error);
    coupon = res.coupon;
  }

  const totals = calculateTotals(
    lines.map((l) => ({ price: l.product.price, mrp: l.product.mrp, quantity: l.quantity })),
    toPricingSettings(settings),
    { coupon, giftWrap: input.giftWrap, cod: input.paymentMethod === "COD" },
  );

  const isCod = input.paymentMethod === "COD";

  return db.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber: newOrderNumber(),
        userId: input.userId,
        status: isCod ? "CONFIRMED" : "PENDING_PAYMENT",
        paymentStatus: "PENDING",
        paymentMethod: input.paymentMethod,
        subtotal: totals.subtotal,
        mrpTotal: totals.mrpTotal,
        discount: totals.couponDiscount,
        shippingFee: totals.shippingFee,
        giftWrapFee: totals.giftWrapFee,
        codFee: totals.codFee,
        total: totals.total,
        couponCode: coupon?.code ?? null,
        giftWrap: !!input.giftWrap,
        giftMessage: input.giftMessage?.trim() || null,
        shippingAddress: input.address,
        email: input.email ?? null,
        phone: input.address.phone,
        estimatedDelivery: addDays(new Date(), 5),
        items: {
          create: lines.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            sku: l.product.sku,
            image: l.product.images[0]?.url ?? null,
            price: l.product.price,
            mrp: l.product.mrp,
            quantity: l.quantity,
          })),
        },
        payments: { create: { method: input.paymentMethod, amount: totals.total, status: "PENDING" } },
        events: {
          create: isCod
            ? [
                { title: "Order placed", note: "Cash on Delivery selected" },
                { status: "CONFIRMED", title: "Order confirmed", note: ORDER_STATUS_META.CONFIRMED.description },
              ]
            : [{ status: "PENDING_PAYMENT", title: "Order placed", note: "Awaiting payment" }],
        },
      },
    });

    if (isCod) {
      await reserveStock(tx, order.id);
      if (coupon) await tx.coupon.update({ where: { code: coupon.code }, data: { usedCount: { increment: 1 } } });
    }
    return order;
  });
}

/**
 * Resolves the demo (Razorpay-like) payment for a prepaid order.
 * `success=false` simulates a declined payment; the order stays retryable.
 */
export async function completeDemoPayment(opts: {
  orderId: string;
  userId: string;
  success: boolean;
  method: PaymentMethod;
  failureReason?: string;
}) {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findFirst({ where: { id: opts.orderId, userId: opts.userId } });
    if (!order) throw new OrderError("Order not found");
    if (order.paymentStatus === "PAID") return order;
    if (order.status !== "PENDING_PAYMENT") throw new OrderError("This order can no longer be paid for");

    const pending = await tx.payment.findFirst({
      where: { orderId: order.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    const payment =
      pending ??
      (await tx.payment.create({ data: { orderId: order.id, method: opts.method, amount: order.total } }));

    if (!opts.success) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", method: opts.method, failureReason: opts.failureReason ?? "Payment declined by bank" },
      });
      await tx.payment.create({ data: { orderId: order.id, method: opts.method, amount: order.total } });
      await tx.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED", paymentMethod: opts.method } });
      await tx.orderEvent.create({
        data: { orderId: order.id, title: "Payment failed", note: opts.failureReason ?? "Payment declined by bank" },
      });
      return tx.order.findUniqueOrThrow({ where: { id: order.id } });
    }

    await reserveStock(tx, order.id);
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", method: opts.method, providerPaymentId: demoId("pay") },
    });
    if (order.couponCode) {
      await tx.coupon.update({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } });
    }
    await tx.orderEvent.createMany({
      data: [
        { orderId: order.id, title: "Payment received", note: `Paid via ${opts.method}` },
        { orderId: order.id, status: "CONFIRMED", title: "Order confirmed", note: ORDER_STATUS_META.CONFIRMED.description },
      ],
    });
    return tx.order.update({
      where: { id: order.id },
      data: { status: "CONFIRMED", paymentStatus: "PAID", paymentMethod: opts.method },
    });
  });
}

// ─── Fulfilment (admin) ────────────────────────────────────────────────────

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
    if (!NEXT_STATUSES[order.status].includes(status)) {
      throw new OrderError(
        `Cannot move an order from “${ORDER_STATUS_META[order.status].label}” to “${ORDER_STATUS_META[status].label}”`,
      );
    }
    if (status === "CANCELLED") {
      await cancelOrderTx(tx, order.id, note || "Cancelled by LushAura");
      return tx.order.findUniqueOrThrow({ where: { id: orderId } });
    }
    const data: Prisma.OrderUpdateInput = { status };
    // COD is collected on delivery.
    if (status === "DELIVERED" && order.paymentMethod === "COD" && order.paymentStatus !== "PAID") {
      data.paymentStatus = "PAID";
      await tx.payment.updateMany({
        where: { orderId, status: "PENDING" },
        data: { status: "PAID", providerPaymentId: demoId("cod") },
      });
    }
    if (status === "CONFIRMED" && order.status === "PENDING_PAYMENT") await reserveStock(tx, orderId);
    await tx.orderEvent.create({
      data: { orderId, status, title: ORDER_STATUS_META[status].label, note: note || ORDER_STATUS_META[status].description },
    });
    return tx.order.update({ where: { id: orderId }, data });
  });
}

export async function setTracking(
  orderId: string,
  input: { courier: string; trackingNumber: string; estimatedDelivery?: Date | null; markShipped?: boolean },
) {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
    if (order.status === "CANCELLED") throw new OrderError("Cannot add tracking to a cancelled order");
    await tx.order.update({
      where: { id: orderId },
      data: {
        courier: input.courier,
        trackingNumber: input.trackingNumber,
        estimatedDelivery: input.estimatedDelivery ?? order.estimatedDelivery,
      },
    });
    await tx.orderEvent.create({
      data: { orderId, title: "Tracking details added", note: `${input.courier} · AWB ${input.trackingNumber}` },
    });
    if (input.markShipped && (order.status === "CONFIRMED" || order.status === "PACKED")) {
      await tx.order.update({ where: { id: orderId }, data: { status: "SHIPPED" } });
      await tx.orderEvent.create({
        data: { orderId, status: "SHIPPED", title: "Shipped", note: `Handed over to ${input.courier}` },
      });
    }
    return tx.order.findUniqueOrThrow({ where: { id: orderId } });
  });
}

export async function addTrackingEvent(orderId: string, input: { title: string; location?: string; note?: string }) {
  return db.orderEvent.create({
    data: { orderId, title: input.title, location: input.location || null, note: input.note || null },
  });
}

// ─── Cancellation & refunds ────────────────────────────────────────────────

/** Cancels inside a transaction: restocks and queues a refund if money was captured. */
async function cancelOrderTx(tx: Tx, orderId: string, note: string) {
  const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { payments: true } });
  if (order.status === "CANCELLED") return;
  if (hasReservedStock(order.status)) await releaseStock(tx, orderId);

  const paid = order.payments.find((p) => p.status === "PAID");
  await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
  await tx.payment.updateMany({ where: { orderId, status: "PENDING" }, data: { status: "FAILED", failureReason: "Order cancelled" } });
  await tx.orderEvent.create({ data: { orderId, status: "CANCELLED", title: "Order cancelled", note } });

  if (paid) {
    await tx.refund.create({
      data: { orderId, paymentId: paid.id, amount: paid.amount, reason: note, status: "PENDING" },
    });
    await tx.orderEvent.create({
      data: { orderId, title: "Refund initiated", note: "Refund will reach the original payment method in 5–7 working days" },
    });
  }
}

export async function requestCancellation(opts: { orderId: string; userId: string; reason: string; comment?: string }) {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: opts.orderId, userId: opts.userId },
      include: { cancellation: true },
    });
    if (!order) throw new OrderError("Order not found");
    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      throw new OrderError("This order has already shipped and can no longer be cancelled");
    }
    if (order.cancellation?.status === "REQUESTED") throw new OrderError("A cancellation request is already pending");

    // Unpaid prepaid orders can be cancelled instantly.
    if (order.status === "PENDING_PAYMENT") {
      await cancelOrderTx(tx, order.id, `Cancelled by customer: ${opts.reason}`);
      await tx.cancellationRequest.upsert({
        where: { orderId: order.id },
        create: { orderId: order.id, reason: opts.reason, comment: opts.comment, status: "APPROVED", resolvedAt: new Date(), adminNote: "Auto-approved (unpaid order)" },
        update: { reason: opts.reason, comment: opts.comment, status: "APPROVED", resolvedAt: new Date(), adminNote: "Auto-approved (unpaid order)" },
      });
      return { autoCancelled: true };
    }

    await tx.cancellationRequest.upsert({
      where: { orderId: order.id },
      create: { orderId: order.id, reason: opts.reason, comment: opts.comment },
      update: { reason: opts.reason, comment: opts.comment, status: "REQUESTED", adminNote: null, resolvedAt: null },
    });
    await tx.orderEvent.create({
      data: { orderId: order.id, title: "Cancellation requested", note: opts.reason },
    });
    return { autoCancelled: false };
  });
}

export async function resolveCancellation(requestId: string, approve: boolean, adminNote?: string) {
  return db.$transaction(async (tx) => {
    const req = await tx.cancellationRequest.findUniqueOrThrow({ where: { id: requestId } });
    if (req.status !== "REQUESTED") throw new OrderError("This request has already been resolved");
    await tx.cancellationRequest.update({
      where: { id: requestId },
      data: { status: approve ? "APPROVED" : "REJECTED", adminNote: adminNote || null, resolvedAt: new Date() },
    });
    if (approve) {
      await cancelOrderTx(tx, req.orderId, `Cancellation approved: ${req.reason}`);
    } else {
      await tx.orderEvent.create({
        data: {
          orderId: req.orderId,
          title: "Cancellation request declined",
          note: adminNote || "Your order has already been prepared for dispatch",
        },
      });
    }
  });
}

export async function processRefund(refundId: string, success: boolean) {
  return db.$transaction(async (tx) => {
    const refund = await tx.refund.findUniqueOrThrow({ where: { id: refundId } });
    if (refund.status === "PROCESSED") throw new OrderError("Refund already processed");
    if (!success) {
      return tx.refund.update({ where: { id: refundId }, data: { status: "FAILED" } });
    }
    const updated = await tx.refund.update({
      where: { id: refundId },
      data: { status: "PROCESSED", reference: demoId("rfnd"), processedAt: new Date() },
    });
    if (refund.paymentId) await tx.payment.update({ where: { id: refund.paymentId }, data: { status: "REFUNDED" } });
    await tx.order.update({ where: { id: refund.orderId }, data: { paymentStatus: "REFUNDED" } });
    await tx.orderEvent.create({
      data: {
        orderId: refund.orderId,
        title: "Refund processed",
        note: `₹${refund.amount.toLocaleString("en-IN")} refunded · Ref ${updated.reference}`,
      },
    });
    return updated;
  });
}

// ─── Reads ─────────────────────────────────────────────────────────────────

export const orderDetailInclude = {
  items: true,
  events: { orderBy: { createdAt: "asc" } },
  payments: { orderBy: { createdAt: "asc" } },
  refunds: { orderBy: { createdAt: "asc" } },
  cancellation: true,
  user: { select: { id: true, name: true, email: true, phone: true } },
} satisfies Prisma.OrderInclude;

export type OrderDetail = Prisma.OrderGetPayload<{ include: typeof orderDetailInclude }>;

export async function getOrderForUser(orderNumber: string, userId: string) {
  return db.order.findFirst({ where: { orderNumber, userId }, include: orderDetailInclude });
}

export async function getOrderById(id: string) {
  return db.order.findUnique({ where: { id }, include: orderDetailInclude });
}

/** Public tracking lookup — requires the order number plus the phone number on the order. */
export async function trackOrder(orderNumber: string, phone: string) {
  const order = await db.order.findUnique({
    where: { orderNumber: orderNumber.trim().toUpperCase() },
    include: { items: true, events: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) return null;
  const last10 = (s: string) => s.replace(/\D/g, "").slice(-10);
  if (last10(order.phone) !== last10(phone)) return null;
  return order;
}
