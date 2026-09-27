import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { formatINR } from "@/lib/format";
import { getDashboardData } from "@/server/admin/dashboard";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { LowStockList, OrdersByStatus, PendingActions, TopProducts } from "@/components/admin/dashboard/side-panels";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const d = await getDashboardData();
  const firstName = admin.name?.split(" ")[0];
  const total = d.revenueByDay.reduce((s, x) => s + x.revenue, 0);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title={firstName ? `Namaste, ${firstName}` : "Dashboard"}
        description="How LushAura is doing over the last 30 days."
      />

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard label="Revenue" value={formatINR(d.kpis.revenue.value)} current={d.kpis.revenue.value} previous={d.kpis.revenue.previous} hint="Paid orders + delivered COD" />
        <KpiCard label="Orders" value={d.kpis.orders.value.toLocaleString("en-IN")} current={d.kpis.orders.value} previous={d.kpis.orders.previous} hint="Excludes unpaid & cancelled" />
        <KpiCard label="Average order value" value={formatINR(d.kpis.aov.value)} current={d.kpis.aov.value} previous={d.kpis.aov.previous} />
        <KpiCard label="New customers" value={d.kpis.customers.value.toLocaleString("en-IN")} current={d.kpis.customers.value} previous={d.kpis.customers.previous} />
      </section>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
          <AdminCard title="Revenue per day" action={<span className="text-xs text-muted-foreground tabular-nums">Last 30 days · {formatINR(total)}</span>}>
            <div className="px-3 pt-4 pb-4 sm:px-5">
              <RevenueChart data={d.revenueByDay} />
            </div>
          </AdminCard>
          <RecentOrders orders={d.recentOrders} />
        </div>
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <PendingActions {...d.pending} />
          <OrdersByStatus counts={d.statusCounts} />
          <LowStockList items={d.lowStock} />
          <TopProducts items={d.topProducts} />
        </div>
      </div>
    </div>
  );
}
