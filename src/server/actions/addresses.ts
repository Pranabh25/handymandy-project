"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { addressSchema, fieldErrors, firstIssue, type AddressInput } from "@/lib/validators";
import type { ActionResult } from "@/types";

/** Serialisable saved address, as used by checkout and My Account → Addresses. */
export type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  type: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
};

const select = {
  id: true,
  fullName: true,
  phone: true,
  line1: true,
  line2: true,
  landmark: true,
  city: true,
  state: true,
  pincode: true,
  type: true,
  isDefault: true,
} as const;

function revalidate() {
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}

const idSchema = z.string().min(1).max(64);

/** Creates (no id) or updates (id owned by the user) an address. */
export async function saveAddress(
  input: Partial<AddressInput> & { id?: string },
): Promise<ActionResult<{ address: SavedAddress }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again to save your address" };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error), fieldErrors: fieldErrors(parsed.error) };
  }
  const { isDefault, ...data } = parsed.data;
  const clean = { ...data, line2: data.line2 || null, landmark: data.landmark || null };

  if (input.id) {
    const owned = await db.address.findFirst({ where: { id: input.id, userId: user.id }, select: { id: true } });
    if (!owned) return { ok: false, error: "Address not found" };
  }

  const address = await db.$transaction(async (tx) => {
    const count = await tx.address.count({ where: { userId: user.id } });
    const makeDefault = !!isDefault || count === 0 || (count === 1 && !!input.id);
    if (makeDefault) await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    return input.id
      ? tx.address.update({
          where: { id: input.id },
          data: { ...clean, ...(makeDefault ? { isDefault: true } : {}) },
          select,
        })
      : tx.address.create({ data: { ...clean, userId: user.id, isDefault: makeDefault }, select });
  });

  revalidate();
  return { ok: true, data: { address } };
}

export async function deleteAddress(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again" };
  if (!idSchema.safeParse(id).success) return { ok: false, error: "Address not found" };

  const existing = await db.address.findFirst({ where: { id, userId: user.id } });
  if (!existing) return { ok: false, error: "Address not found" };

  await db.$transaction(async (tx) => {
    await tx.address.delete({ where: { id } });
    if (existing.isDefault) {
      const next = await tx.address.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
      if (next) await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  });

  revalidate();
  return { ok: true };
}

export async function setDefaultAddress(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again" };
  if (!idSchema.safeParse(id).success) return { ok: false, error: "Address not found" };

  const existing = await db.address.findFirst({ where: { id, userId: user.id }, select: { id: true } });
  if (!existing) return { ok: false, error: "Address not found" };

  await db.$transaction([
    db.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }),
    db.address.update({ where: { id }, data: { isDefault: true } }),
  ]);

  revalidate();
  return { ok: true };
}
