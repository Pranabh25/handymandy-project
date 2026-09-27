import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import {
  CancellationStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from "@/generated/prisma/enums";

/**
 * Read-only admin queries for orders, cancellations, refunds and payments.
 * Mutations live in src/server/orders.ts (called via src/server/actions/admin-orders.ts).
 */

export const ADMIN_PAGE_SIZE = 20;

type SearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
}

function pick<T extends string>(value: string | undefined, allowed: Record<string, T>): T | undefined {
  return value && value in allowed ? (value as T) : undefined;
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export const DATE_RANGES = ["7", "30", "90"] as const;

export type OrderFilters = {
  q?: string;
  status?: OrderStatus;
  method?: PaymentMethod;
  pay?: PaymentStatus;
  range?: (typeof DATE_RANGES)[number];
  page: number;
};

export function parseOrderFilters(sp: SearchParams): OrderFilters {
  const range = one(sp.range);
  const page = Number.parseInt(one(sp.page) ?? "1", 10);
  return {
    q: one(sp.q)?.slice(0, 80),
    status: pick(one(sp.status), OrderStatus),
    method: pick(one(sp.method), PaymentMethod),
    pay: pick(one(sp.pay), PaymentStatus),
    range: DATE_RANGES.find((r) => r === range),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Where clause for everything except the status tab (so tab counts respect other filters). */
function baseOrderWhere(f: Omit<OrderFilters, "page" | "status">): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};
  if (f.q) {
    const digits = f.q.replace(/\D/g, "");
    where.OR = [
      { orderNumber: { contains: f.q, mode: "insensitive" } },
      { user: { name: { contains: f.q, mode: "insensitive" } } },
      { email: { contains: f.q, mode: "insensitive" } },
      ...(digits.length >= 4 ? [{ phone: { contains: digits } }] : []),
    ];
  }
  if (f.method) where.paymentMethod = f.method;
  if (f.pay) where.paymentStatus = f.pay;
  if (f.range) where.createdAt = { gte: daysAgo(Number(f.range)) };
  return where;
}

export function buildOrderWhere(f: Omit<OrderFilters, "page">): Prisma.OrderWhereInput {
  const where = baseOrderWhere(f);
  if (f.status) where.status = f.status;
  return where;
}

export const orderListSelect = {
  id: true,
  orderNumber: true,
  createdAt: true,
  status: true,
  paymentMethod: true,
  paymentStatus: true,
  total: true,
  phone: true,
  email: true,
  shippingAddress: true,
  user: { select: { id: true, name: true } },
  cancellation: { select: { status: true } },
  items: { select: { quantity: true } },
} satisfies Prisma.OrderSelect;

export type AdminOrderRow = Prisma.OrderGetPayload<{ select: typeof orderListSelect }>;

export async function listAdminOrders(f: OrderFilters) {
  const where = buildOrderWhere(f);
  const [orders, total, grouped] = await Promise.all([
    db.order.findMany({
      where,
      select: orderListSelect,
      orderBy: { createdAt: "desc" },
      skip: (f.page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
    }),
    db.order.count({ where }),
    db.order.groupBy({ by: ["status"], where: baseOrderWhere(f), _count: { _all: true } }),
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Partial<Record<OrderStatus, number>>;
  const all = grouped.reduce((n, g) => n + g._count._all, 0);
  return { orders, total, counts, all, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)) };
}

// ─── Cancellations ─────────────────────────────────────────────────────────

export async function listCancellations(status: CancellationStatus) {
  const [requests, grouped] = await Promise.all([
    db.cancellationRequest.findMany({
      where: { status },
      orderBy: status === "REQUESTED" ? { createdAt: "asc" } : { resolvedAt: "desc" },
      take: 100,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            paymentMethod: true,
            paymentStatus: true,
            user: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
      },
    }),
    db.cancellationRequest.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Partial<
    Record<CancellationStatus, number>
  >;
  return { requests, counts };
}

export type AdminCancellation = Awaited<ReturnType<typeof listCancellations>>["requests"][number];

// ─── Refunds ───────────────────────────────────────────────────────────────

export async function listRefunds(status: RefundStatus) {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const [refunds, grouped, pending, thisMonth] = await Promise.all([
    db.refund.findMany({
      where: { status },
      orderBy: status === "PROCESSED" ? { processedAt: "desc" } : { createdAt: "desc" },
      take: 100,
      include: {
        payment: { select: { method: true, providerPaymentId: true } },
        order: {
          select: {
            id: true,
            orderNumber: true,
            paymentMethod: true,
            user: { select: { id: true, name: true } },
          },
        },
      },
    }),
    db.refund.groupBy({ by: ["status"], _count: { _all: true } }),
    db.refund.aggregate({ where: { status: "PENDING" }, _sum: { amount: true } }),
    db.refund.aggregate({
      where: { status: "PROCESSED", processedAt: { gte: monthStart } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Partial<Record<RefundStatus, number>>;
  return {
    refunds,
    counts,
    pendingAmount: pending._sum.amount ?? 0,
    refundedThisMonth: thisMonth._sum.amount ?? 0,
    refundedThisMonthCount: thisMonth._count._all,
  };
}

export type AdminRefund = Awaited<ReturnType<typeof listRefunds>>["refunds"][number];

// ─── Payments ──────────────────────────────────────────────────────────────

export type PaymentFilters = { status?: PaymentStatus; method?: PaymentMethod; page: number };

export function parsePaymentFilters(sp: SearchParams): PaymentFilters {
  const page = Number.parseInt(one(sp.page) ?? "1", 10);
  return {
    status: pick(one(sp.status), PaymentStatus),
    method: pick(one(sp.method), PaymentMethod),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export async function listPayments(f: PaymentFilters) {
  const where: Prisma.PaymentWhereInput = {};
  if (f.status) where.status = f.status;
  if (f.method) where.method = f.method;
  const since = daysAgo(30);
  const [payments, total, captured, failed, codPending, refunded] = await Promise.all([
    db.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (f.page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      include: {
        order: { select: { id: true, orderNumber: true, status: true, user: { select: { id: true, name: true } } } },
      },
    }),
    db.payment.count({ where }),
    db.payment.aggregate({
      where: { status: "PAID", updatedAt: { gte: since } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    db.payment.count({ where: { status: "FAILED", updatedAt: { gte: since }, NOT: { failureReason: "Order cancelled" } } }),
    db.payment.aggregate({
      where: { method: "COD", status: "PENDING", order: { status: { not: "CANCELLED" } } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    db.refund.aggregate({
      where: { status: "PROCESSED", processedAt: { gte: since } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);
  return {
    payments,
    total,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
    summary: {
      captured: captured._sum.amount ?? 0,
      capturedCount: captured._count._all,
      failedCount: failed,
      codPending: codPending._sum.amount ?? 0,
      codPendingCount: codPending._count._all,
      refunded: refunded._sum.amount ?? 0,
      refundedCount: refunded._count._all,
    },
  };
}

export type AdminPayment = Awaited<ReturnType<typeof listPayments>>["payments"][number];
