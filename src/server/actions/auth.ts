"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";
import { demoConfig } from "@/config/site";
import { emailSchema, otpSchema, phoneSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

/**
 * Mock OTP authentication. No SMS is sent: every OTP is `demoConfig.otp`.
 * Swap `deliverOtp` for an SMS provider (MSG91, Twilio, Gupshup…) to go live.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deliverOtp(phone: string, code: string) {
  // Demo: intentionally does nothing.
}

export async function sendOtp(rawPhone: string): Promise<ActionResult<{ phone: string }>> {
  const parsed = phoneSchema.safeParse(rawPhone);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const phone = parsed.data;
  await db.otpCode.create({
    data: {
      identifier: phone,
      code: demoConfig.otp,
      expiresAt: new Date(Date.now() + demoConfig.otpTtlMinutes * 60_000),
    },
  });
  await deliverOtp(phone, demoConfig.otp);
  return { ok: true, data: { phone } };
}

export async function verifyOtp(input: {
  phone: string;
  otp: string;
  name?: string;
}): Promise<ActionResult<{ isNew: boolean; name: string | null }>> {
  const phone = phoneSchema.safeParse(input.phone);
  const otp = otpSchema.safeParse(input.otp);
  if (!phone.success) return { ok: false, error: phone.error.issues[0].message };
  if (!otp.success) return { ok: false, error: otp.error.issues[0].message };

  const record = await db.otpCode.findFirst({
    where: { identifier: phone.data, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return { ok: false, error: "Your OTP has expired. Please request a new one." };
  if (record.code !== otp.data) return { ok: false, error: "Incorrect OTP. Please try again." };
  await db.otpCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } });

  const existing = await db.user.findUnique({ where: { phone: phone.data } });
  if (existing?.role === "ADMIN") return { ok: false, error: "Please use the admin login for this account." };
  const user =
    existing ??
    (await db.user.create({ data: { phone: phone.data, name: input.name?.trim() || null, role: "CUSTOMER" } }));
  if (existing && !existing.name && input.name?.trim()) {
    await db.user.update({ where: { id: existing.id }, data: { name: input.name.trim() } });
  }

  await createSession({ userId: user.id, role: "CUSTOMER", name: user.name });
  return { ok: true, data: { isNew: !existing, name: user.name } };
}

export async function updateProfile(input: { name: string; email?: string }): Promise<ActionResult> {
  const { getCurrentUser } = await import("@/lib/auth");
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again" };
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: "Enter your full name" };
  let email: string | null = null;
  if (input.email?.trim()) {
    const parsed = emailSchema.safeParse(input.email);
    if (!parsed.success) return { ok: false, error: "Enter a valid email address" };
    email = parsed.data;
    const clash = await db.user.findFirst({ where: { email, NOT: { id: user.id } } });
    if (clash) return { ok: false, error: "This email is already linked to another account" };
  }
  await db.user.update({ where: { id: user.id }, data: { name, email } });
  return { ok: true };
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function adminLogin(input: { email: string; password: string }): Promise<ActionResult> {
  const email = emailSchema.safeParse(input.email);
  if (!email.success) return { ok: false, error: "Enter a valid email address" };
  const user = await db.user.findUnique({ where: { email: email.data } });
  const valid = user?.passwordHash ? await bcrypt.compare(input.password, user.passwordHash) : false;
  if (!user || user.role !== "ADMIN" || !valid) return { ok: false, error: "Incorrect email or password" };
  await createSession({ userId: user.id, role: "ADMIN", name: user.name });
  return { ok: true };
}

export async function adminLogout() {
  await destroySession();
  redirect("/admin/login");
}
