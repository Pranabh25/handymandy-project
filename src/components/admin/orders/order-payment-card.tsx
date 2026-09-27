import { AdminCard } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDateTime, formatINR } from "@/lib/format";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import type { OrderDetail } from "@/server/orders";

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-base font-semibold" : ""} ${muted ? "text-muted-foreground" : ""}`}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export function OrderPaymentCard({ order }: { order: OrderDetail }) {
  const mrpSavings = order.mrpTotal - order.subtotal;
  const payments = [...order.payments].reverse();
  return (
    <AdminCard title="Payment">
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <dl className="space-y-1.5 text-sm">
          {mrpSavings > 0 ? <Row label="MRP total" value={formatINR(order.mrpTotal)} muted /> : null}
          <Row label="Subtotal" value={formatINR(order.subtotal)} />
          {order.discount > 0 ? (
            <Row label={`Coupon${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`− ${formatINR(order.discount)}`} />
          ) : null}
          <Row label="Shipping" value={order.shippingFee ? formatINR(order.shippingFee) : "Free"} />
          {order.giftWrapFee > 0 ? <Row label="Gift wrap" value={formatINR(order.giftWrapFee)} /> : null}
          {order.codFee > 0 ? <Row label="COD fee" value={formatINR(order.codFee)} /> : null}
          <div className="my-2 border-t" />
          <Row label="Total" value={formatINR(order.total)} strong />
          <p className="pt-1 text-xs text-muted-foreground">Prices inclusive of GST</p>
        </dl>
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Payment attempts</p>
          {payments.length ? (
            <ul className="space-y-2">
              {payments.map((p) => {
                const meta = PAYMENT_STATUS_META[p.status];
                return (
                  <li key={p.id} className="rounded-lg border px-3 py-2.5 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{PAYMENT_METHOD_LABEL[p.method]}</span>
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    </div>
                    <div className="mt-1 flex flex-wrap justify-between gap-x-3 text-xs text-muted-foreground">
                      <span className="font-mono break-all">{p.providerPaymentId ?? "No gateway reference"}</span>
                      <span className="tabular-nums">
                        {formatINR(p.amount)} · {formatDateTime(p.createdAt)}
                      </span>
                    </div>
                    {p.failureReason ? <p className="mt-1 text-xs text-destructive">{p.failureReason}</p> : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No payment attempts recorded.</p>
          )}
        </div>
      </div>
    </AdminCard>
  );
}
