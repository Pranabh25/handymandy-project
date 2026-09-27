import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatINR, formatPhone } from "@/lib/format";
import { getAdminCustomers } from "@/server/admin/customers";
import { ADMIN_PAGE_SIZE } from "@/server/admin/products";
import { pageParam, param, type SearchParams } from "@/server/admin/params";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { ListToolbar } from "@/components/admin/shared/list-toolbar";
import { AdminPagination } from "@/components/admin/shared/pagination";
import { EmptyState } from "@/components/common/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = param(sp, "q");
  const data = await getAdminCustomers({ q, page: pageParam(sp) });

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Customers" description={`${data.total} ${data.total === 1 ? "customer" : "customers"}${q ? " match your search" : ""}`} />
      <AdminCard>
        <ListToolbar searchPlaceholder="Search by name, phone or email" />
        {data.items.length === 0 ? (
          <EmptyState icon={Users} title={q ? "No customers match" : "No customers yet"} description={q ? "Try a different name, number or email." : "Customers appear here after they sign in with OTP."} className="[&_h2]:text-xl" />
        ) : (
          <>
            <ul className="divide-y md:hidden">
              {data.items.map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/customers/${c.id}`} className="block px-4 py-3 hover:bg-muted/50">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm font-medium">{c.name ?? "Unnamed customer"}</p>
                      <p className="text-sm font-medium tabular-nums">{formatINR(c.totalSpent)}</p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{[c.phone ? formatPhone(c.phone) : null, c.email].filter(Boolean).join(" · ")}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.orderCount} {c.orderCount === 1 ? "order" : "orders"} · joined {formatDate(c.createdAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Total spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="pr-5">Last order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="pl-5">
                        <Link href={`/admin/customers/${c.id}`} className="font-medium hover:text-terracotta">
                          {c.name ?? "Unnamed customer"}
                        </Link>
                        <p className="max-w-60 truncate text-xs text-muted-foreground">{c.email ?? "No email"}</p>
                      </TableCell>
                      <TableCell className="tabular-nums">{c.phone ? formatPhone(c.phone) : "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">{c.orderCount}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatINR(c.totalSpent)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                      <TableCell className="pr-5 text-muted-foreground">{c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        <AdminPagination basePath="/admin/customers" searchParams={sp} page={data.page} pageCount={data.pageCount} total={data.total} pageSize={ADMIN_PAGE_SIZE} />
      </AdminCard>
    </div>
  );
}
