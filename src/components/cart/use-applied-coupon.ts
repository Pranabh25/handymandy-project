"use client";

import { useEffect, useState } from "react";
import type { PricingCoupon } from "@/lib/pricing";
import { validateCoupon } from "@/server/actions/cart";

type Result = { code: string; subtotal: number; coupon: PricingCoupon | null; description?: string; error?: string };

/**
 * Resolves the cart's stored coupon code into pricing data, re-checking with
 * the server whenever the subtotal changes (e.g. min-order no longer met).
 */
export function useAppliedCoupon(code: string | null, subtotal: number) {
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!code || subtotal <= 0) return;
    let cancelled = false;
    validateCoupon(code, subtotal)
      .then((res) => {
        if (cancelled) return;
        setResult(
          res.ok
            ? { code, subtotal, coupon: res.data.coupon, description: res.data.description }
            : { code, subtotal, coupon: null, error: res.error },
        );
      })
      .catch(() => {
        if (!cancelled) setResult({ code, subtotal, coupon: null, error: "Couldn't check this coupon right now" });
      });
    return () => {
      cancelled = true;
    };
  }, [code, subtotal]);

  const matches = !!code && result?.code === code;
  const fresh = matches && result?.subtotal === subtotal;
  return {
    /** Coupon to feed into calculateTotals (keeps the last good value while re-checking). */
    coupon: matches ? (result?.coupon ?? null) : null,
    description: matches ? result?.description : undefined,
    error: fresh ? result?.error : undefined,
    checking: !!code && subtotal > 0 && !fresh,
  };
}
