import type { Metadata } from "next";
import { Download, ShoppingCart } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { FilterTabs, Pagination, hrefWith } from "@/components/admin/orders/list-controls";
import { OrdersFilters } from "@/components/admin/orders/orders-filters";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { ORDER_STATUS_META } from "@/lib/order-status";
import { ADMIN_PAGE_SIZE, listAdminOrders, parseOrderFilters } from "@/server/admin/orders";
import type { OrderStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = { title: "Orders" };

const TAB_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const filters = parseOrderFilters(await searchParams);
  const { orders, total, counts, all, pageCount } = await listAdminOrders(filters);

  const params = { q: filters.q, status: filters.status, method: filters.method, pay: filters.pay, range: filters.range };
  const base = "/admin/orders";
  const tabs = [
    { label: "All", href: hrefWith(base, params, { status: undefined }), active: !filters.status, count: all },
    ...TAB_STATUSES.map((s) => ({
      label: ORDER_STATUS_META[s].label,
      href: hrefWith(base, params, { status: s }),
      active: filters.status === s,
      count: counts[s] ?? 0,
    })),
  ];
  const exportHref = hrefWith("/api/admin/orders/export", params);
  const filtered = Boolean(filters.q || filters.status || filters.method || filters.pay || filters.range);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Orders"
        description="Track, fulfil and resolve every order placed on the store."
        actions={
          <a href={exportHref} className={buttonVariants({ variant: "outline", size: "sm" })} download>
            <Download aria-hidden /> Export CSV
          </a>
        }
      />
      <div className="mb-4">
        <FilterTabs tabs={tabs} label="Filter orders by status" />
      </div>
      <AdminCard>
        <OrdersFilters params={params} />
        <div className="border-t">
          {orders.length ? (
            <OrdersTable orders={orders} />
          ) : (
            <EmptyState
              icon={ShoppingCart}
              title={filtered ? "No matching orders" : "No orders yet"}
              description={
                filtered
                  ? "Try a different search, status or date range."
                  : "Orders placed on the storefront will appear here for fulfilment."
              }
              action={filtered ? { label: "Clear filters", href: base } : undefined}
              className="py-12 [&_h2]:font-sans [&_h2]:text-lg"
            />
          )}
        </div>
        <Pagination
          page={filters.page}
          pageCount={pageCount}
          total={total}
          pageSize={ADMIN_PAGE_SIZE}
          hrefFor={(p) => hrefWith(base, params, { page: String(p) })}
        />
      </AdminCard>
    </div>
  );
}
