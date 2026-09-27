import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ORDER_STATUS_META, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import { buildOrderWhere, parseOrderFilters } from "@/server/admin/orders";
import type { ShippingAddress } from "@/types";

const MAX_ROWS = 5000;

function csvCell(value: string | number | null | undefined) {
  const s = value == null ? "" : String(value);
  // Neutralise spreadsheet formula injection and escape quotes.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const filters = parseOrderFilters(Object.fromEntries(request.nextUrl.searchParams));
  const orders = await db.order.findMany({
    where: buildOrderWhere(filters),
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
    include: { items: { select: { quantity: true } }, user: { select: { name: true } } },
  });

  const header = [
    "Order number",
    "Placed at",
    "Customer",
    "Phone",
    "Email",
    "City",
    "State",
    "PIN code",
    "Items",
    "Subtotal",
    "Discount",
    "Shipping",
    "Gift wrap",
    "COD fee",
    "Total",
    "Coupon",
    "Payment method",
    "Payment status",
    "Fulfilment status",
    "Courier",
    "AWB",
  ];
  const rows = orders.map((o) => {
    const addr = o.shippingAddress as ShippingAddress | null;
    return [
      o.orderNumber,
      o.createdAt.toISOString(),
      o.user?.name || addr?.fullName,
      o.phone,
      o.email,
      addr?.city,
      addr?.state,
      addr?.pincode,
      o.items.reduce((n, i) => n + i.quantity, 0),
      o.subtotal,
      o.discount,
      o.shippingFee,
      o.giftWrapFee,
      o.codFee,
      o.total,
      o.couponCode,
      PAYMENT_METHOD_LABEL[o.paymentMethod],
      PAYMENT_STATUS_META[o.paymentStatus].label,
      ORDER_STATUS_META[o.status].label,
      o.courier,
      o.trackingNumber,
    ]
      .map(csvCell)
      .join(",");
  });

  const csv = "﻿" + [header.join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lushaura-orders-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
