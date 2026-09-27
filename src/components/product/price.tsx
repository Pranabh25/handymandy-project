import { discountPercent, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = { price: number; mrp: number; size?: "sm" | "md" | "lg"; className?: string; showTaxNote?: boolean };

export function Price({ price, mrp, size = "md", className, showTaxNote }: Props) {
  const off = discountPercent(price, mrp);
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span
          className={cn(
            "font-semibold text-foreground tabular-nums",
            size === "sm" && "text-sm",
            size === "md" && "text-base",
            size === "lg" && "text-2xl",
          )}
        >
          {formatINR(price)}
        </span>
        {off > 0 ? (
          <>
            <span className={cn("text-muted-foreground line-through tabular-nums", size === "lg" ? "text-base" : "text-xs")}>
              <span className="sr-only">MRP </span>
              {formatINR(mrp)}
            </span>
            <span className={cn("font-semibold text-sage", size === "lg" ? "text-base" : "text-xs")}>{off}% off</span>
          </>
        ) : null}
      </div>
      {showTaxNote ? <span className="text-xs text-muted-foreground">MRP inclusive of all taxes</span> : null}
    </div>
  );
}
