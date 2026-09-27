import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, FileText } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrderForUser } from "@/server/orders";
import { getStoreSettings } from "@/server/settings";
import { CANCELLABLE_STATUSES, ORDER_STATUS_META } from "@/lib/order-status";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/common/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { CancelOrderDialog } from "@/components/account/cancel-order-dialog";
import { HelpBox } from "@/components/account/help-box";
import { OrderEventList, OrderStepper, ShipmentDetails } from "@/components/account/order-timeline";
import {
  CancellationBanner,
  DeliveryAddress,
  GiftMessage,
  OrderItems,
  Panel,
  PaymentInfo,
  PriceSummary,
  RefundList,
} from "@/components/account/order-detail-sections";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ orderNumber: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Order ${decodeURIComponent(orderNumber)}` };
}

export default async function OrderDetailPage({ params }: Params) {
  const { orderNumber: raw } = await params;
  const orderNumber = decodeURIComponent(raw);
  const user = await requireUser(`/account/orders/${orderNumber}`);
  const order = await getOrderForUser(orderNumber, user.id);
  if (!order) notFound();

  const productIds = order.items.map((i) => i.productId).filter((id): id is string => !!id);
  const [products, settings] = await Promise.all([
    db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, slug: true, category: { select: { group: true } } },
    }),
    getStoreSettings(),
  ]);
  const productMeta = new Map(products.map((p) => [p.id, { slug: p.slug, group: p.category.group }]));

  const meta = ORDER_STATUS_META[order.status];
  const pendingRequest = order.cancellation?.status === "REQUESTED";
  const canCancel = CANCELLABLE_STATUSES.includes(order.status) && !pendingRequest;
  const unpaid = order.status === "PENDING_PAYMENT";
  const showInvoice = order.status !== "PENDING_PAYMENT";

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        All orders
      </Link>

      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold md:text-3xl">Order {order.orderNumber}</h2>
            <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {formatDateTime(order.createdAt)} · {meta.description}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {showInvoice ? (
            <Link
              href={`/invoice/${order.orderNumber}`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              <FileText aria-hidden />
              Download invoice
            </Link>
          ) : null}
          {canCancel ? <CancelOrderDialog orderNumber={order.orderNumber} unpaid={unpaid} /> : null}
        </div>
      </header>

      {unpaid ? (
        <div role="status" className="flex gap-3 rounded-xl border border-[#ecdcbc] bg-[#f7ecd8] p-4 text-sm text-[#6b4f19]">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-medium">Payment pending</p>
            <p className="mt-0.5 leading-6">
              We haven&apos;t received payment for this order yet, so it hasn&apos;t been confirmed. To complete your
              purchase, place the order again from your cart, or contact us and we&apos;ll help you finish it. Unpaid
              orders can be cancelled at any time.
            </p>
          </div>
        </div>
      ) : null}

      <CancellationBanner order={order} />

      <Panel title="Tracking">
        <OrderStepper status={order.status} events={order.events} estimatedDelivery={order.estimatedDelivery} />
        {order.status !== "PENDING_PAYMENT" ? (
          <div className="mt-6 border-t pt-5">
            <ShipmentDetails
              courier={order.courier}
              trackingNumber={order.trackingNumber}
              estimatedDelivery={order.estimatedDelivery}
              status={order.status}
            />
          </div>
        ) : null}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <Panel title={`Items (${order.items.length})`}>
            <OrderItems order={order} products={productMeta} />
          </Panel>
          <GiftMessage order={order} />
          <Panel title="Order history">
            <OrderEventList events={order.events} />
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Price details">
            <PriceSummary order={order} />
          </Panel>
          <Panel title="Payment">
            <PaymentInfo order={order} />
          </Panel>
          {order.refunds.length ? (
            <Panel title="Refunds">
              <RefundList order={order} />
            </Panel>
          ) : null}
          <Panel title="Delivery address">
            <DeliveryAddress order={order} />
          </Panel>
          <HelpBox
            supportEmail={settings.supportEmail}
            supportPhone={settings.supportPhone}
            whatsapp={settings.whatsappNumber}
            orderNumber={order.orderNumber}
          />
        </div>
      </div>
    </div>
  );
}
