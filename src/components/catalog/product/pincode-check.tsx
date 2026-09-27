"use client";

import { useId, useState } from "react";
import { CheckCircle2, MapPin, Truck } from "lucide-react";
import { useStoreSettings } from "@/components/providers/store-provider";
import { Button } from "@/components/ui/button";
import { formatINR, formatShortDate } from "@/lib/format";

type Result = { pincode: string; from: Date; to: Date };

/** Indicative delivery estimate: metros (first digit 1–6) 3–4 days, elsewhere 4–5 days. */
function estimate(pincode: string): Result {
  const days = Number(pincode[0]) <= 6 ? 3 : 4;
  const from = new Date();
  from.setDate(from.getDate() + days);
  const to = new Date();
  to.setDate(to.getDate() + days + 1);
  return { pincode, from, to };
}

export function PincodeCheck({ inStock }: { inStock: boolean }) {
  const id = useId();
  const settings = useStoreSettings();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(value)) {
      setResult(null);
      setError("Enter a valid 6-digit PIN code");
      return;
    }
    setError(null);
    setResult(estimate(value));
  }

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-xl border bg-card p-4 sm:p-5">
      <h2 id={`${id}-title`} className="flex items-center gap-2 font-sans text-sm font-semibold">
        <Truck className="size-4 text-terracotta" aria-hidden /> Check delivery
      </h2>
      <form onSubmit={check} className="mt-3 flex gap-2" noValidate>
        <label htmlFor={`${id}-pin`} className="sr-only">
          Delivery PIN code
        </label>
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id={`${id}-pin`}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="Enter PIN code, e.g. 560038"
            value={value}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm"
          />
        </div>
        <Button type="submit" variant="outline">
          Check
        </Button>
      </form>
      <div aria-live="polite" className="text-sm">
        {error ? (
          <p id={`${id}-err`} role="alert" className="mt-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}
        {result ? (
          <ul className="mt-3 space-y-1.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
              <span>
                {inStock ? (
                  <>
                    Delivery by <strong className="font-semibold">{formatShortDate(result.from)}</strong> –{" "}
                    <strong className="font-semibold">{formatShortDate(result.to)}</strong> to {result.pincode}
                  </>
                ) : (
                  <>We deliver to {result.pincode} — this item is currently out of stock.</>
                )}
              </span>
            </li>
            {settings.codEnabled ? (
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
                <span>Cash on Delivery available</span>
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Free shipping on orders above {formatINR(settings.freeShippingThreshold)} · Easy 7-day returns on unopened items
          </p>
        )}
      </div>
    </section>
  );
}
