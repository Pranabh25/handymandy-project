"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { ActionResult } from "@/types";

const moderateSchema = z.object({
  reviewId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
});

/** Recomputes a product's rating and reviewCount from its APPROVED reviews. */
async function recomputeProductRating(productId: string) {
  const agg = await db.review.aggregate({
    where: { productId, status: "APPROVED" },
    _avg: { rating: true },
    _count: { _all: true },
  });
  const rating = agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0;
  return db.product.update({
    where: { id: productId },
    data: { rating, reviewCount: agg._count._all },
    select: { slug: true, category: { select: { slug: true } } },
  });
}

export async function moderateReview(input: z.input<typeof moderateSchema>): Promise<ActionResult> {
  await requireAdmin();
  const parsed = moderateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid review update" };
  const review = await db.review.findUnique({ where: { id: parsed.data.reviewId }, select: { productId: true } });
  if (!review) return { ok: false, error: "This review no longer exists." };

  await db.review.update({ where: { id: parsed.data.reviewId }, data: { status: parsed.data.status } });
  const product = await recomputeProductRating(review.productId);

  revalidatePath(`/product/${product.slug}`);
  revalidatePath(`/category/${product.category.slug}`);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin", "layout");
  return { ok: true };
}
