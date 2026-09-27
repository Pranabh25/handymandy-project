"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getProductsByIds } from "@/server/catalog";
import { findValidCoupon } from "@/server/orders";
import type { PricingCoupon } from "@/lib/pricing";
import type { ActionResult, ProductSummary } from "@/types";

/** Mirrors MAX_QTY_PER_LINE in @/hooks/use-cart (client module, so not importable here). */
const MAX_QTY = 10;

export type CartLineUpdate = {
  productId: string;
  /** False when the product was deleted, archived or has sold out. */
  available: boolean;
  /** Authoritative product data (present when available). */
  product?: ProductSummary;
};

const refreshSchema = z
  .array(z.object({ productId: z.string().min(1).max(64), quantity: z.number().int() }))
  .max(50);

/**
 * Re-reads cart products from the database so the bag shows current price,
 * MRP and stock. The client merges these updates into its localStorage cart.
 */
export async function refreshCart(
  lines: { productId: string; quantity: number }[],
): Promise<ActionResult<{ updates: CartLineUpdate[]; maxQty: number }>> {
  const parsed = refreshSchema.safeParse(lines);
  if (!parsed.success) return { ok: false, error: "We couldn't read your bag. Please try again." };
  const products = await getProductsByIds(parsed.data.map((l) => l.productId));
  const updates: CartLineUpdate[] = parsed.data.map((line) => {
    const p = products.find((x) => x.id === line.productId);
    if (!p || p.status !== "ACTIVE" || p.stock <= 0) return { productId: line.productId, available: false };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, ...summary } = p;
    return { productId: line.productId, available: true, product: summary };
  });
  return { ok: true, data: { updates, maxQty: MAX_QTY } };
}

/** Checks a coupon against the current bag subtotal (display only; the order re-validates). */
export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<ActionResult<{ coupon: PricingCoupon; description: string }>> {
  const clean = String(code ?? "").trim();
  if (!clean) return { ok: false, error: "Enter a coupon code" };
  if (clean.length > 32) return { ok: false, error: "This coupon code is not valid" };
  const amount = Number.isFinite(subtotal) ? Math.max(0, Math.round(subtotal)) : 0;
  const res = await findValidCoupon(clean, amount);
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true, data: { coupon: res.coupon, description: res.description } };
}

export type AvailableCoupon = PricingCoupon & { description: string; endsAt: string | null };

/** Active, started, unexpired coupons that still have uses left — shown as tap-to-apply offers. */
export async function getAvailableCoupons(): Promise<AvailableCoupon[]> {
  const now = new Date();
  const rows = await db.coupon.findMany({
    where: {
      isActive: true,
      AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    orderBy: [{ minOrder: "asc" }, { createdAt: "desc" }],
    take: 12,
  });
  return rows
    .filter((c) => c.usageLimit == null || c.usedCount < c.usageLimit)
    .map((c) => ({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      maxDiscount: c.maxDiscount,
      description: c.description,
      endsAt: c.endsAt ? c.endsAt.toISOString() : null,
    }));
}
