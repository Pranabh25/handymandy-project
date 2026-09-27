import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/common/empty-state";
import { DemoNotice } from "@/components/common/demo-notice";
import { FilterTabs, StatTile } from "@/components/admin/orders/list-controls";
import { RefundsList } from "@/components/admin/refunds/refunds-list";
import { formatINR, pluralize } from "@/lib/format";
import { REFUND_STATUS_META } from "@/lib/order-status";
import { listRefunds } from "@/server/admin/orders";
import type { RefundStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = { title: "Refunds" };

const TABS: RefundStatus[] = ["PENDING", "PROCESSED", "FAILED"];

const EMPTY: Record<RefundStatus, { title: string; description: string }> = {
  PENDING: { title: "No refunds waiting", description: "Refunds are created automatically when a paid order is cancelled." },
  PROCESSED: { title: "No processed refunds yet", description: "Completed refunds appear here with their gateway reference." },
  FAILED: { title: "No failed refunds", description: "Refunds the gateway rejects appear here so you can retry them." },
};

export default async function AdminRefundsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const tab = TABS.find((t) => t === sp.tab) ?? "PENDING";
  const { refunds, counts, pendingAmount, refundedThisMonth, refundedThisMonthCount } = await listRefunds(tab);
  const monthName = new Intl.DateTimeFormat("en-IN", { month: "long" }).format(new Date());

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Refunds" description="Return money to customers for cancelled prepaid orders." />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatTile label="Pending refunds" value={formatINR(pendingAmount)} hint={pluralize(counts.PENDING ?? 0, "refund")} />
        <StatTile
          label={`Refunded in ${monthName}`}
          value={formatINR(refundedThisMonth)}
          hint={pluralize(refundedThisMonthCount, "refund")}
        />
        <StatTile label="Failed" value={String(counts.FAILED ?? 0)} hint="Need a retry" />
      </div>
      <DemoNotice className="mb-4">Refunds run against the Razorpay test-mode simulation. No real money moves.</DemoNotice>
      <div className="mb-4">
        <FilterTabs
          label="Filter refunds"
          tabs={TABS.map((t) => ({
            label: REFUND_STATUS_META[t].label,
            href: t === "PENDING" ? "/admin/refunds" : `/admin/refunds?tab=${t}`,
            active: tab === t,
            count: counts[t] ?? 0,
          }))}
        />
      </div>
      <AdminCard>
        {refunds.length ? (
          <RefundsList refunds={refunds} />
        ) : (
          <EmptyState icon={RotateCcw} {...EMPTY[tab]} className="py-12 [&_h2]:font-sans [&_h2]:text-lg" />
        )}
      </AdminCard>
    </div>
  );
}
