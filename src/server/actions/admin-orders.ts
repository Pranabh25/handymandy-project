"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/enums";
import { COURIERS } from "@/lib/order-status";
import {
  addTrackingEvent,
  OrderError,
  processRefund,
  resolveCancellation,
  setTracking,
  updateOrderStatus,
} from "@/server/orders";
import type { ActionResult } from "@/types";

/** Refresh every admin page (sidebar badges included) plus the customer's view of the order. */
async function revalidateOrder(orderId: string) {
  revalidatePath("/admin", "layout");
  const order = await db.order.findUnique({ where: { id: orderId }, select: { orderNumber: true } });
  revalidatePath("/account/orders");
  if (order) revalidatePath(`/account/orders/${order.orderNumber}`, "layout");
}

function failure(err: unknown, fallback: string): ActionResult {
  if (err instanceof OrderError) return { ok: false, error: err.message };
  if (err instanceof Error && err.name === "NotFoundError") return { ok: false, error: "Record not found" };
  console.error(err);
  return { ok: false, error: fallback };
}

function zodError(error: z.ZodError): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, error: error.issues[0]?.message ?? "Please check the form", fieldErrors };
}

const idSchema = z.string().trim().min(1).max(64);
const noteSchema = z.string().trim().max(300, "Keep the note under 300 characters").optional();

// ─── Fulfilment ────────────────────────────────────────────────────────────

export async function updateOrderStatusAction(orderId: string, status: OrderStatus, note?: string): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z
    .object({ orderId: idSchema, status: z.enum(OrderStatus), note: noteSchema })
    .safeParse({ orderId, status, note });
  if (!parsed.success) return zodError(parsed.error);
  try {
    await updateOrderStatus(parsed.data.orderId, parsed.data.status, parsed.data.note || undefined);
    await revalidateOrder(parsed.data.orderId);
    return { ok: true };
  } catch (err) {
    return failure(err, "Could not update the order status");
  }
}

const trackingSchema = z.object({
  courier: z.enum(COURIERS, { error: "Choose a courier" }),
  trackingNumber: z
    .string()
    .trim()
    .min(6, "AWB number looks too short")
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/, "Use letters, numbers and hyphens only"),
  estimatedDelivery: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date")
    .optional()
    .or(z.literal("")),
  markShipped: z.boolean().optional(),
});

export type TrackingInput = {
  courier: string;
  trackingNumber: string;
  /** yyyy-mm-dd, or empty to keep the current estimate */
  estimatedDelivery?: string;
  markShipped?: boolean;
};

export async function setTrackingAction(orderId: string, input: TrackingInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = trackingSchema.safeParse(input);
  if (!parsed.success) return zodError(parsed.error);
  const { courier, trackingNumber, estimatedDelivery, markShipped } = parsed.data;
  try {
    await setTracking(idSchema.parse(orderId), {
      courier,
      trackingNumber: trackingNumber.toUpperCase(),
      // Noon IST-ish so the calendar day survives timezone conversion.
      estimatedDelivery: estimatedDelivery ? new Date(`${estimatedDelivery}T12:00:00+05:30`) : null,
      markShipped,
    });
    await revalidateOrder(orderId);
    return { ok: true };
  } catch (err) {
    return failure(err, "Could not save tracking details");
  }
}

const trackingEventSchema = z.object({
  title: z.string().trim().min(3, "Add a short title, e.g. “In transit”").max(80),
  location: z.string().trim().max(80).optional(),
  note: noteSchema,
});

export type TrackingEventInput = z.input<typeof trackingEventSchema>;

export async function addTrackingEventAction(orderId: string, input: TrackingEventInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = trackingEventSchema.safeParse(input);
  if (!parsed.success) return zodError(parsed.error);
  try {
    const order = await db.order.findUnique({ where: { id: idSchema.parse(orderId) }, select: { status: true } });
    if (!order) return { ok: false, error: "Order not found" };
    if (order.status === "CANCELLED") return { ok: false, error: "This order is cancelled" };
    await addTrackingEvent(orderId, parsed.data);
    await revalidateOrder(orderId);
    return { ok: true };
  } catch (err) {
    return failure(err, "Could not add the tracking update");
  }
}

// ─── Cancellations & refunds ───────────────────────────────────────────────

export async function resolveCancellationAction(
  requestId: string,
  approve: boolean,
  adminNote?: string,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z
    .object({ requestId: idSchema, approve: z.boolean(), adminNote: noteSchema })
    .safeParse({ requestId, approve, adminNote });
  if (!parsed.success) return zodError(parsed.error);
  try {
    const req = await db.cancellationRequest.findUnique({ where: { id: parsed.data.requestId }, select: { orderId: true } });
    if (!req) return { ok: false, error: "Cancellation request not found" };
    await resolveCancellation(parsed.data.requestId, parsed.data.approve, parsed.data.adminNote || undefined);
    await revalidateOrder(req.orderId);
    return { ok: true };
  } catch (err) {
    return failure(err, "Could not resolve the cancellation request");
  }
}

export async function processRefundAction(refundId: string, success: boolean): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.object({ refundId: idSchema, success: z.boolean() }).safeParse({ refundId, success });
  if (!parsed.success) return zodError(parsed.error);
  try {
    const refund = await db.refund.findUnique({ where: { id: parsed.data.refundId }, select: { orderId: true } });
    if (!refund) return { ok: false, error: "Refund not found" };
    await processRefund(parsed.data.refundId, parsed.data.success);
    await revalidateOrder(refund.orderId);
    return { ok: true };
  } catch (err) {
    return failure(err, "Could not update the refund");
  }
}
