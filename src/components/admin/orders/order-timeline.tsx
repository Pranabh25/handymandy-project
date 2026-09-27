import { MapPin } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-page-header";
import { formatDateTime } from "@/lib/format";
import { ORDER_STATUS_META } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import type { OrderDetail } from "@/server/orders";

const DOT: Record<string, string> = {
  info: "bg-[#3c5a73]",
  accent: "bg-terracotta",
  success: "bg-sage",
  warning: "bg-gold",
  danger: "bg-destructive",
  neutral: "bg-muted-foreground",
};

/** All order events, newest first. */
export function OrderTimeline({ events }: { events: OrderDetail["events"] }) {
  const sorted = [...events].reverse(); // events arrive oldest-first
  return (
    <AdminCard title="Timeline">
      {sorted.length ? (
        <ol className="px-5 py-4">
          {sorted.map((e, i) => {
            const tone = e.status ? ORDER_STATUS_META[e.status].tone : "neutral";
            return (
              <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
                {i < sorted.length - 1 ? (
                  <span aria-hidden className="absolute top-3 left-[5px] h-full w-px bg-border" />
                ) : null}
                <span
                  aria-hidden
                  className={cn("relative mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-card", e.status ? DOT[tone] : "border-2 border-muted-foreground/50 bg-card")}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className={cn("text-sm", e.status ? "font-semibold" : "font-medium")}>{e.title}</p>
                    <time dateTime={e.createdAt.toISOString()} className="text-xs text-muted-foreground tabular-nums">
                      {formatDateTime(e.createdAt)}
                    </time>
                  </div>
                  {e.location ? (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" aria-hidden /> {e.location}
                    </p>
                  ) : null}
                  {e.note ? <p className="mt-0.5 text-sm text-muted-foreground">{e.note}</p> : null}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="px-5 py-6 text-sm text-muted-foreground">No events recorded yet.</p>
      )}
    </AdminCard>
  );
}
