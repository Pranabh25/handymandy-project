import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { rating: number; count?: number; size?: "sm" | "md"; className?: string };

export function RatingStars({ rating, count, size = "sm", className }: Props) {
  const px = size === "sm" ? "size-3.5" : "size-4.5";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)));
          return (
            <span key={i} className={cn("relative", px)}>
              <Star className={cn("absolute inset-0 text-charcoal/15", px)} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn("text-gold", px)} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      {count != null ? (
        <span className={cn("text-muted-foreground tabular-nums", size === "sm" ? "text-xs" : "text-sm")}>
          {rating.toFixed(1)} <span aria-hidden>·</span> {count.toLocaleString("en-IN")} {count === 1 ? "review" : "reviews"}
        </span>
      ) : null}
    </div>
  );
}
