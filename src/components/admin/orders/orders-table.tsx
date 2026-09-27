import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDateTime, formatINR, pluralize } from "@/lib/format";
import { ORDER_STATUS_META, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import type { AdminOrderRow } from "@/server/admin/orders";
import type { ShippingAddress } from "@/types";
import { ClickableRow } from "./clickable-row";

function customerName(o: AdminOrderRow) {
  return o.user?.name || (o.shippingAddress as ShippingAddress | null)?.fullName || "Guest";
}

function itemCount(o: AdminOrderRow) {
  return o.items.reduce((n, i) => n + i.quantity, 0);
}

const SHORT_METHOD: Record<string, string> = { UPI: "UPI", CARD: "Card", NETBANKING: "Net banking", WALLET: "Wallet", COD: "COD" };

function CancelFlag({ o }: { o: AdminOrderRow }) {
  if (o.cancellation?.status !== "REQUESTED") return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-terracotta" title="Customer requested cancellation">
      <CircleAlert className="size-3.5" aria-hidden /> Cancel requested
    </span>
  );
}

export function OrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  return (
    <>
      {/* Mobile: stacked cards */}
      <ul className="divide-y md:hidden">
        {orders.map((o) => {
          const status = ORDER_STATUS_META[o.status];
          const pay = PAYMENT_STATUS_META[o.paymentStatus];
          return (
            <li key={o.id}>
              <Link href={`/admin/orders/${o.id}`} className="block px-4 py-3.5 hover:bg-muted/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold">{o.orderNumber}</p>
                    <p className="truncate text-sm">{customerName(o)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(o.createdAt)} · {pluralize(itemCount(o), "item")}
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums">{formatINR(o.total)}</p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  <StatusBadge tone={pay.tone}>
                    {SHORT_METHOD[o.paymentMethod]} · {pay.label}
                  </StatusBadge>
                  <CancelFlag o={o} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop: table (scrolls inside the card if narrow) */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="pr-5">Fulfilment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => {
              const status = ORDER_STATUS_META[o.status];
              const pay = PAYMENT_STATUS_META[o.paymentStatus];
              return (
                <ClickableRow key={o.id} href={`/admin/orders/${o.id}`}>
                  <TableCell className="pl-5">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-[0.8rem] font-semibold hover:underline">
                      {o.orderNumber}
                    </Link>
                    <div>
                      <CancelFlag o={o} />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(o.createdAt)}</TableCell>
                  <TableCell>
                    <p className="max-w-48 truncate">{customerName(o)}</p>
                    <p className="text-xs text-muted-foreground">{o.phone}</p>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{itemCount(o)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatINR(o.total)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground" title={PAYMENT_METHOD_LABEL[o.paymentMethod]}>
                        {SHORT_METHOD[o.paymentMethod]}
                      </span>
                      <StatusBadge tone={pay.tone}>{pay.label}</StatusBadge>
                    </div>
                  </TableCell>
                  <TableCell className="pr-5">
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </TableCell>
                </ClickableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
