"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ShoppingBag, Truck } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { PriceSummary } from "@/components/cart/price-summary";
import { TrustNotes } from "@/components/cart/trust-notes";
import { formatINR } from "@/lib/format";
import type { PriceBreakdown } from "@/lib/pricing";
import type { CartLine } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  lines: CartLine[];
  totals: PriceBreakdown;
  couponCode: string | null;
  showCod: boolean;
  deliveryLabel: string;
};

function Items({ lines }: { lines: CartLine[] }) {
  return (
    <ul className="space-y-3.5">
      {lines.map((l) => (
        <li key={l.productId} className="flex items-center gap-3">
          <div className="relative aspect-square w-14 shrink-0">
            <div className="absolute inset-0 overflow-hidden rounded-lg bg-muted">
              <ProductImage src={l.image} alt={l.name} sizes="56px" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-charcoal text-[0.65rem] font-semibold text-ivory">
              {l.quantity}
              <span className="sr-only"> × </span>
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm leading-snug font-medium">{l.name}</p>
            {l.size ? <p className="text-xs text-muted-foreground">{l.size}</p> : null}
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums">{formatINR(l.price * l.quantity)}</p>
        </li>
      ))}
    </ul>
  );
}

function Body(props: Props) {
  return (
    <>
      <Items lines={props.lines} />
      <div className="my-5 border-t" />
      <PriceSummary totals={props.totals} couponCode={props.couponCode} showCod={props.showCod} />
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Truck className="size-4 text-terracotta" aria-hidden />
        Estimated delivery by <span className="font-semibold text-foreground">{props.deliveryLabel}</span>
      </p>
    </>
  );
}

/** Sticky order summary on desktop; collapsible panel on mobile. */
export function CheckoutSummary({ variant, ...props }: Props & { variant: "mobile" | "desktop" }) {
  const [open, setOpen] = useState(false);
  if (variant === "mobile") {
    return (
      <div className="rounded-xl border bg-card">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="checkout-summary-mobile"
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          <ShoppingBag className="size-4 text-terracotta" aria-hidden />
          <span className="flex-1 text-sm font-medium">
            {open ? "Hide" : "Show"} order summary{" "}
            <span className="text-muted-foreground">({props.totals.itemCount})</span>
          </span>
          <span className="text-sm font-semibold tabular-nums">{formatINR(props.totals.total)}</span>
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
        <div id="checkout-summary-mobile" hidden={!open} className="border-t px-4 py-4">
          <Body {...props} />
        </div>
      </div>
    );
  }
  return (
      <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border bg-card p-6 shadow-soft">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Order summary</h2>
            <Link href="/cart" className="text-xs font-medium text-terracotta underline-offset-4 hover:underline">
              Edit bag
            </Link>
          </div>
          <Body {...props} />
        </div>
        <div className="mt-5 rounded-xl border border-dashed p-4">
          <TrustNotes compact />
        </div>
      </aside>
  );
}
