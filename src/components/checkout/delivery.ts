import { formatShortDate } from "@/lib/format";

/** Mirrors the 5-day estimate stored on new orders by createOrder(). */
export const DELIVERY_DAYS = 5;

/** "Thu, 2 Oct" — estimated delivery if the order is placed now. */
export function estimatedDeliveryLabel(days = DELIVERY_DAYS, from: Date = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return formatShortDate(d);
}
