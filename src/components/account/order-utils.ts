import type { OrderStatus } from "@/generated/prisma/enums";
import type { ShippingAddress } from "@/types";

/** Order list filter tabs on /account/orders. */
export const ORDER_FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export type OrderFilter = (typeof ORDER_FILTERS)[number]["key"];

export const ACTIVE_STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY"];

export function statusesForFilter(filter: OrderFilter): OrderStatus[] | undefined {
  if (filter === "active") return ACTIVE_STATUSES;
  if (filter === "delivered") return ["DELIVERED"];
  if (filter === "cancelled") return ["CANCELLED"];
  return undefined;
}

export function parseFilter(value: string | string[] | undefined): OrderFilter {
  const v = Array.isArray(value) ? value[0] : value;
  return ORDER_FILTERS.some((f) => f.key === v) ? (v as OrderFilter) : "all";
}

/** The order's JSON address snapshot, typed. */
export function orderAddress(value: unknown): ShippingAddress | null {
  if (!value || typeof value !== "object") return null;
  const a = value as Partial<ShippingAddress>;
  if (!a.fullName || !a.line1 || !a.city) return null;
  return a as ShippingAddress;
}

export function addressLines(a: ShippingAddress) {
  return [a.line1, a.line2, a.landmark ? `Near ${a.landmark}` : null, `${a.city}, ${a.state} ${a.pincode}`].filter(
    Boolean,
  ) as string[];
}

export function firstParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}
