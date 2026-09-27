import Link from "next/link";
import { StatusBadge } from "@/components/common/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatINR } from "@/lib/format";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import type { AdminPayment } from "@/server/admin/orders";

function Reference({ p }: { p: AdminPayment }) {
  return (
    <>
      <span className="font-mono text-xs break-all">{p.providerPaymentId ?? "—"}</span>
      {p.failureReason ? <p className="text-xs whitespace-normal text-destructive">{p.failureReason}</p> : null}
    </>
  );
}

export function PaymentsList({ payments }: { payments: AdminPayment[] }) {
  return (
    <>
      <ul className="divide-y md:hidden">
        {payments.map((p) => {
          const meta = PAYMENT_STATUS_META[p.status];
          return (
            <li key={p.id} className="space-y-1.5 px-4 py-3.5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/orders/${p.order.id}`} className="font-mono font-semibold hover:underline">
                    {p.order.orderNumber}
                  </Link>
                  <p>{p.order.user?.name ?? "Customer"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">{formatINR(p.amount)}</p>
                  <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {PAYMENT_METHOD_LABEL[p.method]} · {formatDateTime(p.createdAt)}
              </p>
              <Reference p={p} />
            </li>
          );
        })}
      </ul>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Payment ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => {
              const meta = PAYMENT_STATUS_META[p.status];
              return (
                <TableRow key={p.id} className="align-top">
                  <TableCell className="max-w-64 pl-5">
                    <Reference p={p} />
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/orders/${p.order.id}`} className="font-mono text-[0.8rem] font-semibold hover:underline">
                      {p.order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {p.order.user ? (
                      <Link href={`/admin/customers/${p.order.user.id}`} className="hover:underline">
                        {p.order.user.name ?? "Customer"}
                      </Link>
                    ) : (
                      "Customer"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{PAYMENT_METHOD_LABEL[p.method]}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatINR(p.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </TableCell>
                  <TableCell className="pr-5 text-muted-foreground">{formatDateTime(p.createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
