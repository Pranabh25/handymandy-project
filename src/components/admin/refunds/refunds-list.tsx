import Link from "next/link";
import { StatusBadge } from "@/components/common/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatINR } from "@/lib/format";
import { PAYMENT_METHOD_LABEL, REFUND_STATUS_META } from "@/lib/order-status";
import type { AdminRefund } from "@/server/admin/orders";
import { MarkRefundFailedButton, ProcessRefundDialog } from "./refund-actions";

function methodOf(r: AdminRefund) {
  return PAYMENT_METHOD_LABEL[r.payment?.method ?? r.order.paymentMethod];
}

function Actions({ r }: { r: AdminRefund }) {
  if (r.status === "PROCESSED") return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      <ProcessRefundDialog
        refundId={r.id}
        orderNumber={r.order.orderNumber}
        amount={r.amount}
        methodLabel={methodOf(r)}
        retry={r.status === "FAILED"}
      />
      {r.status === "PENDING" ? <MarkRefundFailedButton refundId={r.id} orderNumber={r.order.orderNumber} /> : null}
    </div>
  );
}

export function RefundsList({ refunds }: { refunds: AdminRefund[] }) {
  const showActions = refunds.some((r) => r.status !== "PROCESSED");
  return (
    <>
      <ul className="divide-y md:hidden">
        {refunds.map((r) => {
          const meta = REFUND_STATUS_META[r.status];
          return (
            <li key={r.id} className="space-y-2 px-4 py-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/orders/${r.order.id}`} className="font-mono font-semibold hover:underline">
                    {r.order.orderNumber}
                  </Link>
                  <p>{r.order.user?.name ?? "Customer"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">{formatINR(r.amount)}</p>
                  <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                </div>
              </div>
              <p className="text-muted-foreground">{r.reason}</p>
              <p className="text-xs text-muted-foreground">
                {methodOf(r)} · {formatDateTime(r.createdAt)}
              </p>
              {r.reference ? <p className="font-mono text-xs break-all">Ref {r.reference}</p> : null}
              <Actions r={r} />
            </li>
          );
        })}
      </ul>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className={showActions ? undefined : "pr-5"}>Reference</TableHead>
              {showActions ? <TableHead className="pr-5">Action</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {refunds.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="pl-5">
                  <Link href={`/admin/orders/${r.order.id}`} className="font-mono text-[0.8rem] font-semibold hover:underline">
                    {r.order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  {r.order.user ? (
                    <Link href={`/admin/customers/${r.order.user.id}`} className="hover:underline">
                      {r.order.user.name ?? "Customer"}
                    </Link>
                  ) : (
                    "Customer"
                  )}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatINR(r.amount)}</TableCell>
                <TableCell className="text-muted-foreground">{methodOf(r)}</TableCell>
                <TableCell>
                  <p className="line-clamp-2 max-w-64 whitespace-normal">{r.reason}</p>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(r.createdAt)}
                  {r.processedAt ? <p className="text-xs">Processed {formatDateTime(r.processedAt)}</p> : null}
                </TableCell>
                <TableCell className={showActions ? "font-mono text-xs" : "pr-5 font-mono text-xs"}>
                  {r.reference ?? <span className="font-sans text-muted-foreground">—</span>}
                </TableCell>
                {showActions ? (
                  <TableCell className="pr-5">
                    <Actions r={r} />
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
