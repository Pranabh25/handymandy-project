import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CHECKOUT_STEPS = ["Contact", "Address", "Review", "Payment"] as const;

/** Horizontal progress indicator for the four checkout steps. */
export function CheckoutSteps({ current, className }: { current: number; className?: string }) {
  return (
    <nav aria-label="Checkout progress" className={className}>
      <ol className="flex items-center">
        {CHECKOUT_STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className={cn("flex items-center", i < CHECKOUT_STEPS.length - 1 && "flex-1")}>
              <div className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    done && "border-sage bg-sage text-white",
                    active && "border-charcoal bg-charcoal text-ivory",
                    !done && !active && "border-input bg-card text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium sm:text-sm",
                    active ? "text-foreground" : "text-muted-foreground",
                    !active && "hidden sm:inline",
                  )}
                >
                  {label}
                  {done ? <span className="sr-only"> (completed)</span> : null}
                </span>
              </div>
              {i < CHECKOUT_STEPS.length - 1 ? (
                <span aria-hidden className={cn("mx-2 h-px flex-1 sm:mx-3", done ? "bg-sage" : "bg-border")} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
