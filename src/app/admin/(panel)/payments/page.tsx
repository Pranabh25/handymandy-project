import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/common/empty-state";
import { DemoNotice } from "@/components/common/demo-notice";
import { Pagination, StatTile, hrefWith } from "@/components/admin/orders/list-controls";
import { OrdersFilters } from "@/components/admin/orders/orders-filters";
import { PaymentsList } from "@/components/admin/payments/payments-list";
import { formatINR, pluralize } from "@/lib/format";
import { ADMIN_PAGE_SIZE, listPayments, parsePaymentFilters } from "@/server/admin/orders";

export const metadata: Metadata = { title: "Payments" };

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const filters = parsePaymentFilters(await searchParams);
  const { payments, total, pageCount, summary } = await listPayments(filters);
  const params = { status: filters.status, method: filters.method };
  const filtered = Boolean(filters.status || filters.method);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Payments" description="Every payment attempt across prepaid and Cash on Delivery orders." />
      <DemoNotice className="mb-5">
        Demo gateway — Razorpay test-mode simulation. Payment IDs are generated locally and no real money is captured.
      </DemoNotice>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Captured · last 30 days" value={formatINR(summary.captured)} hint={pluralize(summary.capturedCount, "payment")} />
        <StatTile label="Failed attempts · 30 days" value={String(summary.failedCount)} hint="Declined or abandoned" />
        <StatTile
          label="COD pending collection"
          value={formatINR(summary.codPending)}
          hint={pluralize(summary.codPendingCount, "open order")}
        />
        <StatTile label="Refunded · last 30 days" value={formatINR(summary.refunded)} hint={pluralize(summary.refundedCount, "refund")} />
      </div>
      <AdminCard>
        <OrdersFilters params={params} showSearch={false} showRange={false} statusKey="status" />
        <div className="border-t">
          {payments.length ? (
            <PaymentsList payments={payments} />
          ) : (
            <EmptyState
              icon={CreditCard}
              title={filtered ? "No matching payments" : "No payments yet"}
              description={
                filtered ? "Try a different method or status." : "Payment attempts appear here as soon as customers check out."
              }
              action={filtered ? { label: "Clear filters", href: "/admin/payments" } : undefined}
              className="py-12 [&_h2]:font-sans [&_h2]:text-lg"
            />
          )}
        </div>
        <Pagination
          page={filters.page}
          pageCount={pageCount}
          total={total}
          pageSize={ADMIN_PAGE_SIZE}
          hrefFor={(p) => hrefWith("/admin/payments", params, { page: String(p) })}
        />
      </AdminCard>
    </div>
  );
}
