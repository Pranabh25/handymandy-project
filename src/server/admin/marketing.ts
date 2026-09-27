import "server-only";
import { db } from "@/lib/db";
import type { ReviewStatus } from "@/generated/prisma/enums";

export async function getAdminCoupons() {
  return db.coupon.findMany({ orderBy: [{ isActive: "desc" }, { createdAt: "desc" }] });
}

export type AdminCoupon = Awaited<ReturnType<typeof getAdminCoupons>>[number];

export async function getReviewQueue(status: ReviewStatus, page = 1, pageSize = 20) {
  const where = { status };
  const [items, total, counts] = await Promise.all([
    db.review.findMany({
      where,
      orderBy: { createdAt: status === "PENDING" ? "asc" : "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        product: { select: { id: true, name: true, slug: true, rating: true, reviewCount: true } },
        user: { select: { id: true, phone: true } },
      },
    }),
    db.review.count({ where }),
    db.review.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const byStatus = { PENDING: 0, APPROVED: 0, REJECTED: 0 } as Record<ReviewStatus, number>;
  for (const c of counts) byStatus[c.status] = c._count._all;
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / pageSize)), counts: byStatus };
}
