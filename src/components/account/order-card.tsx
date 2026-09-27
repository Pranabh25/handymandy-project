import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/generated/prisma/enums";
import { StatusBadge } from "@/components/common/status-badge";
import { ProductImage } from "@/components/product/product-image";
import { buttonVariants } from "@/components/ui/button";
import { ORDER_STATUS_META, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import { formatDate, formatINR, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";

export type OrderCardData = {
  orderNumber: string;
  createdAt: Date;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  total: number;
  items: { id: string; name: string; image: string | null; quantity: number }[];
};

export function OrderCard({ order, compact = false }: { order: OrderCardData; compact?: boolean }) {
  const meta = ORDER_STATUS_META[order.status];
  const pay = PAYMENT_STATUS_META[order.paymentStatus];
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const shown = order.items.slice(0, compact ? 3 : 4);
  const extra = order.items.length - shown.length;
  const href = `/account/orders/${order.orderNumber}`;

  return (
    <article className="rounded-xl border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h3 className="font-sans text-sm font-semibold tracking-wide">
            <Link href={href} className="hover:underline">
              Order {order.orderNumber}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Placed {formatDate(order.createdAt)} · {pluralize(itemCount, "item")}
          </p>
        </div>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {shown.map((item) => (
          <div key={item.id} className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-sand md:size-16">
            <ProductImage src={item.image} alt={item.name} sizes="64px" />
          </div>
        ))}
        {extra > 0 ? (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border bg-muted text-xs font-medium text-muted-foreground md:size-16">
            +{extra}
          </div>
        ) : null}
        {!compact ? (
          <p className="ml-2 line-clamp-2 min-w-0 flex-1 text-sm text-muted-foreground max-sm:hidden">
            {order.items.map((i) => i.name).join(", ")}
          </p>
        ) : null}
      </div>

      {order.status === "PENDING_PAYMENT" ? (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-[#f7ecd8] px-3 py-2 text-xs leading-5 text-[#8a6420]">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Complete payment to confirm this order — open the order for options.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-sm">
            <span className="text-muted-foreground">Total </span>
            <span className="font-semibold">{formatINR(order.total)}</span>
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {PAYMENT_METHOD_LABEL[order.paymentMethod]}
            <StatusBadge tone={pay.tone} className="px-2 py-0 text-[0.7rem]">
              {pay.label}
            </StatusBadge>
          </p>
        </div>
        <Link
          href={href}
          className={cn(buttonVariants({ variant: order.status === "PENDING_PAYMENT" ? "accent" : "outline", size: "sm" }))}
        >
          {order.status === "PENDING_PAYMENT" ? "Complete payment" : "View details"}
          <ArrowRight aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/** Prisma select for OrderCardData. */
export const orderCardSelect = {
  orderNumber: true,
  createdAt: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  total: true,
  items: { select: { id: true, name: true, image: true, quantity: true } },
} as const;
