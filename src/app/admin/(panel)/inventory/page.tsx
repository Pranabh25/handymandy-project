import type { Metadata } from "next";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_PAGE_SIZE, getInventory, type InventoryFilter } from "@/server/admin/products";
import { pageParam, param, type SearchParams } from "@/server/admin/params";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { ListToolbar } from "@/components/admin/shared/list-toolbar";
import { AdminPagination } from "@/components/admin/shared/pagination";
import { SegmentedLinks } from "@/components/admin/shared/segmented-links";
import { AdminThumb } from "@/components/admin/shared/thumb";
import { stockMeta } from "@/components/admin/shared/status-meta";
import { StockAdjuster } from "@/components/admin/inventory/stock-adjuster";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";

export const metadata: Metadata = { title: "Inventory" };

const FILTERS: { value: InventoryFilter; label: string }[] = [
  { value: "all", label: "All products" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];

export default async function InventoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = param(sp, "q");
  const raw = param(sp, "filter");
  const filter: InventoryFilter = raw === "low" || raw === "out" ? raw : "all";
  const data = await getInventory({ q, filter, page: pageParam(sp) });

  const hrefFor = (f: InventoryFilter) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (f !== "all") u.set("filter", f);
    const s = u.toString();
    return s ? `/admin/inventory?${s}` : "/admin/inventory";
  };

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Inventory" description="Adjust stock after a delivery from a supplier, a stock count or damaged units. Archived products are hidden." />
      <div className="mb-4">
        <SegmentedLinks label="Stock filter" items={FILTERS.map((f) => ({ href: hrefFor(f.value), label: f.label, count: data.counts[f.value], active: filter === f.value }))} />
      </div>
      <AdminCard>
        <ListToolbar searchPlaceholder="Search by name or SKU" />
        {data.items.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title={filter === "all" && !q ? "No products yet" : "Nothing to show"}
            description={filter === "low" ? "No product is at or below its low-stock level." : filter === "out" ? "Everything is in stock." : "Try another search."}
            className="[&_h2]:text-xl"
          />
        ) : (
          <ul className="divide-y">
            {data.items.map((p) => {
              const meta = stockMeta(p.stock, p.lowStockAt);
              return (
                <li key={p.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <AdminThumb src={p.images[0]?.url} alt={p.name} group={p.category.group} />
                    <div className="min-w-0">
                      <Link href={`/admin/products/${p.id}`} className="block truncate text-sm font-medium hover:text-terracotta">
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {p.sku} · {p.category.name} · alert at {p.lowStockAt}
                        {p.status === "DRAFT" ? " · Draft" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <StatusBadge tone={meta.tone} className="sm:w-28 sm:justify-center">
                      {meta.label}
                    </StatusBadge>
                    <StockAdjuster key={`${p.id}-${p.stock}`} productId={p.id} productName={p.name} stock={p.stock} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <AdminPagination basePath="/admin/inventory" searchParams={sp} page={data.page} pageCount={data.pageCount} total={data.total} pageSize={ADMIN_PAGE_SIZE} />
      </AdminCard>
    </div>
  );
}
