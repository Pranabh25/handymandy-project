import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleAlert, FileText, Truck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { OrderItemsCard } from "@/components/admin/orders/order-items-card";
import { OrderPaymentCard } from "@/components/admin/orders/order-payment-card";
import { OrderCustomerCard } from "@/components/admin/orders/order-customer-card";
import { OrderTimeline } from "@/components/admin/orders/order-timeline";
import { StatusForm } from "@/components/admin/orders/status-form";
import { TrackingEventForm, TrackingForm } from "@/components/admin/orders/tracking-forms";
import { OrderCancellationCard, OrderRefundsCard } from "@/components/admin/orders/order-resolution-cards";
import { formatDateTime, formatShortDate } from "@/lib/format";
import { ORDER_STATUS_META, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import { getOrderById } from "@/server/orders";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderById(id);
  return { title: order ? `Order ${order.orderNumber}` : "Order not found" };
}

const isoDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const status = ORDER_STATUS_META[order.status];
  const pay = PAYMENT_STATUS_META[order.paymentStatus];
  const cancelled = order.status === "CANCELLED";
  const shippedOrLater = ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status);
  const pendingCancellation = order.cancellation?.status === "REQUESTED";

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed ${formatDateTime(order.createdAt)} · ${PAYMENT_METHOD_LABEL[order.paymentMethod]}`}
        back={{ href: "/admin/orders", label: "All orders" }}
        actions={
          <>
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            <StatusBadge tone={pay.tone}>Payment {pay.label.toLowerCase()}</StatusBadge>
            <Link
              href={`/account/orders/${order.orderNumber}/invoice`}
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <FileText aria-hidden /> View invoice
            </Link>
          </>
        }
      />

      {pendingCancellation ? (
        <div
          role="status"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-terracotta/30 bg-terracotta-soft/60 px-4 py-3 text-sm"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
          <p>
            <span className="font-semibold">The customer has asked to cancel this order.</span> Review the request in the
            panel on the right before packing or shipping.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0 space-y-5">
          <OrderItemsCard order={order} />
          <OrderPaymentCard order={order} />
          <OrderTimeline events={order.events} />
        </div>

        <div className="min-w-0 space-y-5">
          <OrderCancellationCard order={order} />
          <AdminCard title="Fulfilment">
            <div className="p-5">
              <StatusForm
                key={order.status}
                orderId={order.id}
                orderNumber={order.orderNumber}
                status={order.status}
                paid={order.paymentStatus === "PAID"}
                total={order.total}
              />
            </div>
          </AdminCard>

          {!cancelled ? (
            <AdminCard
              title="Shipping & tracking"
              action={
                order.estimatedDelivery ? (
                  <span className="text-xs text-muted-foreground">ETA {formatShortDate(order.estimatedDelivery)}</span>
                ) : undefined
              }
            >
              <div className="p-5">
                {order.trackingNumber ? (
                  <p className="mb-4 flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
                    <Truck className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span>
                      {order.courier} · <span className="font-mono">{order.trackingNumber}</span>
                    </span>
                  </p>
                ) : null}
                <TrackingForm
                  orderId={order.id}
                  status={order.status}
                  courier={order.courier}
                  trackingNumber={order.trackingNumber}
                  estimatedDelivery={order.estimatedDelivery ? isoDay.format(order.estimatedDelivery) : ""}
                />
              </div>
            </AdminCard>
          ) : null}

          {!cancelled && (shippedOrLater || order.trackingNumber) ? (
            <AdminCard title="Add tracking update">
              <div className="p-5">
                <TrackingEventForm orderId={order.id} />
              </div>
            </AdminCard>
          ) : null}

          <OrderRefundsCard order={order} />
          <OrderCustomerCard order={order} />
        </div>
      </div>
    </div>
  );
}
