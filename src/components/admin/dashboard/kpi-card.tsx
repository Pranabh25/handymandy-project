import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Stat tile: label · value · signed delta vs the previous 30 days. */
export function KpiCard({ label, value, current, previous, hint }: { label: string; value: string; current: number; previous: number; hint?: string }) {
  const pct = previous > 0 ? Math.round(((current - previous) / previous) * 1000) / 10 : null;
  const dir = pct == null ? (current > 0 ? "up" : "flat") : pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  const Icon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;
  const deltaText = pct == null ? (current > 0 ? "New this period" : "No change") : `${pct > 0 ? "+" : ""}${pct}%`;
  return (
    <div className="rounded-xl border bg-card p-4 shadow-soft sm:p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">{value}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-medium",
            dir === "up" && "text-sage",
            dir === "down" && "text-destructive",
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          <span className="sr-only">{dir === "up" ? "Up" : dir === "down" ? "Down" : ""}</span>
          {deltaText}
        </span>
        <span>vs previous 30 days</span>
      </p>
      {hint ? <p className="mt-1 text-[0.7rem] text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}
