import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { ADMIN_PAGE_SIZE } from "./products";

/** Orders that count towards a customer's lifetime spend. */
const spendWhere: Prisma.OrderWhereInput = { status: { notIn: ["CANCELLED", "PENDING_PAYMENT"] } };

export async function getAdminCustomers(f: { q?: string; page?: number }) {
  const where: Prisma.UserWhereInput = { role: "CUSTOMER" };
  if (f.q) {
    const digits = f.q.replace(/\D/g, "");
    where.OR = [
      { name: { contains: f.q, mode: "insensitive" } },
      { email: { contains: f.q, mode: "insensitive" } },
      ...(digits.length >= 3 ? [{ phone: { contains: digits } }] : []),
    ];
  }
  const page = Math.max(1, f.page ?? 1);
  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: { id: true, name: true, email: true, phone: true, createdAt: true, _count: { select: { orders: true } } },
    }),
    db.user.count({ where }),
  ]);
  const stats = users.length
    ? await db.order.groupBy({
        by: ["userId"],
        where: { ...spendWhere, userId: { in: users.map((u) => u.id) } },
        _sum: { total: true },
        _max: { createdAt: true },
      })
    : [];
  const lastAny = users.length
    ? await db.order.groupBy({ by: ["userId"], where: { userId: { in: users.map((u) => u.id) } }, _max: { createdAt: true } })
    : [];
  const items = users.map((u) => {
    const s = stats.find((x) => x.userId === u.id);
    return {
      ...u,
      orderCount: u._count.orders,
      totalSpent: s?._sum.total ?? 0,
      lastOrderAt: lastAny.find((x) => x.userId === u.id)?._max.createdAt ?? null,
    };
  });
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)) };
}

export async function getAdminCustomer(id: string) {
  const user = await db.user.findFirst({
    where: { id, role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] },
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          createdAt: true,
          total: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          _count: { select: { items: true } },
        },
      },
      _count: { select: { reviews: true } },
    },
  });
  if (!user) return null;
  const spend = await db.order.aggregate({ where: { ...spendWhere, userId: id }, _sum: { total: true }, _count: { _all: true } });
  return {
    ...user,
    totalSpent: spend._sum.total ?? 0,
    countedOrders: spend._count._all,
    aov: spend._count._all ? Math.round((spend._sum.total ?? 0) / spend._count._all) : 0,
  };
}
