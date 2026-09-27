import Link from "next/link";
import { Ban, ChevronRight, MessageSquareQuote, PackageCheck, RotateCcw, TrendingUp } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { AdminThumb } from "@/components/admin/shared/thumb";
import { stockMeta } from "@/components/admin/shared/status-meta";
import { formatINR, pluralize } from "@/lib/format";
import { ORDER_STATUS_META } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

export function PendingActions({ cancellations, refunds, reviews }: { cancellations: number; refunds: number; reviews: number }) {
  const items = [
    { href: "/admin/cancellations", label: "Cancellation requests", count: cancellations, icon: Ban },
    { href: "/admin/refunds", label: "Refunds to process", count: refunds, icon: RotateCcw },
    { href: "/admin/reviews", label: "Reviews awaiting moderation", count: reviews, icon: MessageSquareQuote },
  ];
  const allClear = items.every((i) => i.count === 0);
  return (
    <AdminCard title="Needs attention">
      <ul className="divide-y">
        {items.map(({ href, label, count, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-muted/60">
              <Icon className={cn("size-4 shrink-0", count ? "text-terracotta" : "text-muted-foreground")} aria-hidden />
              <span className="flex-1">{label}</span>
              <span className={cn("rounded-full px-2 text-xs leading-5 font-semibold tabular-nums", count ? "bg-terracotta text-white" : "bg-muted text-muted-foreground")}>
                {count}
              </span>
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      {allClear ? <p className="border-t px-5 py-3 text-xs text-sage">All caught up — nothing is waiting on you.</p> : null}
    </AdminCard>
  );
}

const STATUS_ORDER: OrderStatus[] = ["PENDING_PAYMENT", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export function OrdersByStatus({ counts }: { counts: Record<string, number> }) {
  const total = STATUS_ORDER.reduce((s, k) => s + (counts[k] ?? 0), 0);
  return (
    <AdminCard title="Orders by status" action={<span className="text-xs text-muted-foreground">All time · {total}</span>}>
      <ul className="space-y-2.5 px-5 py-4">
        {STATUS_ORDER.map((s) => {
          const n = counts[s] ?? 0;
          const pct = total ? (n / total) * 100 : 0;
          return (
            <li key={s}>
              <Link href={`/admin/orders?status=${s}`} className="group block">
                <div className="flex items-center justify-between text-sm">
                  <span className="group-hover:text-terracotta">{ORDER_STATUS_META[s].label}</span>
                  <span className="font-medium tabular-nums">{n}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted" aria-hidden>
                  <div className="h-full rounded-full bg-charcoal/70" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </AdminCard>
  );
}

export function LowStockList({ items }: { items: { id: string; name: string; sku: string; stock: number; lowStockAt: number }[] }) {
  return (
    <AdminCard
      title="Low stock"
      action={
        <Link href="/admin/inventory?filter=low" className="text-xs font-medium text-terracotta hover:underline">
          Inventory
        </Link>
      }
    >
      {items.length === 0 ? (
        <p className="flex items-center gap-2 px-5 py-6 text-sm text-muted-foreground">
          <PackageCheck className="size-4 text-sage" aria-hidden /> Every product is above its reorder level.
        </p>
      ) : (
        <ul className="divide-y">
          {items.map((p) => {
            const meta = stockMeta(p.stock, p.lowStockAt);
            return (
              <li key={p.id} className="flex items-center gap-3 px-5 py-2.5">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/products/${p.id}`} className="block truncate text-sm font-medium hover:text-terracotta">
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {p.sku} · reorder at {p.lowStockAt}
                  </p>
                </div>
                <StatusBadge tone={meta.tone}>{p.stock <= 0 ? "Out" : `${p.stock} left`}</StatusBadge>
              </li>
            );
          })}
        </ul>
      )}
    </AdminCard>
  );
}

type Top = { id: string; name: string; sku: string; image: string | null; group: "GIFTS" | "COSMETICS"; units: number; revenue: number };

export function TopProducts({ items }: { items: Top[] }) {
  return (
    <AdminCard title="Top sellers" action={<span className="text-xs text-muted-foreground">By units sold</span>}>
      {items.length === 0 ? (
        <p className="flex items-center gap-2 px-5 py-6 text-sm text-muted-foreground">
          <TrendingUp className="size-4" aria-hidden /> Bestsellers will show up after your first orders.
        </p>
      ) : (
        <ol className="divide-y">
          {items.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 px-5 py-2.5">
              <span className="w-4 text-xs font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
              <AdminThumb src={p.image} alt={p.name} group={p.group} />
              <div className="min-w-0 flex-1">
                <Link href={`/admin/products/${p.id}`} className="block truncate text-sm font-medium hover:text-terracotta">
                  {p.name}
                </Link>
                <p className="text-xs text-muted-foreground">{pluralize(p.units, "unit")} sold</p>
              </div>
              <span className="text-sm font-medium tabular-nums">{formatINR(p.revenue)}</span>
            </li>
          ))}
        </ol>
      )}
    </AdminCard>
  );
}
