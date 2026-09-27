import { Truck } from "lucide-react";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { remaining: number; threshold: number; className?: string };

export function FreeShippingProgress({ remaining, threshold, className }: Props) {
  const unlocked = remaining <= 0;
  const pct = threshold > 0 ? Math.min(100, Math.round(((threshold - remaining) / threshold) * 100)) : 100;
  return (
    <div className={cn("rounded-xl border bg-card px-4 py-3.5", className)}>
      <div className="flex items-center gap-2.5 text-sm" aria-live="polite">
        <Truck className={cn("size-4 shrink-0", unlocked ? "text-sage" : "text-terracotta")} aria-hidden />
        {unlocked ? (
          <p>
            <span className="font-semibold text-sage">You&apos;ve unlocked free shipping.</span>{" "}
            <span className="text-muted-foreground">Your order ships free across India.</span>
          </p>
        ) : (
          <p>
            Add <span className="font-semibold tabular-nums">{formatINR(remaining)}</span> more for{" "}
            <span className="font-semibold">free shipping</span>
          </p>
        )}
      </div>
      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Progress towards free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-out", unlocked ? "bg-sage" : "bg-terracotta")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
