import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { CategoryGroup } from "@/generated/prisma/enums";
import type { ProductSummary } from "@/types";

/** Read-side catalogue queries for the storefront. Only ACTIVE products are shown. */

const summaryInclude = {
  category: { select: { name: true, slug: true, group: true } },
  images: { orderBy: { sortOrder: "asc" }, take: 1 },
} satisfies Prisma.ProductInclude;

type ProductWithSummary = Prisma.ProductGetPayload<{ include: typeof summaryInclude }>;

export function toSummary(p: ProductWithSummary): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    price: p.price,
    mrp: p.mrp,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    image: p.images[0]?.url ?? null,
    imageAlt: p.images[0]?.alt ?? p.name,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    group: p.category.group,
    isBestseller: p.isBestseller,
    isNew: p.isNew,
    size: p.size,
    shortDescription: p.shortDescription,
  };
}

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "bestsellers", label: "Bestsellers" },
  { value: "newest", label: "New arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
  { value: "discount", label: "Biggest savings" },
] as const;
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export type ProductFilters = {
  q?: string;
  group?: CategoryGroup;
  categories?: string[]; // category slugs
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  skinTypes?: string[];
  occasions?: string[];
  recipients?: string[];
  sort?: SortValue;
  page?: number;
  pageSize?: number;
};

function buildWhere(f: ProductFilters): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [{ status: "ACTIVE" }];
  if (f.group) and.push({ category: { group: f.group } });
  if (f.categories?.length) and.push({ category: { slug: { in: f.categories } } });
  if (f.minPrice != null) and.push({ price: { gte: f.minPrice } });
  if (f.maxPrice != null) and.push({ price: { lte: f.maxPrice } });
  if (f.minRating) and.push({ rating: { gte: f.minRating } });
  if (f.inStock) and.push({ stock: { gt: 0 } });
  if (f.skinTypes?.length) and.push({ skinTypes: { hasSome: f.skinTypes } });
  if (f.occasions?.length) and.push({ occasions: { hasSome: f.occasions } });
  if (f.recipients?.length) and.push({ recipients: { hasSome: f.recipients } });
  if (f.q) {
    const q = f.q.trim();
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
        { tags: { has: q.toLowerCase() } },
        { category: { name: { contains: q, mode: "insensitive" } } },
        { keyIngredients: { has: q } },
      ],
    });
  }
  return { AND: and };
}

function buildOrderBy(sort: SortValue = "featured"): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "bestsellers":
      return [{ isBestseller: "desc" }, { reviewCount: "desc" }];
    case "newest":
      return [{ isNew: "desc" }, { createdAt: "desc" }];
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "rating":
      return [{ rating: "desc" }, { reviewCount: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { isBestseller: "desc" }, { rating: "desc" }];
  }
}

export async function getProducts(filters: ProductFilters = {}) {
  const pageSize = filters.pageSize ?? 12;
  const page = Math.max(1, filters.page ?? 1);
  const where = buildWhere(filters);

  if (filters.sort === "discount") {
    // Discount % isn't a column — sort in memory (catalogue is small-business sized).
    const all = await db.product.findMany({ where, include: summaryInclude });
    all.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
    const items = all.slice((page - 1) * pageSize, page * pageSize).map(toSummary);
    return { items, total: all.length, page, pageCount: Math.max(1, Math.ceil(all.length / pageSize)) };
  }

  const [rows, total] = await Promise.all([
    db.product.findMany({
      where,
      include: summaryInclude,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);
  return { items: rows.map(toSummary), total, page, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

export const getCategories = cache(async (group?: CategoryGroup) => {
  return db.category.findMany({
    where: group ? { group } : undefined,
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
    include: { _count: { select: { products: { where: { status: "ACTIVE" } } } } },
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return db.category.findUnique({ where: { slug } });
});

export const getProductBySlug = cache(async (slug: string) => {
  return db.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
});

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

export async function getApprovedReviews(productId: string, take = 20) {
  return db.review.findMany({
    where: { productId, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getRatingBreakdown(productId: string) {
  const groups = await db.review.groupBy({
    by: ["rating"],
    where: { productId, status: "APPROVED" },
    _count: { _all: true },
  });
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const g of groups) counts[g.rating] = g._count._all;
  return counts;
}

export async function getRelatedProducts(productId: string, categoryId: string, take = 4) {
  const rows = await db.product.findMany({
    where: { status: "ACTIVE", categoryId, NOT: { id: productId } },
    include: summaryInclude,
    orderBy: [{ isBestseller: "desc" }, { rating: "desc" }],
    take,
  });
  if (rows.length < take) {
    const more = await db.product.findMany({
      where: { status: "ACTIVE", NOT: { id: { in: [productId, ...rows.map((r) => r.id)] } }, isBestseller: true },
      include: summaryInclude,
      take: take - rows.length,
    });
    rows.push(...more);
  }
  return rows.map(toSummary);
}

export async function getHomepageCollections() {
  const [bestsellers, newArrivals, gifts, cosmetics] = await Promise.all([
    db.product.findMany({
      where: { status: "ACTIVE", isBestseller: true },
      include: summaryInclude,
      orderBy: { reviewCount: "desc" },
      take: 8,
    }),
    db.product.findMany({ where: { status: "ACTIVE", isNew: true }, include: summaryInclude, take: 4 }),
    db.product.findMany({
      where: { status: "ACTIVE", isFeatured: true, category: { group: "GIFTS" } },
      include: summaryInclude,
      take: 4,
    }),
    db.product.findMany({
      where: { status: "ACTIVE", isFeatured: true, category: { group: "COSMETICS" } },
      include: summaryInclude,
      take: 4,
    }),
  ]);
  return {
    bestsellers: bestsellers.map(toSummary),
    newArrivals: newArrivals.map(toSummary),
    gifts: gifts.map(toSummary),
    cosmetics: cosmetics.map(toSummary),
  };
}

/** Lightweight search for the header autocomplete. */
export async function searchSuggestions(q: string, take = 6) {
  if (q.trim().length < 2) return [];
  const rows = await db.product.findMany({
    where: buildWhere({ q }),
    include: summaryInclude,
    orderBy: [{ isBestseller: "desc" }, { rating: "desc" }],
    take,
  });
  return rows.map(toSummary);
}

/** Current (authoritative) product data for a list of ids — used for cart revalidation. */
export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  const rows = await db.product.findMany({ where: { id: { in: ids } }, include: summaryInclude });
  return rows.map((r) => ({ ...toSummary(r), status: r.status }));
}

/** Distinct filter facets for the shop sidebar. */
export const getFacets = cache(async (group?: CategoryGroup) => {
  const rows = await db.product.findMany({
    where: { status: "ACTIVE", ...(group ? { category: { group } } : {}) },
    select: { skinTypes: true, occasions: true, recipients: true, price: true },
  });
  const uniq = (arr: string[]) => Array.from(new Set(arr)).sort();
  return {
    skinTypes: uniq(rows.flatMap((r) => r.skinTypes)),
    occasions: uniq(rows.flatMap((r) => r.occasions)),
    recipients: uniq(rows.flatMap((r) => r.recipients)),
    maxPrice: rows.reduce((m, r) => Math.max(m, r.price), 0),
  };
});
