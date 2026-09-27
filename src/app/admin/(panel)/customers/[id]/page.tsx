import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShoppingBag } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatDateTime, formatINR, formatPhone } from "@/lib/format";
import { ORDER_STATUS_META, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import { getAdminCustomer } from "@/server/admin/customers";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Customer" };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-soft">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const c = await getAdminCustomer(id);
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader title={c.name ?? "Unnamed customer"} description={`Customer since ${formatDate(c.createdAt)}`} back={{ href: "/admin/customers", label: "Customers" }} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Lifetime spend" value={formatINR(c.totalSpent)} />
        <Stat label="Orders" value={String(c.orders.length)} />
        <Stat label="Average order" value={formatINR(c.aov)} />
        <Stat label="Reviews written" value={String(c._count.reviews)} />
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <AdminCard title="Contact">
            <dl className="space-y-3 px-5 py-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Mobile</dt>
                <dd className="tabular-nums">{c.phone ? <a href={`tel:+91${c.phone}`} className="hover:text-terracotta">{formatPhone(c.phone)}</a> : "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="break-all">{c.email ? <a href={`mailto:${c.email}`} className="hover:text-terracotta">{c.email}</a> : "Not provided"}</dd>
              </div>
            </dl>
          </AdminCard>
          <AdminCard title={`Saved addresses (${c.addresses.length})`}>
            {c.addresses.length === 0 ? (
              <p className="flex items-center gap-2 px-5 py-4 text-sm text-muted-foreground">
                <MapPin className="size-4" aria-hidden /> No saved addresses.
              </p>
            ) : (
              <ul className="divide-y">
                {c.addresses.map((a) => (
                  <li key={a.id} className="px-5 py-3 text-sm">
                    <p className="flex items-center gap-2 font-medium">
                      {a.fullName}
                      <StatusBadge tone="neutral">{a.type === "HOME" ? "Home" : a.type === "WORK" ? "Work" : "Other"}</StatusBadge>
                      {a.isDefault ? <StatusBadge tone="accent">Default</StatusBadge> : null}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {[a.line1, a.line2, a.landmark].filter(Boolean).join(", ")}
                      <br />
                      {a.city}, {a.state} {a.pincode}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">{formatPhone(a.phone)}</p>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>

        <div className="min-w-0 lg:col-span-2">
          <AdminCard title="Order history">
            {c.orders.length === 0 ? (
              <EmptyState icon={ShoppingBag} title="No orders yet" description="This customer hasn't placed an order." className="py-10 [&_h2]:text-lg" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="pr-5 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {c.orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="pl-5">
                        <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-terracotta hover:underline">
                          #{o.orderNumber}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(o.createdAt)} · {o._count.items} {o._count.items === 1 ? "item" : "items"}
                        </p>
                      </TableCell>
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
        </div>
      </div>
    </div>
  );
}
