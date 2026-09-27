import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-card";
import { Pagination } from "@/components/catalog/pagination";
import { SortSelect } from "@/components/catalog/sort-select";
import { normaliseQuery, queryToFilters } from "@/components/catalog/listing-params";
import { getCategories, getProducts, SORT_OPTIONS } from "@/server/catalog";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = normaliseQuery(await searchParams).q;
  return {
    title: q ? `Search results for “${q}”` : "Search",
    robots: { index: false, follow: true },
  };
}

const SUGGESTIONS = ["Diwali hamper", "Kumkumadi", "Vitamin C serum", "Scented candle", "Lipstick", "Personalised"];

export default async function SearchPage({ searchParams }: Props) {
  const raw = normaliseQuery(await searchParams);
  const query = { q: raw.q, sort: raw.sort, page: raw.page };
  const term = query.q?.slice(0, 80) ?? "";
  const filters = queryToFilters(query);

  const [result, categories] = await Promise.all([
    term ? getProducts({ q: term, sort: filters.sort, page: filters.page }) : Promise.resolve(null),
    getCategories(),
  ]);

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <header className="mt-6 border-b pb-6">
        <p className="eyebrow mb-2">Search</p>
        <h1 className="text-4xl leading-tight font-semibold text-balance md:text-5xl">
          {term ? <>Results for “{term}”</> : "What are you looking for?"}
        </h1>
      </header>

      {result && result.total > 0 ? (
        <>
          <div className="flex items-center justify-between gap-3 py-4">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground tabular-nums">{result.total.toLocaleString("en-IN")}</span>{" "}
              {result.total === 1 ? "product" : "products"} found
            </p>
            <SortSelect basePath="/search" query={query} options={SORT_OPTIONS} />
          </div>
          <ProductGrid products={result.items} className="mt-4" />
          <Pagination basePath="/search" query={query} page={result.page} pageCount={result.pageCount} />
        </>
      ) : (
        <EmptyState
          icon={SearchX}
          title={term ? `No matches for “${term}”` : "Start with a search"}
          description={
            term
              ? "Check the spelling, try a broader word like “hamper” or “serum”, or browse a category below."
              : "Search for hampers, serums, lipsticks, candles and more — or start with a category."
          }
        >
          <div className="mt-8 w-full max-w-2xl">
            <p className="mb-3 text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Popular searches</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <Link
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="inline-flex h-9 items-center rounded-full border bg-card px-4 text-sm hover:border-foreground/30"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 mb-3 text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Popular categories</p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="flex h-full flex-col rounded-xl border bg-card px-4 py-3 text-left transition-shadow hover:shadow-soft"
                  >
                    <span className="font-display text-lg font-semibold">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c._count.products} products</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </EmptyState>
      )}
    </div>
  );
}
