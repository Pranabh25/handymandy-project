import Link from "next/link";
import { SearchX, X } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-card";
import { getCategories, getFacets, getProducts, SORT_OPTIONS } from "@/server/catalog";
import type { CategoryGroup } from "@/generated/prisma/enums";
import { FilterPanel, type FacetConfig } from "./filter-panel";
import { MobileFilters } from "./mobile-filters";
import { SortSelect } from "./sort-select";
import { Pagination } from "./pagination";
import { activeChips, buildHref, clearedQuery, normaliseQuery, queryToFilters, type RawSearchParams } from "./listing-params";

type Props = {
  /** Path the filters link back to, e.g. "/gifts" or "/category/skincare". */
  basePath: string;
  searchParams: RawSearchParams;
  group?: CategoryGroup;
  /** Locks the listing to one category (hides the category facet). */
  categorySlug?: string;
  pageSize?: number;
};

/** URL-driven product listing: sidebar filters, chips, sort, grid and pagination. */
export async function ProductListing({ basePath, searchParams, group, categorySlug, pageSize = 12 }: Props) {
  const query = normaliseQuery(searchParams);
  if (categorySlug) delete query.category;
  const filters = queryToFilters(query);

  const [result, facetsRaw, categories] = await Promise.all([
    getProducts({ ...filters, group, categories: categorySlug ? [categorySlug] : filters.categories, pageSize }),
    getFacets(group),
    categorySlug ? Promise.resolve([]) : getCategories(group),
  ]);

  const facets: FacetConfig = {
    categories: categorySlug ? undefined : categories.map((c) => ({ slug: c.slug, name: c.name, count: c._count.products })),
    skinTypes: group === "GIFTS" ? undefined : facetsRaw.skinTypes,
    occasions: group === "COSMETICS" ? undefined : facetsRaw.occasions,
    recipients: group === "COSMETICS" ? undefined : facetsRaw.recipients,
  };

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const chips = activeChips(basePath, query, categoryNames);
  const clearHref = buildHref(basePath, clearedQuery(query));
  const { items, total, page, pageCount } = result;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] xl:gap-14">
      <aside aria-label="Product filters" className="hidden lg:block">
        <div className="sticky top-24">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-sans text-xs font-semibold tracking-[0.16em] uppercase">Filter by</h2>
            {chips.length ? (
              <Link href={clearHref} scroll={false} className="text-xs font-medium text-terracotta hover:underline">
                Clear all
              </Link>
            ) : null}
          </div>
          <FilterPanel basePath={basePath} query={query} facets={facets} />
        </div>
      </aside>

      <section aria-label="Products" className="min-w-0">
        <div className="flex items-center justify-between gap-3 border-b pb-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {total === 0 ? (
              "No products found"
            ) : (
              <>
                Showing <span className="font-medium text-foreground tabular-nums">{from}–{to}</span> of{" "}
                <span className="font-medium text-foreground tabular-nums">{total.toLocaleString("en-IN")}</span>{" "}
                {total === 1 ? "product" : "products"}
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <MobileFilters basePath={basePath} query={query} facets={facets} total={total} activeCount={chips.length} />
            <SortSelect basePath={basePath} query={query} options={SORT_OPTIONS} />
          </div>
        </div>

        {chips.length ? (
          <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <li key={c.key}>
                <Link
                  href={c.href}
                  scroll={false}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-card py-1.5 pr-2.5 pl-3.5 text-xs font-medium transition-colors hover:border-foreground/30"
                  aria-label={`Remove filter: ${c.label}`}
                >
                  {c.label}
                  <X className="size-3.5 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
            <li>
              <Link href={clearHref} scroll={false} className="px-2 text-xs font-medium text-terracotta underline-offset-4 hover:underline">
                Clear all
              </Link>
            </li>
          </ul>
        ) : null}

        <div className="mt-8">
          {items.length ? (
            <>
              <ProductGrid products={items} className="lg:grid-cols-3" />
              <Pagination basePath={basePath} query={query} page={page} pageCount={pageCount} />
            </>
          ) : total > 0 ? (
            <EmptyState
              icon={SearchX}
              title="This page is empty"
              description={`There are only ${pageCount} ${pageCount === 1 ? "page" : "pages"} of results.`}
              action={{ label: "Back to page 1", href: buildHref(basePath, { ...query, page: undefined }) }}
            />
          ) : (
            <EmptyState
              icon={SearchX}
              title="Nothing matches just yet"
              description="Try removing a filter or two — or explore our full collection of gifts and clean beauty."
              action={{ label: chips.length ? "Reset filters" : "Browse all products", href: chips.length ? clearHref : "/shop" }}
              className="rounded-xl border border-dashed bg-card/60"
            />
          )}
        </div>
      </section>
    </div>
  );
}
