"use client";

import { Copy, Tag } from "lucide-react";
import { toast } from "sonner";

export type OfferCoupon = { code: string; description: string };

/** Active coupons with one-tap copy. */
export function OffersBox({ coupons }: { coupons: OfferCoupon[] }) {
  if (!coupons.length) return null;
  return (
    <section aria-labelledby="offers-title" className="rounded-xl border border-dashed border-terracotta/40 bg-terracotta-soft/40 p-4 sm:p-5">
      <h2 id="offers-title" className="flex items-center gap-2 font-sans text-sm font-semibold">
        <Tag className="size-4 text-terracotta" aria-hidden /> Offers for you
      </h2>
      <ul className="mt-3 space-y-2.5">
        {coupons.map((c) => (
          <li key={c.code} className="flex items-start justify-between gap-3 text-sm">
            <span className="leading-6 text-foreground/85">{c.description}</span>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(c.code);
                  toast.success(`Code ${c.code} copied`, { description: "Apply it on the bag or checkout page." });
                } catch {
                  toast(`Use code ${c.code} at checkout`);
                }
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-dashed border-charcoal/30 bg-card px-2.5 py-1 font-mono text-xs font-semibold tracking-wider transition-colors hover:border-charcoal focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={`Copy coupon code ${c.code}`}
            >
              {c.code}
              <Copy className="size-3 text-muted-foreground" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
