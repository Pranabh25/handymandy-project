import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck, Clock, Download, Gift, MapPin, Package, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { ProductImage } from "@/components/product/product-image";
import { PriceSummary } from "@/components/cart/price-summary";
import { requireUser } from "@/lib/auth";
import { formatDate, formatDateTime, formatINR, formatPhone } from "@/lib/format";
import { GST_RATE, type PriceBreakdown } from "@/lib/pricing";
import { ORDER_STATUS_META, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { getOrderForUser } from "@/server/orders";
import type { ShippingAddress } from "@/types";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const user = await requireUser(`/checkout/success/${orderNumber}`);
  const order = await getOrderForUser(orderNumber, user.id);
  if (!order) notFound();

  const address = order.shippingAddress as unknown as ShippingAddress;
  const awaitingPayment = order.status === "PENDING_PAYMENT";
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const totals: PriceBreakdown = {
    itemCount,
    mrpTotal: order.mrpTotal,
    subtotal: order.subtotal,
    productSavings: Math.max(0, order.mrpTotal - order.subtotal),
    couponDiscount: order.discount,
    shippingFee: order.shippingFee,
    giftWrapFee: order.giftWrapFee,
    codFee: order.codFee,
    total: order.total,
    freeShippingRemaining: 0,
    gstIncluded: Math.round(order.total - order.total / (1 + GST_RATE)),
  };
  const firstName = user.name?.split(" ")[0];
  const orderHref = `/account/orders/${order.orderNumber}`;

  return (
    <div className="container-page py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <div className="text-center">
          <div
            className={cn(
              "mx-auto flex size-16 items-center justify-center rounded-full",
              awaitingPayment ? "bg-[#f7ecd8]" : "bg-sage-soft",
            )}
          >
            {awaitingPayment ? (
              <Clock className="size-8 text-[#8a6420]" strokeWidth={1.5} aria-hidden />
            ) : (
              <CircleCheck className="size-8 text-sage" strokeWidth={1.5} aria-hidden />
            )}
          </div>
          <p className="eyebrow mt-6">{awaitingPayment ? "Awaiting payment" : "Order confirmed"}</p>
          <h1 className="mt-2 text-3xl font-semibold text-balance md:text-4xl">
            {awaitingPayment
              ? "Your order is saved"
              : `Thank you${firstName ? `, ${firstName}` : ""}. It's on its way soon.`}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            {awaitingPayment
              ? "We haven't received payment for this order yet. Complete the payment from My Orders to confirm it."
              : `We've received your order and are preparing it with care. Updates will be sent to ${formatPhone(order.phone)}${order.email ? ` and ${order.email}` : ""}.`}
          </p>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border bg-card px-5 py-3 text-sm shadow-soft">
            <span>
              <span className="text-muted-foreground">Order no. </span>
              <span className="font-semibold tracking-wide">{order.orderNumber}</span>
            </span>
            <span className="text-muted-foreground">Placed {formatDateTime(order.createdAt)}</span>
          </div>
        </div>

        {/* Key facts */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4">
            <Truck className="size-4 text-terracotta" aria-hidden />
            <p className="mt-2 text-xs text-muted-foreground">Estimated delivery</p>
            <p className="mt-0.5 font-semibold">{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "Within 5–7 days"}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <Package className="size-4 text-terracotta" aria-hidden />
            <p className="mt-2 text-xs text-muted-foreground">Order status</p>
            <StatusBadge tone={ORDER_STATUS_META[order.status].tone} className="mt-1">
              {ORDER_STATUS_META[order.status].label}
            </StatusBadge>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">Payment</p>
            <p className="mt-0.5 font-semibold">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</p>
            <StatusBadge tone={PAYMENT_STATUS_META[order.paymentStatus].tone} className="mt-1">
              {order.paymentMethod === "COD" && order.paymentStatus === "PENDING"
                ? `Pay ${formatINR(order.total)} on delivery`
                : PAYMENT_STATUS_META[order.paymentStatus].label}
            </StatusBadge>
          </div>
        </div>

        {/* Items + summary */}
        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_300px]">
          <section aria-labelledby="success-items" className="rounded-xl border bg-card p-5">
            <h2 id="success-items" className="font-sans text-sm font-semibold">
              Items in this order
            </h2>
            <ul className="mt-4 space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <ProductImage src={item.image} alt={item.name} sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity} · {formatINR(item.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums">{formatINR(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <MapPin className="size-3.5" aria-hidden /> Delivering to
                </p>
                <address className="mt-2 text-sm leading-6 not-italic">
                  <span className="font-semibold">{address.fullName}</span>
                  <br />
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                  {address.landmark ? (
                    <>
                      <br />
                      Near {address.landmark.replace(/^near\s+/i, "")}
                    </>
                  ) : null}
                  <br />
                  {address.city}, {address.state} {address.pincode}
                  <br />
                  <span className="text-muted-foreground">{formatPhone(address.phone)}</span>
                </address>
              </div>
              {order.giftWrap || order.giftMessage ? (
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <Gift className="size-3.5" aria-hidden /> Gift details
                  </p>
                  {order.giftWrap ? <p className="mt-2 text-sm">Gift wrapped with a handwritten note card</p> : null}
                  {order.giftMessage ? (
                    <blockquote className="mt-2 rounded-lg bg-terracotta-soft/60 px-3.5 py-2.5 font-display text-lg leading-snug italic">
                      “{order.giftMessage}”
                    </blockquote>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          <section aria-labelledby="success-summary" className="self-start rounded-xl border bg-card p-5 shadow-soft">
            <h2 id="success-summary" className="mb-4 text-xl font-semibold">
              Payment summary
            </h2>
            <PriceSummary totals={totals} couponCode={order.couponCode} showCod />
          </section>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link href={orderHref} className={buttonVariants({ size: "lg" })}>
            {awaitingPayment ? "Complete payment" : "Track order"}
          </Link>
          {!awaitingPayment ? (
            <Link href={`${orderHref}/invoice`} className={buttonVariants({ size: "lg", variant: "outline" })}>
              <Download className="size-4" aria-hidden />
              Download invoice
            </Link>
          ) : null}
          <Link href="/shop" className={buttonVariants({ size: "lg", variant: "ghost" })}>
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
