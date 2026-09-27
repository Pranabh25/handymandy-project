import type { OrderStatus, PaymentMethod, PaymentStatus, RefundStatus, CancellationStatus } from "@/generated/prisma/enums";

/** Client-safe labels and badge tones for order-related enums. */

export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: Tone; description: string }> = {
  PENDING_PAYMENT: { label: "Awaiting payment", tone: "warning", description: "Payment has not been completed yet." },
  CONFIRMED: { label: "Confirmed", tone: "info", description: "We've received your order and are preparing it." },
  PACKED: { label: "Packed", tone: "info", description: "Your order is gift-packed and ready to ship." },
  SHIPPED: { label: "Shipped", tone: "accent", description: "Your order is on its way." },
  OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "accent", description: "Arriving today." },
  DELIVERED: { label: "Delivered", tone: "success", description: "Delivered. We hope it made someone smile." },
  CANCELLED: { label: "Cancelled", tone: "danger", description: "This order was cancelled." },
};

/** Forward-only fulfilment steps shown on the tracking timeline. */
export const FULFILMENT_STEPS: OrderStatus[] = ["CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

/** Statuses an admin may move an order to from its current status. */
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

/** Customers can request cancellation until the parcel leaves the warehouse. */
export const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "CONFIRMED", "PACKED"];

export const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Pending", tone: "warning" },
  PAID: { label: "Paid", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
  REFUNDED: { label: "Refunded", tone: "neutral" },
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  UPI: "UPI",
  CARD: "Credit / Debit Card",
  NETBANKING: "Net Banking",
  WALLET: "Wallet",
  COD: "Cash on Delivery",
};

export const REFUND_STATUS_META: Record<RefundStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Pending", tone: "warning" },
  PROCESSED: { label: "Processed", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
};

export const CANCELLATION_STATUS_META: Record<CancellationStatus, { label: string; tone: Tone }> = {
  REQUESTED: { label: "Requested", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
};

export const COURIERS = ["Blue Dart", "Delhivery", "DTDC", "Ecom Express", "Shiprocket", "India Post"] as const;
