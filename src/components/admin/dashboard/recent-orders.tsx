import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { AdminCard } from "@/components/admin/admin-page-header";
import { formatDateTime, formatINR } from "@/lib/format";
import { ORDER_STATUS_META, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";

type Row = {
  id: string;
  orderNumber: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  user: { name: string | null; phone: string | null };
};

export function RecentOrders({ orders }: { orders: Row[] }) {
  return (
    <AdminCard
      title="Recent orders"
      action={
        <Link href="/admin/orders" className="text-xs font-medium text-terracotta hover:underline">
          View all
        </Link>
      }
    >
      {orders.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No orders yet" description="New orders will appear here as soon as customers check out." className="py-10 [&_h2]:text-lg" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="pr-5 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="pl-5">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-terracotta hover:underline">
                    #{o.orderNumber}
                  </Link>
                  <p className="text-xs text-muted-foreground">{formatDateTime(o.createdAt)}</p>
                </TableCell>
                <TableCell className="max-w-40 truncate">{o.user.name ?? o.user.phone ?? "Guest"}</TableCell>
                <TableCell>
                  <StatusBadge tone={ORDER_STATUS_META[o.status].tone}>{ORDER_STATUS_META[o.status].label}</StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={PAYMENT_STATUS_META[o.paymentStatus].tone}>{PAYMENT_STATUS_META[o.paymentStatus].label}</StatusBadge>
                  <p className="mt-0.5 text-xs text-muted-foreground">{PAYMENT_METHOD_LABEL[o.paymentMethod]}</p>
                </TableCell>
                <TableCell className="pr-5 text-right font-medium tabular-nums">{formatINR(o.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminCard>
  );
}
