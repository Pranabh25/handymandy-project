"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { fieldErrors, firstIssue } from "@/lib/validators";
import { settingsSchema, type SettingsInput } from "@/server/admin/schemas";
import type { ActionResult } from "@/types";

/** Upserts the single store settings row and refreshes every page that reads it. */
export async function saveStoreSettings(input: SettingsInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error), fieldErrors: fieldErrors(parsed.error) };
  await db.storeSetting.upsert({
    where: { id: "store" },
    create: { id: "store", ...parsed.data },
    update: parsed.data,
  });
  revalidatePath("/", "layout");
  return { ok: true };
}
