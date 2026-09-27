import Link from "next/link";
import { StatusBadge } from "@/components/common/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatINR } from "@/lib/format";
import { ORDER_STATUS_META, PAYMENT_STATUS_META } from "@/lib/order-status";
import type { AdminCancellation } from "@/server/admin/orders";
import { ResolveCancellationDialog } from "./resolve-cancellation-dialog";

function Actions({ r }: { r: AdminCancellation }) {
  if (r.status !== "REQUESTED") {
    return r.adminNote ? <p className="max-w-56 text-xs whitespace-normal text-muted-foreground">{r.adminNote}</p> : null;
  }
  const paid = r.order.paymentStatus === "PAID";
  return (
    <div className="flex gap-2">
      <ResolveCancellationDialog requestId={r.id} orderNumber={r.order.orderNumber} mode="approve" paid={paid} total={r.order.total} />
      <ResolveCancellationDialog requestId={r.id} orderNumber={r.order.orderNumber} mode="reject" paid={paid} total={r.order.total} />
    </div>
  );
}

function Reason({ r }: { r: AdminCancellation }) {
  return (
    <div className="max-w-72 whitespace-normal">
      <p className="font-medium">{r.reason}</p>
      {r.comment ? <p className="line-clamp-2 text-xs text-muted-foreground">“{r.comment}”</p> : null}
    </div>
  );
}

export function CancellationsList({ requests }: { requests: AdminCancellation[] }) {
  return (
    <>
      <ul className="divide-y md:hidden">
        {requests.map((r) => {
          const pay = PAYMENT_STATUS_META[r.order.paymentStatus];
          const status = ORDER_STATUS_META[r.order.status];
          return (
            <li key={r.id} className="space-y-2.5 px-4 py-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/orders/${r.order.id}`} className="font-mono font-semibold hover:underline">
                    {r.order.orderNumber}
                  </Link>
                  <p>{r.order.user?.name ?? "Customer"}</p>
                </div>
                <p className="font-semibold tabular-nums">{formatINR(r.order.total)}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                <StatusBadge tone={pay.tone}>Payment {pay.label.toLowerCase()}</StatusBadge>
              </div>
              <Reason r={r} />
              <p className="text-xs text-muted-foreground">Requested {formatDateTime(r.createdAt)}</p>
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
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="pr-5">{requests[0]?.status === "REQUESTED" ? "Action" : "Admin note"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r) => {
              const pay = PAYMENT_STATUS_META[r.order.paymentStatus];
              return (
                <TableRow key={r.id} className="align-top">
                  <TableCell className="pl-5">
                    <Link href={`/admin/orders/${r.order.id}`} className="font-mono text-[0.8rem] font-semibold hover:underline">
                      {r.order.orderNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground">{ORDER_STATUS_META[r.order.status].label}</p>
                  </TableCell>
                  <TableCell>
                    {r.order.user ? (
                      <Link href={`/admin/customers/${r.order.user.id}`} className="hover:underline">
                        {r.order.user.name ?? "Customer"}
                      </Link>
                    ) : (
                      "Customer"
                    )}
                    <p className="text-xs text-muted-foreground">{r.order.user?.phone ?? r.order.user?.email}</p>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatINR(r.order.total)}</TableCell>
                  <TableCell>
                    <StatusBadge tone={pay.tone}>{pay.label}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <Reason r={r} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(r.createdAt)}
                    {r.resolvedAt ? <p className="text-xs">Resolved {formatDateTime(r.resolvedAt)}</p> : null}
                  </TableCell>
                  <TableCell className="pr-5">
                    <Actions r={r} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
