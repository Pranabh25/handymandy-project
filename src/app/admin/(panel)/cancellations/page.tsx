import type { Metadata } from "next";
import { Ban } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/common/empty-state";
import { FilterTabs } from "@/components/admin/orders/list-controls";
import { CancellationsList } from "@/components/admin/cancellations/cancellations-list";
import { CANCELLATION_STATUS_META } from "@/lib/order-status";
import { listCancellations } from "@/server/admin/orders";
import type { CancellationStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = { title: "Cancellations" };

const TABS: CancellationStatus[] = ["REQUESTED", "APPROVED", "REJECTED"];

const EMPTY: Record<CancellationStatus, { title: string; description: string }> = {
  REQUESTED: { title: "No pending requests", description: "When a customer asks to cancel an order before it ships, it lands here." },
  APPROVED: { title: "No approved cancellations", description: "Approved requests and their refunds will be listed here." },
  REJECTED: { title: "No rejected requests", description: "Requests you decline will be listed here with your note." },
};

export default async function AdminCancellationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const tab = TABS.find((t) => t === sp.tab) ?? "REQUESTED";
  const { requests, counts } = await listCancellations(tab);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Cancellations"
        description="Approving cancels the order, returns items to stock and creates a pending refund for prepaid orders."
      />
      <div className="mb-4">
        <FilterTabs
          label="Filter cancellation requests"
          tabs={TABS.map((t) => ({
            label: CANCELLATION_STATUS_META[t].label,
            href: t === "REQUESTED" ? "/admin/cancellations" : `/admin/cancellations?tab=${t}`,
            active: tab === t,
            count: counts[t] ?? 0,
          }))}
        />
      </div>
      <AdminCard>
        {requests.length ? (
          <CancellationsList requests={requests} />
        ) : (
          <EmptyState icon={Ban} {...EMPTY[tab]} className="py-12 [&_h2]:font-sans [&_h2]:text-lg" />
        )}
      </AdminCard>
    </div>
  );
}
