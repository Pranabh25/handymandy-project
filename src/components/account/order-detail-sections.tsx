import Link from "next/link";
import { Ban, Clock, Gift, Star } from "lucide-react";
import type { OrderDetail } from "@/server/orders";
import { StatusBadge } from "@/components/common/status-badge";
import { ProductImage } from "@/components/product/product-image";
import {
  CANCELLATION_STATUS_META,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_META,
  REFUND_STATUS_META,
} from "@/lib/order-status";
import { formatDate, formatDateTime, formatINR, formatPhone } from "@/lib/format";
import { addressLines, orderAddress } from "@/components/account/order-utils";
import { GST_RATE } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  children,
  className,
  action,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-xl border bg-card p-5 shadow-soft md:p-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

type ProductMeta = Map<string, { slug: string; group: "GIFTS" | "COSMETICS" }>;

export function OrderItems({ order, products }: { order: OrderDetail; products: ProductMeta }) {
  const delivered = order.status === "DELIVERED";
  return (
    <ul className="divide-y">
      {order.items.map((item) => {
        const meta = item.productId ? products.get(item.productId) : undefined;
        const href = meta ? `/product/${meta.slug}` : undefined;
        return (
          <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border bg-sand">
              <ProductImage src={item.image} alt={item.name} group={meta?.group} sizes="80px" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  {href ? (
                    <Link href={href} className="text-sm font-medium hover:underline">
                      {item.name}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium">{item.name}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    SKU {item.sku} · Qty {item.quantity} × {formatINR(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold sm:text-right">{formatINR(item.price * item.quantity)}</p>
              </div>
              {delivered && href ? (
                <Link
                  href={`${href}#reviews`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-terracotta hover:underline"
                >
                  <Star className="size-3.5" aria-hidden />
                  Write a review
                </Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function PriceSummary({ order }: { order: OrderDetail }) {
  const gst = Math.round(order.total - order.total / (1 + GST_RATE));
  const rows: { label: string; value: string; tone?: "save" }[] = [
    { label: "Item total (MRP)", value: formatINR(order.mrpTotal) },
  ];
  if (order.mrpTotal > order.subtotal) {
    rows.push({ label: "Product discount", value: `− ${formatINR(order.mrpTotal - order.subtotal)}`, tone: "save" });
  }
  if (order.discount > 0) {
    rows.push({ label: `Coupon${order.couponCode ? ` (${order.couponCode})` : ""}`, value: `− ${formatINR(order.discount)}`, tone: "save" });
  }
  rows.push({ label: "Shipping", value: order.shippingFee ? formatINR(order.shippingFee) : "Free" });
  if (order.giftWrapFee) rows.push({ label: "Gift wrap", value: formatINR(order.giftWrapFee) });
  if (order.codFee) rows.push({ label: "Cash on Delivery fee", value: formatINR(order.codFee) });

  return (
    <dl className="space-y-2.5 text-sm">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className={cn(r.tone === "save" && "text-sage")}>{r.value}</dd>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-t pt-3 text-base font-semibold">
        <dt>Order total</dt>
        <dd>{formatINR(order.total)}</dd>
      </div>
      <p className="text-xs text-muted-foreground">Includes GST of {formatINR(gst)}</p>
    </dl>
  );
}

export function DeliveryAddress({ order }: { order: OrderDetail }) {
  const a = orderAddress(order.shippingAddress);
  if (!a) return <p className="text-sm text-muted-foreground">Address unavailable.</p>;
  return (
    <address className="text-sm leading-6 text-muted-foreground not-italic">
      <span className="font-medium text-foreground">{a.fullName}</span>
      {a.type ? <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[0.65rem] tracking-wider uppercase">{a.type}</span> : null}
      {addressLines(a).map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
      <span className="block">{formatPhone(a.phone)}</span>
    </address>
  );
}

export function PaymentInfo({ order }: { order: OrderDetail }) {
  const meta = PAYMENT_STATUS_META[order.paymentStatus];
  const paid = [...order.payments].reverse().find((p) => p.status === "PAID" || p.status === "REFUNDED");
  const lastFailed = [...order.payments].reverse().find((p) => p.status === "FAILED" && p.failureReason);
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Method</dt>
        <dd className="text-right">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</dd>
      </div>
      <div className="flex items-center justify-between gap-4">
        <dt className="text-muted-foreground">Status</dt>
        <dd>
          <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
        </dd>
      </div>
      {paid?.providerPaymentId ? (
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Payment ID</dt>
          <dd className="font-mono text-xs break-all">{paid.providerPaymentId}</dd>
        </div>
      ) : null}
      {order.paymentMethod === "COD" && order.paymentStatus === "PENDING" ? (
        <p className="text-xs text-muted-foreground">Please keep {formatINR(order.total)} ready at delivery. UPI is accepted too.</p>
      ) : null}
      {order.paymentStatus === "FAILED" && lastFailed ? (
        <p className="text-xs text-destructive">Last attempt failed: {lastFailed.failureReason}</p>
      ) : null}
    </dl>
  );
}

export function GiftMessage({ order }: { order: OrderDetail }) {
  if (!order.giftWrap && !order.giftMessage) return null;
  return (
    <div className="rounded-xl border border-dashed border-terracotta/40 bg-terracotta-soft/40 p-5">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Gift className="size-4 text-terracotta" aria-hidden />
        {order.giftWrap ? "Gift-wrapped" : "Gift note"}
      </p>
      {order.giftMessage ? (
        <blockquote className="mt-2 font-display text-lg leading-snug italic">“{order.giftMessage}”</blockquote>
      ) : null}
    </div>
  );
}

export function RefundList({ order }: { order: OrderDetail }) {
  if (!order.refunds.length) return null;
  return (
    <ul className="space-y-3">
      {order.refunds.map((r) => {
        const meta = REFUND_STATUS_META[r.status];
        return (
          <li key={r.id} className="rounded-lg bg-muted/60 p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{formatINR(r.amount)}</p>
              <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Initiated {formatDate(r.createdAt)}
              {r.processedAt ? ` · Processed ${formatDate(r.processedAt)}` : " · Usually reaches you in 5–7 working days"}
            </p>
            {r.reference ? <p className="mt-1 font-mono text-xs">Ref {r.reference}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}

/** Banner describing a pending / rejected cancellation request. */
export function CancellationBanner({ order }: { order: OrderDetail }) {
  const c = order.cancellation;
  if (!c || order.status === "CANCELLED") return null;
  const meta = CANCELLATION_STATUS_META[c.status];
  if (c.status === "REQUESTED") {
    return (
      <div role="status" className="flex gap-3 rounded-xl border border-[#ecdcbc] bg-[#f7ecd8] p-4 text-sm text-[#6b4f19]">
        <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div>
          <p className="font-medium">Cancellation {meta.label.toLowerCase()} · {formatDateTime(c.createdAt)}</p>
          <p className="mt-0.5 leading-6">Reason: {c.reason}. We&apos;ll confirm within 24 hours.</p>
        </div>
      </div>
    );
  }
  if (c.status === "REJECTED") {
    return (
      <div role="status" className="flex gap-3 rounded-xl border border-[#ecc9c4] bg-[#f6e1de] p-4 text-sm text-[#7a2a22]">
        <Ban className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div>
          <p className="font-medium">Cancellation request declined</p>
          <p className="mt-0.5 leading-6">{c.adminNote || "Your order had already been prepared for dispatch."}</p>
        </div>
      </div>
    );
  }
  return null;
}
