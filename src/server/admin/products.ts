import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { ProductStatus } from "@/generated/prisma/enums";

export const ADMIN_PAGE_SIZE = 20;

export type AdminProductFilters = { q?: string; category?: string; status?: string; page?: number };

export async function getAdminProducts(f: AdminProductFilters) {
  const where: Prisma.ProductWhereInput = {};
  if (f.q) {
    where.OR = [
      { name: { contains: f.q, mode: "insensitive" } },
      { sku: { contains: f.q, mode: "insensitive" } },
    ];
  }
  if (f.category) where.category = { slug: f.category };
  if (f.status && ["ACTIVE", "DRAFT", "ARCHIVED"].includes(f.status)) where.status = f.status as ProductStatus;
  const page = Math.max(1, f.page ?? 1);
  const [items, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: {
        id: true,
        name: true,
        sku: true,
        slug: true,
        price: true,
        mrp: true,
        stock: true,
        lowStockAt: true,
        status: true,
        category: { select: { name: true, group: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true, alt: true } },
      },
    }),
    db.product.count({ where }),
  ]);
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)) };
}

export async function getAdminCategories() {
  return db.category.findMany({
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
    select: { id: true, name: true, slug: true, group: true },
  });
}

export async function getAdminProduct(id: string) {
  return db.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: { select: { slug: true, group: true } }, _count: { select: { orderItems: true } } },
  });
}

/** Distinct values already used in the catalogue, merged into chip presets. */
export async function getMerchandisingVocabulary() {
  const rows = await db.product.findMany({ select: { skinTypes: true, occasions: true, recipients: true, concerns: true } });
  const uniq = (xs: string[]) => Array.from(new Set(xs)).sort((a, b) => a.localeCompare(b));
  return {
    skinTypes: uniq(rows.flatMap((r) => r.skinTypes)),
    occasions: uniq(rows.flatMap((r) => r.occasions)),
    recipients: uniq(rows.flatMap((r) => r.recipients)),
    concerns: uniq(rows.flatMap((r) => r.concerns)),
  };
}

export type InventoryFilter = "all" | "low" | "out";

export async function getInventory(f: { q?: string; filter?: InventoryFilter; page?: number }) {
  const and: Prisma.ProductWhereInput[] = [{ status: { not: "ARCHIVED" } }];
  if (f.q) and.push({ OR: [{ name: { contains: f.q, mode: "insensitive" } }, { sku: { contains: f.q, mode: "insensitive" } }] });
  if (f.filter === "out") and.push({ stock: { lte: 0 } });
  if (f.filter === "low") and.push({ stock: { gt: 0, lte: db.product.fields.lowStockAt } });
  const where: Prisma.ProductWhereInput = { AND: and };
  const page = Math.max(1, f.page ?? 1);
  const base: Prisma.ProductWhereInput = { status: { not: "ARCHIVED" } };
  const [items, total, lowCount, outCount, allCount] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: [{ stock: "asc" }, { name: "asc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        lowStockAt: true,
        status: true,
        category: { select: { name: true, group: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
      },
    }),
    db.product.count({ where }),
    db.product.count({ where: { ...base, stock: { gt: 0, lte: db.product.fields.lowStockAt } } }),
    db.product.count({ where: { ...base, stock: { lte: 0 } } }),
    db.product.count({ where: base }),
  ]);
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)), counts: { all: allCount, low: lowCount, out: outCount } };
}
