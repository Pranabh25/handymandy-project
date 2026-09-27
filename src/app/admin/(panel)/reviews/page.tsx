import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, MessageSquareQuote, Star } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { getReviewQueue } from "@/server/admin/marketing";
import { pageParam, param, type SearchParams } from "@/server/admin/params";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { SegmentedLinks } from "@/components/admin/shared/segmented-links";
import { AdminPagination } from "@/components/admin/shared/pagination";
import { REVIEW_STATUS_META } from "@/components/admin/shared/status-meta";
import { ReviewActions } from "@/components/admin/reviews/review-actions";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";

export const metadata: Metadata = { title: "Reviews" };

const TABS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
] as const;
type TabValue = (typeof TABS)[number]["value"];

const EMPTY: Record<TabValue, { title: string; description: string }> = {
  PENDING: { title: "No reviews to moderate", description: "New customer reviews land here before they appear on the store." },
  APPROVED: { title: "No approved reviews yet", description: "Approved reviews are published on product pages." },
  REJECTED: { title: "No rejected reviews", description: "Reviews you reject stay here, hidden from the store." },
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={i < rating ? "size-3.5 fill-gold text-gold" : "size-3.5 text-border"} aria-hidden />
      ))}
    </span>
  );
}

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const sp = await searchParams;
  const raw = param(sp, "status").toUpperCase();
  const status: TabValue = raw === "APPROVED" || raw === "REJECTED" ? raw : "PENDING";
  const data = await getReviewQueue(status, pageParam(sp));

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader title="Reviews" description="Approve reviews to publish them. Product ratings update automatically from approved reviews." />
      <div className="mb-4">
        <SegmentedLinks
          label="Review status"
          items={TABS.map((t) => ({
            href: t.value === "PENDING" ? "/admin/reviews" : `/admin/reviews?status=${t.value.toLowerCase()}`,
            label: t.label,
            count: data.counts[t.value],
            active: status === t.value,
          }))}
        />
      </div>
      <AdminCard>
        {data.items.length === 0 ? (
          <EmptyState icon={MessageSquareQuote} title={EMPTY[status].title} description={EMPTY[status].description} className="[&_h2]:text-xl" />
        ) : (
          <ul className="divide-y">
            {data.items.map((r) => (
              <li key={r.id} className="space-y-3 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <Link href={`/admin/products/${r.product.id}`} className="text-xs font-medium text-terracotta hover:underline">
                      {r.product.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Stars rating={r.rating} />
                      <h2 className="font-sans text-sm font-semibold">{r.title}</h2>
                    </div>
                  </div>
                  <StatusBadge tone={REVIEW_STATUS_META[r.status].tone} className="self-start">
                    {REVIEW_STATUS_META[r.status].label}
                  </StatusBadge>
                </div>
                <p className="text-sm leading-6 whitespace-pre-line text-foreground/85">{r.body}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{r.authorName}</span>
                    {r.city ? <span>· {r.city}</span> : null}
                    {r.isVerified ? (
                      <span className="inline-flex items-center gap-0.5 text-sage">
                        · <BadgeCheck className="size-3.5" aria-hidden /> Verified buyer
                      </span>
                    ) : null}
                    <span>· {formatDateTime(r.createdAt)}</span>
                    <span>
                      · product rated {r.product.rating.toFixed(1)} from {r.product.reviewCount}
                    </span>
                  </p>
                  <ReviewActions reviewId={r.id} status={r.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
        <AdminPagination basePath="/admin/reviews" searchParams={sp} page={data.page} pageCount={data.pageCount} total={data.total} pageSize={20} />
      </AdminCard>
    </div>
  );
}
