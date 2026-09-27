import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/common/empty-state";
import { OrderCard, orderCardSelect } from "@/components/account/order-card";
import { ORDER_FILTERS, parseFilter, statusesForFilter } from "@/components/account/order-utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

const EMPTY_COPY = {
  all: { title: "No orders yet", description: "Once you place an order, you can track it, download invoices and request cancellations here." },
  active: { title: "Nothing on its way", description: "You have no orders in progress right now." },
  delivered: { title: "No delivered orders yet", description: "Delivered orders will appear here, ready for a review." },
  cancelled: { title: "No cancelled orders", description: "Good news — none of your orders have been cancelled." },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser("/account/orders");
  const filter = parseFilter((await searchParams).status);
  const statuses = statusesForFilter(filter);

  const [orders, counts] = await Promise.all([
    db.order.findMany({
      where: { userId: user.id, ...(statuses ? { status: { in: statuses } } : {}) },
      orderBy: { createdAt: "desc" },
      select: orderCardSelect,
      take: 50,
    }),
    db.order.groupBy({ by: ["status"], where: { userId: user.id }, _count: { _all: true } }),
  ]);

  const countFor = (key: (typeof ORDER_FILTERS)[number]["key"]) => {
    const s = statusesForFilter(key);
    return counts.filter((c) => !s || s.includes(c.status)).reduce((n, c) => n + c._count._all, 0);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">Your orders</h2>
      </div>

      <nav aria-label="Filter orders" className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-1 rounded-lg bg-muted p-1">
          {ORDER_FILTERS.map((f) => {
            const active = f.key === filter;
            return (
              <li key={f.key}>
                <Link
                  href={f.key === "all" ? "/account/orders" : `/account/orders?status=${f.key}`}
                  aria-current={active ? "page" : undefined}
                  scroll={false}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors",
                    active ? "bg-card font-medium text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                  <span className="text-xs text-muted-foreground tabular-nums">{countFor(f.key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {orders.length ? (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.orderNumber} order={o} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={Package}
            title={EMPTY_COPY[filter].title}
            description={EMPTY_COPY[filter].description}
            action={filter === "all" ? { label: "Start shopping", href: "/shop" } : { label: "View all orders", href: "/account/orders" }}
          />
        </div>
      )}
    </div>
  );
}
