import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

const DAY = 86_400_000;
const istDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });

/** Revenue = paid online orders + delivered COD orders, never cancelled ones. */
function revenueWhere(from: Date, to: Date): Prisma.OrderWhereInput {
  return {
    createdAt: { gte: from, lt: to },
    status: { not: "CANCELLED" },
    OR: [{ paymentStatus: "PAID" }, { paymentMethod: "COD", status: "DELIVERED" }],
  };
}

function placedWhere(from: Date, to: Date): Prisma.OrderWhereInput {
  return { createdAt: { gte: from, lt: to }, status: { notIn: ["PENDING_PAYMENT", "CANCELLED"] } };
}

export type Kpi = { value: number; previous: number };

async function periodKpis(from: Date, to: Date) {
  const [rev, orders, customers] = await Promise.all([
    db.order.aggregate({ where: revenueWhere(from, to), _sum: { total: true }, _count: { _all: true } }),
    db.order.count({ where: placedWhere(from, to) }),
    db.user.count({ where: { role: "CUSTOMER", createdAt: { gte: from, lt: to } } }),
  ]);
  const revenue = rev._sum.total ?? 0;
  const paidCount = rev._count._all;
  return { revenue, orders, aov: paidCount ? Math.round(revenue / paidCount) : 0, customers };
}

export async function getDashboardData() {
  const now = new Date();
  const start = new Date(now.getTime() - 30 * DAY);
  const prevStart = new Date(now.getTime() - 60 * DAY);

  const [current, previous, revenueOrders, statusGroups, recentOrders, lowStock, pending, topGroups] = await Promise.all([
    periodKpis(start, now),
    periodKpis(prevStart, start),
    db.order.findMany({ where: revenueWhere(start, now), select: { createdAt: true, total: true } }),
    db.order.groupBy({ by: ["status"], _count: { _all: true } }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        createdAt: true,
        user: { select: { name: true, phone: true } },
      },
    }),
    db.product.findMany({
      where: { status: { not: "ARCHIVED" }, stock: { lte: db.product.fields.lowStockAt } },
      orderBy: [{ stock: "asc" }, { name: "asc" }],
      take: 8,
      select: { id: true, name: true, sku: true, stock: true, lowStockAt: true },
    }),
    Promise.all([
      db.cancellationRequest.count({ where: { status: "REQUESTED" } }),
      db.refund.count({ where: { status: "PENDING" } }),
      db.review.count({ where: { status: "PENDING" } }),
    ]),
    db.orderItem.groupBy({
      by: ["productId"],
      where: { productId: { not: null }, order: { status: { notIn: ["CANCELLED", "PENDING_PAYMENT"] } } },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  // Revenue by IST calendar day, oldest first, including zero days.
  const byDay = new Map<string, number>();
  for (let i = 29; i >= 0; i--) byDay.set(istDay.format(new Date(now.getTime() - i * DAY)), 0);
  for (const o of revenueOrders) {
    const key = istDay.format(o.createdAt);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + o.total);
  }
  const revenueByDay = Array.from(byDay, ([date, revenue]) => ({ date, revenue }));

  const productIds = topGroups.map((g) => g.productId).filter((id): id is string => !!id);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, sku: true, images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } }, category: { select: { group: true } } },
  });
  const revenueByProduct = productIds.length
    ? await db.orderItem.findMany({
        where: { productId: { in: productIds }, order: { status: { notIn: ["CANCELLED", "PENDING_PAYMENT"] } } },
        select: { productId: true, price: true, quantity: true },
      })
    : [];
  const topProducts = topGroups
    .map((g) => {
      const p = products.find((x) => x.id === g.productId);
      if (!p) return null;
      const revenue = revenueByProduct.filter((r) => r.productId === p.id).reduce((s, r) => s + r.price * r.quantity, 0);
      return { id: p.id, name: p.name, sku: p.sku, image: p.images[0]?.url ?? null, group: p.category.group, units: g._sum.quantity ?? 0, revenue };
    })
    .filter((x) => x !== null);

  return {
    kpis: {
      revenue: { value: current.revenue, previous: previous.revenue },
      orders: { value: current.orders, previous: previous.orders },
      aov: { value: current.aov, previous: previous.aov },
      customers: { value: current.customers, previous: previous.customers },
    },
    revenueByDay,
    statusCounts: Object.fromEntries(statusGroups.map((g) => [g.status, g._count._all])) as Record<string, number>,
    recentOrders,
    lowStock,
    pending: { cancellations: pending[0], refunds: pending[1], reviews: pending[2] },
    topProducts,
  };
}
