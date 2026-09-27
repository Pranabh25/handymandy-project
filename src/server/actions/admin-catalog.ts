"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { fieldErrors, firstIssue } from "@/lib/validators";
import { productSchema, type ProductInput } from "@/server/admin/schemas";
import { deleteUpload } from "@/server/storage";
import { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "@/types";

function revalidateStorefront(slugs: string[], categorySlugs: string[]) {
  revalidatePath("/");
  revalidatePath("/shop");
  for (const slug of new Set(slugs)) revalidatePath(`/product/${slug}`);
  for (const slug of new Set(categorySlugs)) revalidatePath(`/category/${slug}`);
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin");
}

function uniqueViolation(e: unknown): string | null {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    const target = JSON.stringify(e.meta ?? {});
    if (target.includes("sku")) return "sku";
    if (target.includes("slug")) return "slug";
    return "slug";
  }
  return null;
}

/** Creates (id = null) or updates a product, replacing its image list. */
export async function saveProduct(id: string | null, input: ProductInput): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error), fieldErrors: fieldErrors(parsed.error) };
  const { images, ...data } = parsed.data;

  const category = await db.category.findUnique({ where: { id: data.categoryId }, select: { slug: true } });
  if (!category) return { ok: false, error: "Choose a valid category", fieldErrors: { categoryId: "Choose a valid category" } };

  const existing = id
    ? await db.product.findUnique({
        where: { id },
        select: { slug: true, category: { select: { slug: true } }, images: { select: { url: true } } },
      })
    : null;
  if (id && !existing) return { ok: false, error: "This product no longer exists." };

  try {
    const imageRows = images.map((img, i) => ({ url: img.url, alt: img.alt ?? data.name, sortOrder: i }));
    const product = id
      ? await db.$transaction(async (tx) => {
          await tx.productImage.deleteMany({ where: { productId: id } });
          return tx.product.update({ where: { id }, data: { ...data, images: { create: imageRows } } });
        })
      : await db.product.create({ data: { ...data, images: { create: imageRows } } });

    // Remove files for images that were dropped from the product.
    if (existing) {
      const kept = new Set(images.map((i) => i.url));
      await Promise.all(existing.images.filter((i) => !kept.has(i.url)).map((i) => deleteUpload(i.url)));
    }

    revalidateStorefront(
      [product.slug, ...(existing ? [existing.slug] : [])],
      [category.slug, ...(existing ? [existing.category.slug] : [])],
    );
    return { ok: true, data: { id: product.id, slug: product.slug } };
  } catch (e) {
    const field = uniqueViolation(e);
    if (field) {
      const msg = field === "sku" ? "Another product already uses this SKU" : "Another product already uses this slug";
      return { ok: false, error: msg, fieldErrors: { [field]: msg } };
    }
    console.error("saveProduct failed", e);
    return { ok: false, error: "Couldn't save the product. Please try again." };
  }
}

/** Deletes a product, or archives it when it appears in past orders. */
export async function deleteOrArchiveProduct(id: string): Promise<ActionResult<{ archived: boolean }>> {
  await requireAdmin();
  const product = await db.product.findUnique({
    where: { id },
    select: { slug: true, category: { select: { slug: true } }, images: { select: { url: true } }, _count: { select: { orderItems: true } } },
  });
  if (!product) return { ok: false, error: "This product no longer exists." };

  if (product._count.orderItems > 0) {
    await db.product.update({ where: { id }, data: { status: "ARCHIVED" } });
    revalidateStorefront([product.slug], [product.category.slug]);
    return { ok: true, data: { archived: true } };
  }
  await db.product.delete({ where: { id } });
  await Promise.all(product.images.map((i) => deleteUpload(i.url)));
  revalidateStorefront([product.slug], [product.category.slug]);
  return { ok: true, data: { archived: false } };
}

const stockSchema = z.object({
  productId: z.string().min(1),
  mode: z.enum(["delta", "set"]),
  value: z.number().int("Use a whole number").min(-100_000).max(100_000),
});

/** Inline inventory adjustment: add/subtract (delta) or set an exact count. */
export async function adjustStock(input: z.input<typeof stockSchema>): Promise<ActionResult<{ stock: number }>> {
  await requireAdmin();
  const parsed = stockSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  const { productId, mode, value } = parsed.data;

  const product = await db.product.findUnique({ where: { id: productId }, select: { stock: true, slug: true, category: { select: { slug: true } } } });
  if (!product) return { ok: false, error: "This product no longer exists." };
  const next = mode === "set" ? value : product.stock + value;
  if (next < 0) return { ok: false, error: "Stock can't go below zero." };

  const updated = await db.product.update({ where: { id: productId }, data: { stock: next }, select: { stock: true } });
  revalidateStorefront([product.slug], [product.category.slug]);
  return { ok: true, data: { stock: updated.stock } };
}
