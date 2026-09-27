"use server";

import { db } from "@/lib/db";
import { contactSchema, fieldErrors, firstIssue } from "@/lib/validators";
import type { ActionResult } from "@/types";

export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

/** Saves a message from the Contact page. Support replies by email within one working day. */
export async function submitContactMessage(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: firstIssue(parsed.error), fieldErrors: fieldErrors(parsed.error) };
  }
  const { name, email, phone, subject, message } = parsed.data;

  const digits = phone ? phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "") : "";
  if (digits && !/^[6-9]\d{9}$/.test(digits)) {
    return { ok: false, error: "Enter a valid 10-digit Indian mobile number", fieldErrors: { phone: "Enter a valid 10-digit Indian mobile number" } };
  }

  try {
    await db.contactMessage.create({
      data: { name, email, phone: digits || null, subject, message },
    });
    return { ok: true };
  } catch (err) {
    console.error("[contact] failed to save message", err);
    return { ok: false, error: "We couldn't send your message just now. Please try again or email us directly." };
  }
}
