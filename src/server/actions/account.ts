"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { CANCELLATION_REASONS } from "@/config/site";
import { OrderError, requestCancellation } from "@/server/orders";
import { firstIssue } from "@/lib/validators";
import type { ActionResult } from "@/types";

const cancellationSchema = z.object({
  orderNumber: z.string().trim().min(1),
  reason: z.enum(CANCELLATION_REASONS, "Choose a reason for cancelling"),
  comment: z.string().trim().max(500, "Keep your note under 500 characters").optional(),
});

/** Customer cancellation request. Unpaid orders are cancelled instantly. */
export async function requestCancellationAction(input: {
  orderNumber: string;
  reason: string;
  comment?: string;
}): Promise<ActionResult<{ autoCancelled: boolean }>> {
  const user = await requireUser("/account/orders");
  const parsed = cancellationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const order = await db.order.findFirst({
    where: { orderNumber: parsed.data.orderNumber, userId: user.id },
    select: { id: true, orderNumber: true },
  });
  if (!order) return { ok: false, error: "We couldn't find this order on your account" };

  try {
    const res = await requestCancellation({
      orderId: order.id,
      userId: user.id,
      reason: parsed.data.reason,
      comment: parsed.data.comment || undefined,
    });
    revalidatePath(`/account/orders/${order.orderNumber}`);
    revalidatePath("/account/orders");
    revalidatePath("/account");
    return { ok: true, data: { autoCancelled: res.autoCancelled } };
  } catch (err) {
    if (err instanceof OrderError) return { ok: false, error: err.message };
    console.error("requestCancellationAction failed", err);
    return { ok: false, error: "Something went wrong. Please try again or contact us." };
  }
}
