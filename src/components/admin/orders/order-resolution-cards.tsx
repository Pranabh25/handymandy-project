import { AdminCard } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { ResolveCancellationDialog } from "@/components/admin/cancellations/resolve-cancellation-dialog";
import { MarkRefundFailedButton, ProcessRefundDialog } from "@/components/admin/refunds/refund-actions";
import { formatDateTime, formatINR } from "@/lib/format";
import { CANCELLATION_STATUS_META, PAYMENT_METHOD_LABEL, REFUND_STATUS_META } from "@/lib/order-status";
import type { OrderDetail } from "@/server/orders";

export function OrderCancellationCard({ order }: { order: OrderDetail }) {
  const req = order.cancellation;
  if (!req) return null;
  const meta = CANCELLATION_STATUS_META[req.status];
  const open = req.status === "REQUESTED";
  return (
    <AdminCard
      title="Cancellation request"
      action={<StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>}
      className={open ? "ring-2 ring-terracotta/40" : undefined}
    >
      <div className="space-y-3 p-5 text-sm">
        <div>
          <p className="eyebrow mb-1">Reason</p>
          <p className="font-medium">{req.reason}</p>
          {req.comment ? <p className="mt-1 whitespace-pre-line text-muted-foreground">“{req.comment}”</p> : null}
          <p className="mt-1 text-xs text-muted-foreground">Requested {formatDateTime(req.createdAt)}</p>
        </div>
        {req.adminNote || req.resolvedAt ? (
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">
              {meta.label}
              {req.resolvedAt ? ` · ${formatDateTime(req.resolvedAt)}` : ""}
            </p>
            {req.adminNote ? <p className="mt-1">{req.adminNote}</p> : null}
          </div>
        ) : null}
        {open ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <ResolveCancellationDialog
              requestId={req.id}
              orderNumber={order.orderNumber}
              mode="approve"
              paid={order.paymentStatus === "PAID"}
              total={order.total}
            />
            <ResolveCancellationDialog
              requestId={req.id}
              orderNumber={order.orderNumber}
              mode="reject"
              paid={order.paymentStatus === "PAID"}
              total={order.total}
            />
          </div>
        ) : null}
      </div>
    </AdminCard>
  );
}

export function OrderRefundsCard({ order }: { order: OrderDetail }) {
  if (!order.refunds.length) return null;
  return (
    <AdminCard title="Refunds">
      <ul className="divide-y">
        {order.refunds.map((r) => {
          const meta = REFUND_STATUS_META[r.status];
          const payment = order.payments.find((p) => p.id === r.paymentId);
          const methodLabel = PAYMENT_METHOD_LABEL[payment?.method ?? order.paymentMethod];
          return (
            <li key={r.id} className="space-y-2 px-5 py-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold tabular-nums">{formatINR(r.amount)}</span>
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
              </div>
              <p className="text-muted-foreground">{r.reason}</p>
              <p className="text-xs text-muted-foreground">
                To {methodLabel} · created {formatDateTime(r.createdAt)}
                {r.processedAt ? ` · processed ${formatDateTime(r.processedAt)}` : ""}
              </p>
              {r.reference ? <p className="font-mono text-xs break-all">Ref {r.reference}</p> : null}
              {r.status !== "PROCESSED" ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  <ProcessRefundDialog
                    refundId={r.id}
                    orderNumber={order.orderNumber}
                    amount={r.amount}
                    methodLabel={methodLabel}
                    retry={r.status === "FAILED"}
                  />
                  {r.status === "PENDING" ? <MarkRefundFailedButton refundId={r.id} orderNumber={order.orderNumber} /> : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </AdminCard>
  );
}
