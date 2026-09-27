"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { fieldErrors, firstIssue } from "@/lib/validators";
import { couponSchema, type CouponInput } from "@/server/admin/schemas";
import { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "@/types";

/** Dates are picked as IST calendar days: start of day for startsAt, end of day for endsAt. */
const istStart = (d: string | null) => (d ? new Date(`${d}T00:00:00+05:30`) : null);
const istEnd = (d: string | null) => (d ? new Date(`${d}T23:59:59+05:30`) : null);

export async function saveCoupon(id: string | null, input: CouponInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error), fieldErrors: fieldErrors(parsed.error) };
  const c = parsed.data;
  const data = {
    code: c.code,
    description: c.description,
    type: c.type,
    value: c.type === "FREE_SHIPPING" ? 0 : c.value,
    minOrder: c.minOrder,
    maxDiscount: c.type === "PERCENT" ? c.maxDiscount : null,
    usageLimit: c.usageLimit,
    startsAt: istStart(c.startsAt),
    endsAt: istEnd(c.endsAt),
    isActive: c.isActive,
  };
  try {
    if (id) await db.coupon.update({ where: { id }, data });
    else await db.coupon.create({ data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: "A coupon with this code already exists", fieldErrors: { code: "This code is already in use" } };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, error: "This coupon no longer exists." };
    }
    throw e;
  }
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function setCouponActive(id: string, isActive: boolean): Promise<ActionResult> {
  await requireAdmin();
  const res = await db.coupon.updateMany({ where: { id }, data: { isActive } });
  if (res.count === 0) return { ok: false, error: "This coupon no longer exists." };
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  await requireAdmin();
  const res = await db.coupon.deleteMany({ where: { id } });
  if (res.count === 0) return { ok: false, error: "This coupon no longer exists." };
  revalidatePath("/admin/coupons");
  return { ok: true };
}
