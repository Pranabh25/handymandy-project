"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Zap } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Button } from "@/components/ui/button";
import { cartActions, useCartState, MAX_QTY_PER_LINE } from "@/hooks/use-cart";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types";

type Props = { product: ProductSummary };

function QuantitySelector({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  const btn =
    "inline-flex size-11 items-center justify-center text-charcoal transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";
  return (
    <div className="inline-flex h-12 items-center overflow-hidden rounded-lg border border-input bg-card" role="group" aria-label="Quantity">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <output className="w-9 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}

/** Quantity, Add to bag, Buy now, Wishlist + a sticky mobile bar once the main buttons scroll away. */
export function PurchasePanel({ product }: Props) {
  const router = useRouter();
  const { lines } = useCartState();
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const outOfStock = product.stock <= 0;
  const max = Math.max(1, Math.min(MAX_QTY_PER_LINE, product.stock));

  useEffect(() => {
    const el = anchor.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function buyNow() {
    const existing = lines.find((l) => l.productId === product.id);
    if (existing) cartActions.setQuantity(product.id, Math.max(existing.quantity, qty));
    else cartActions.add(product, qty);
    router.push("/checkout");
  }

  return (
    <>
      <div ref={anchor} className="space-y-3">
        {!outOfStock ? (
          <div className="flex items-center gap-3">
            <QuantitySelector value={qty} max={max} onChange={(n) => setQty(Math.max(1, Math.min(max, n)))} />
            <AddToCartButton product={product} quantity={qty} size="lg" className="flex-1" />
          </div>
        ) : (
          <AddToCartButton product={product} size="lg" />
        )}
        <div className="flex gap-3">
          <Button type="button" variant="accent" size="lg" className="flex-1" disabled={outOfStock} onClick={buyNow}>
            <Zap className="size-4" aria-hidden />
            Buy now
          </Button>
          <WishlistButton product={product} withLabel className="shrink-0 rounded-lg" />
        </div>
      </div>

      <div
        aria-hidden={!showSticky}
        inert={!showSticky}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 py-3 shadow-lift backdrop-blur-sm transition-transform duration-300 md:hidden",
          showSticky ? "translate-y-0" : "translate-y-full",
        )}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{product.name}</p>
            <p className="text-base font-semibold tabular-nums">{formatINR(product.price)}</p>
          </div>
          <AddToCartButton product={product} quantity={qty} className="w-auto flex-1" />
        </div>
      </div>
    </>
  );
}
