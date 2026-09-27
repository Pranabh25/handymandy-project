"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { emailSchema } from "@/lib/validators";
import { completeDemoPayment, createOrder, OrderError } from "@/server/orders";
import type { ActionResult, ShippingAddress } from "@/types";

const PREPAID = ["UPI", "CARD", "NETBANKING", "WALLET"] as const;
const METHODS = [...PREPAID, "COD"] as const;

const placeOrderSchema = z.object({
  addressId: z.string().min(1, "Choose a delivery address").max(64),
  paymentMethod: z.enum(METHODS, "Choose a payment method"),
  lines: z
    .array(z.object({ productId: z.string().min(1).max(64), quantity: z.number().int().min(1).max(10) }))
    .min(1, "Your bag is empty")
    .max(50),
  couponCode: z.string().trim().max(32).nullish(),
  giftWrap: z.boolean().optional(),
  giftMessage: z.string().max(200, "Gift message can be up to 200 characters").nullish(),
  email: z.string().trim().max(120).nullish(),
});

export type PlaceOrderInput = z.input<typeof placeOrderSchema>;

export type PlacedOrder = {
  orderId: string;
  orderNumber: string;
  total: number;
  paymentMethod: (typeof METHODS)[number];
  /** COD orders are confirmed immediately; prepaid orders await the demo payment. */
  requiresPayment: boolean;
};

/**
 * Creates an order from the client cart. Prices, stock, coupon and fees are
 * re-validated on the server by `createOrder`.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<ActionResult<PlacedOrder>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Your session has expired. Please log in again." };

  const parsed = placeOrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your order details" };
  const data = parsed.data;

  let email: string | null = null;
  if (data.email) {
    const e = emailSchema.safeParse(data.email);
    if (!e.success) return { ok: false, error: "Enter a valid email address", fieldErrors: { email: "Enter a valid email address" } };
    email = e.data;
  }

  const address = await db.address.findFirst({ where: { id: data.addressId, userId: user.id } });
  if (!address) return { ok: false, error: "Please choose a delivery address again" };

  const snapshot: ShippingAddress = {
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    landmark: address.landmark,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    type: address.type,
  };

  // Merge duplicate lines defensively.
  const merged = new Map<string, number>();
  for (const l of data.lines) merged.set(l.productId, Math.min(10, (merged.get(l.productId) ?? 0) + l.quantity));

  try {
    const order = await createOrder({
      userId: user.id,
      lines: [...merged].map(([productId, quantity]) => ({ productId, quantity })),
      address: snapshot,
      paymentMethod: data.paymentMethod,
      couponCode: data.couponCode || null,
      giftWrap: !!data.giftWrap,
      giftMessage: data.giftMessage?.trim() || null,
      email: email ?? user.email ?? null,
    });

    // Remember the invoice email on the profile if the customer has none yet.
    if (email && !user.email) {
      const clash = await db.user.findFirst({ where: { email, NOT: { id: user.id } }, select: { id: true } });
      if (!clash) await db.user.update({ where: { id: user.id }, data: { email } });
    }

    revalidatePath("/account/orders");
    return {
      ok: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: data.paymentMethod,
        requiresPayment: data.paymentMethod !== "COD",
      },
    };
  } catch (err) {
    if (err instanceof OrderError) return { ok: false, error: err.message };
    console.error("placeOrder failed", err);
    return { ok: false, error: "We couldn't place your order right now. Please try again in a moment." };
  }
}

const confirmSchema = z.object({
  orderId: z.string().min(1).max(64),
  success: z.boolean(),
  method: z.enum(PREPAID),
});

/**
 * Resolves the DEMO payment for a prepaid order. No card, UPI or bank data is
 * ever sent here — only the chosen method and the simulated outcome.
 */
export async function confirmPayment(
  input: z.input<typeof confirmSchema>,
): Promise<ActionResult<{ orderNumber: string; paid: boolean }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Your session has expired. Please log in again." };
  const parsed = confirmSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid payment request" };

  try {
    const order = await completeDemoPayment({
      orderId: parsed.data.orderId,
      userId: user.id,
      success: parsed.data.success,
      method: parsed.data.method,
      failureReason: parsed.data.success ? undefined : "Payment declined (simulated in demo mode)",
    });
    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${order.orderNumber}`);
    return { ok: true, data: { orderNumber: order.orderNumber, paid: order.paymentStatus === "PAID" } };
  } catch (err) {
    if (err instanceof OrderError) return { ok: false, error: err.message };
    console.error("confirmPayment failed", err);
    return { ok: false, error: "We couldn't confirm the payment. Please try again." };
  }
}
