"use server";

import { db } from "@/lib/db";
import { emailSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function subscribeNewsletter(email: string): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { ok: false, error: "Enter a valid email address" };
  await db.newsletterSubscriber.upsert({ where: { email: parsed.data }, create: { email: parsed.data }, update: {} });
  return { ok: true };
}
