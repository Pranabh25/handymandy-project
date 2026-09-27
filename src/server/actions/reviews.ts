"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { fieldErrors, firstIssue, reviewSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

/**
 * Customer review submission. Reviews are created as PENDING and only appear
 * on the storefront once approved in Admin → Reviews.
 */
export async function submitReview(input: {
  productId: string;
  rating: number;
  title: string;
  body: string;
  city?: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in to write a review" };

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error), fieldErrors: fieldErrors(parsed.error) };
  const data = parsed.data;

  const product = await db.product.findFirst({ where: { id: data.productId, status: "ACTIVE" }, select: { id: true } });
  if (!product) return { ok: false, error: "This product is no longer available" };

  const existing = await db.review.findFirst({
    where: { productId: product.id, userId: user.id, status: { in: ["PENDING", "APPROVED"] } },
    select: { status: true },
  });
  if (existing) {
    return {
      ok: false,
      error: existing.status === "PENDING" ? "Your review for this product is awaiting approval" : "You've already reviewed this product",
    };
  }

  // "Verified buyer" only when the customer has a delivered order containing this product.
  const purchased = await db.orderItem.findFirst({
    where: { productId: product.id, order: { userId: user.id, status: "DELIVERED" } },
    select: { id: true },
  });

  await db.review.create({
    data: {
      productId: product.id,
      userId: user.id,
      authorName: user.name?.trim() || "LushAura customer",
      city: data.city || null,
      rating: data.rating,
      title: data.title,
      body: data.body,
      isVerified: !!purchased,
      status: "PENDING",
    },
  });

  return { ok: true };
}
