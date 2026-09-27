import type { Metadata } from "next";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAdminCategories, getAdminProducts, ADMIN_PAGE_SIZE } from "@/server/admin/products";
import { pageParam, param, type SearchParams } from "@/server/admin/params";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-page-header";
import { ListToolbar } from "@/components/admin/shared/list-toolbar";
import { AdminPagination } from "@/components/admin/shared/pagination";
import { ProductsTable } from "@/components/admin/products/products-table";
import { EmptyState } from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = param(sp, "q");
  const category = param(sp, "category");
  const status = param(sp, "status");
  const [data, categories] = await Promise.all([
    getAdminProducts({ q, category, status, page: pageParam(sp) }),
    getAdminCategories(),
  ]);
  const filtered = Boolean(q || category || status);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Products"
        description={`${data.total} ${data.total === 1 ? "product" : "products"}${filtered ? " match your filters" : " in the catalogue"}`}
        actions={
          <Link href="/admin/products/new" className={buttonVariants({ variant: "accent", size: "sm" })}>
            <Plus aria-hidden /> Add product
          </Link>
        }
      />
      <AdminCard>
        <ListToolbar
          searchPlaceholder="Search by name or SKU"
          filters={[
            {
              name: "category",
              label: "Filter by category",
              allLabel: "All categories",
              options: categories.map((c) => ({ value: c.slug, label: `${c.name} · ${c.group === "GIFTS" ? "Gifts" : "Cosmetics"}` })),
            },
            {
              name: "status",
              label: "Filter by status",
              allLabel: "Any status",
              options: [
                { value: "ACTIVE", label: "Active" },
                { value: "DRAFT", label: "Draft" },
                { value: "ARCHIVED", label: "Archived" },
              ],
            },
          ]}
        />
        {data.items.length === 0 ? (
          <EmptyState
            icon={Package}
            title={filtered ? "No products match" : "No products yet"}
            description={filtered ? "Try a different name, SKU or filter." : "Add your first gift or cosmetic to start selling."}
            action={filtered ? undefined : { label: "Add product", href: "/admin/products/new" }}
            className="[&_h2]:text-xl"
          />
        ) : (
          <ProductsTable items={data.items} />
        )}
        <AdminPagination basePath="/admin/products" searchParams={sp} page={data.page} pageCount={data.pageCount} total={data.total} pageSize={ADMIN_PAGE_SIZE} />
      </AdminCard>
    </div>
  );
}
