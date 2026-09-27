/**
 * URL <-> filter mapping for product listings. Pure module (safe on server and client).
 *
 * Query params (all optional, shareable):
 *   category=skincare,makeup   price=500-999   rating=4   stock=1
 *   skin=Dry,Oily   occasion=Diwali   recipient=For Her   sort=price-asc   page=2
 */

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const PRICE_BUCKETS = [
  { value: "under-500", label: "Under ₹500", min: undefined, max: 499 },
  { value: "500-999", label: "₹500 – ₹999", min: 500, max: 999 },
  { value: "1000-1999", label: "₹1,000 – ₹1,999", min: 1000, max: 1999 },
  { value: "2000-3999", label: "₹2,000 – ₹3,999", min: 2000, max: 3999 },
  { value: "4000-plus", label: "₹4,000 & above", min: 4000, max: undefined },
] as const;

export const SORT_VALUES = ["featured", "bestsellers", "newest", "price-asc", "price-desc", "rating", "discount"] as const;
export type ListingSort = (typeof SORT_VALUES)[number];

/** Filter keys that hold comma-separated lists. */
export const LIST_KEYS = ["category", "skin", "occasion", "recipient"] as const;
export type ListKey = (typeof LIST_KEYS)[number];

/** Normalised, flat query state — what client components receive. */
export type ListingQuery = Partial<Record<ListKey | "price" | "rating" | "stock" | "sort" | "page" | "q", string>>;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v.join(",") : v;
}

export function splitList(v: string | undefined) {
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

export function normaliseQuery(sp: RawSearchParams): ListingQuery {
  const out: ListingQuery = {};
  for (const key of [...LIST_KEYS, "price", "rating", "stock", "sort", "page", "q"] as const) {
    const v = first(sp[key])?.trim();
    if (v) out[key] = v.slice(0, 200);
  }
  if (out.sort && !SORT_VALUES.includes(out.sort as ListingSort)) delete out.sort;
  if (out.price && !PRICE_BUCKETS.some((b) => b.value === out.price)) delete out.price;
  return out;
}

export function queryToFilters(q: ListingQuery) {
  const bucket = PRICE_BUCKETS.find((b) => b.value === q.price);
  const page = Number.parseInt(q.page ?? "1", 10);
  return {
    q: q.q,
    categories: splitList(q.category),
    minPrice: bucket?.min,
    maxPrice: bucket?.max,
    minRating: q.rating === "4" ? 4 : undefined,
    inStock: q.stock === "1" ? true : undefined,
    skinTypes: splitList(q.skin),
    occasions: splitList(q.occasion),
    recipients: splitList(q.recipient),
    sort: (q.sort as ListingSort | undefined) ?? "featured",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Builds a listing href from a base path + query, dropping empty values. */
export function buildHref(basePath: string, q: ListingQuery) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v) params.set(k, v);
  if (params.get("page") === "1") params.delete("page");
  if (params.get("sort") === "featured") params.delete("sort");
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Returns a new query with one value toggled in a list param (resets pagination). */
export function toggleListValue(q: ListingQuery, key: ListKey, value: string): ListingQuery {
  const list = splitList(q[key]);
  const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  return { ...q, [key]: next.join(","), page: undefined };
}

export function setParam(q: ListingQuery, key: keyof ListingQuery, value: string | undefined): ListingQuery {
  return { ...q, [key]: value, page: undefined };
}

export type ActiveChip = { key: string; label: string; href: string };

/** Human-readable chips for every active filter, each linking to the query without it. */
export function activeChips(basePath: string, q: ListingQuery, categoryNames: Record<string, string> = {}): ActiveChip[] {
  const chips: ActiveChip[] = [];
  for (const key of LIST_KEYS) {
    for (const v of splitList(q[key])) {
      chips.push({
        key: `${key}:${v}`,
        label: key === "category" ? (categoryNames[v] ?? v) : v,
        href: buildHref(basePath, toggleListValue(q, key, v)),
      });
    }
  }
  const bucket = PRICE_BUCKETS.find((b) => b.value === q.price);
  if (bucket) chips.push({ key: "price", label: bucket.label, href: buildHref(basePath, setParam(q, "price", undefined)) });
  if (q.rating === "4") chips.push({ key: "rating", label: "4★ & above", href: buildHref(basePath, setParam(q, "rating", undefined)) });
  if (q.stock === "1") chips.push({ key: "stock", label: "In stock", href: buildHref(basePath, setParam(q, "stock", undefined)) });
  return chips;
}

/** Query with all filters removed but sort / search term kept. */
export function clearedQuery(q: ListingQuery): ListingQuery {
  return { sort: q.sort, q: q.q };
}
