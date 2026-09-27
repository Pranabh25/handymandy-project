"use client";

import { useId, useState, useTransition } from "react";
import { BadgeCheck, TicketPercent, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cartActions } from "@/hooks/use-cart";
import { couponDiscountFor, type PricingCoupon } from "@/lib/pricing";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { validateCoupon, type AvailableCoupon } from "@/server/actions/cart";

type Props = {
  appliedCode: string | null;
  applied: { coupon: PricingCoupon | null; description?: string; error?: string; checking: boolean };
  subtotal: number;
  available: AvailableCoupon[];
  className?: string;
};

function offerLabel(c: PricingCoupon) {
  if (c.type === "PERCENT") return `${c.value}% off${c.maxDiscount ? ` up to ${formatINR(c.maxDiscount)}` : ""}`;
  if (c.type === "FLAT") return `${formatINR(c.value)} off`;
  return "Free shipping";
}

export function CouponBox({ appliedCode, applied, subtotal, available, className }: Props) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function apply(raw: string) {
    const value = raw.trim().toUpperCase();
    if (!value) {
      setError("Enter a coupon code");
      return;
    }
    setError(null);
    setPendingCode(value);
    start(async () => {
      const res = await validateCoupon(value, subtotal);
      setPendingCode(null);
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      cartActions.setCoupon(res.data.coupon.code);
      setCode("");
      const saving = couponDiscountFor(res.data.coupon, subtotal);
      toast.success(`${res.data.coupon.code} applied`, {
        description: saving > 0 ? `You save ${formatINR(saving)} on this order` : res.data.description,
      });
    });
  }

  function remove() {
    cartActions.setCoupon(null);
    toast(`Coupon ${appliedCode} removed`);
  }

  const others = available.filter((c) => c.code !== appliedCode);

  return (
    <section aria-labelledby={`${inputId}-title`} className={cn("rounded-xl border bg-card p-4 sm:p-5", className)}>
      <h2 id={`${inputId}-title`} className="flex items-center gap-2 font-sans text-sm font-semibold">
        <TicketPercent className="size-4 text-terracotta" aria-hidden />
        Coupons &amp; offers
      </h2>

      {appliedCode ? (
        <div
          className={cn(
            "mt-3 flex items-start justify-between gap-3 rounded-lg border border-dashed px-3.5 py-3",
            applied.error ? "border-gold/60 bg-[#fbf5e9]" : "border-sage/40 bg-sage-soft",
          )}
        >
          <div className="min-w-0 text-sm">
            <p className="flex items-center gap-1.5 font-semibold tracking-wide">
              {!applied.error ? <BadgeCheck className="size-4 text-sage" aria-hidden /> : null}
              {appliedCode}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground" aria-live="polite">
              {applied.error
                ? applied.error
                : applied.checking && !applied.coupon
                  ? "Checking…"
                  : applied.coupon
                    ? couponDiscountFor(applied.coupon, subtotal) > 0
                      ? `Saving ${formatINR(couponDiscountFor(applied.coupon, subtotal))} · ${applied.description ?? ""}`
                      : (applied.description ?? offerLabel(applied.coupon))
                    : null}
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={remove} className="-mr-1 shrink-0">
            <X className="size-3.5" aria-hidden />
            Remove
          </Button>
        </div>
      ) : (
        <form
          className="mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            apply(code);
          }}
        >
          <label htmlFor={inputId} className="sr-only">
            Coupon code
          </label>
          <div className="flex gap-2">
            <Input
              id={inputId}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError(null);
              }}
              placeholder="Enter coupon code"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={32}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className="h-10 uppercase placeholder:normal-case"
            />
            <Button type="submit" variant="outline" disabled={pending} className="shrink-0">
              {pending && pendingCode === code.trim().toUpperCase() ? "Applying…" : "Apply"}
            </Button>
          </div>
          {error ? (
            <p id={errorId} role="alert" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          ) : null}
        </form>
      )}

      {others.length ? (
        <ul className="mt-4 space-y-2" aria-label="Available coupons">
          {others.map((c) => {
            const short = Math.max(0, c.minOrder - subtotal);
            return (
              <li key={c.code} className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.12em] text-charcoal">
                    {c.code} <span className="font-medium tracking-normal text-terracotta">· {offerLabel(c)}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {short > 0 ? `Add ${formatINR(short)} more to unlock · ` : ""}
                    {c.description}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="shrink-0 text-terracotta hover:text-terracotta"
                  disabled={pending || short > 0}
                  onClick={() => apply(c.code)}
                  aria-label={`Apply coupon ${c.code}`}
                >
                  {pending && pendingCode === c.code ? "Applying…" : "Apply"}
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
