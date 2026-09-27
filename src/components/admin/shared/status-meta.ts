import type { Tone } from "@/lib/order-status";
import type { ProductStatus, ReviewStatus } from "@/generated/prisma/enums";

export const PRODUCT_STATUS_META: Record<ProductStatus, { label: string; tone: Tone }> = {
  ACTIVE: { label: "Active", tone: "success" },
  DRAFT: { label: "Draft", tone: "warning" },
  ARCHIVED: { label: "Archived", tone: "neutral" },
};

export const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "Pending", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
};

export function stockMeta(stock: number, lowStockAt: number): { label: string; tone: Tone } {
  if (stock <= 0) return { label: "Out of stock", tone: "danger" };
  if (stock <= lowStockAt) return { label: "Low stock", tone: "warning" };
  return { label: "In stock", tone: "success" };
}
