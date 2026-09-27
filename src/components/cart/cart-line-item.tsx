"use client";

import Link from "next/link";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductImage } from "@/components/product/product-image";
import { Price } from "@/components/product/price";
import { cartActions, MAX_QTY_PER_LINE } from "@/hooks/use-cart";
import { formatINR } from "@/lib/format";
import type { CartLine, ProductSummary } from "@/types";
import { cn } from "@/lib/utils";
import { lineToSummary } from "./use-cart-refresh";

type Props = { line: CartLine; product?: ProductSummary; allLines: CartLine[] };

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
  className,
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={`Quantity for ${label}`}
      className={cn("inline-flex h-9 items-center rounded-lg border border-input bg-card", className)}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="flex size-9 items-center justify-center rounded-l-lg text-charcoal transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40"
      >
        <Minus className="size-3.5" aria-hidden />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex size-9 items-center justify-center rounded-r-lg text-charcoal transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40"
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}

export function CartLineItem({ line, product, allLines }: Props) {
  const router = useRouter();
  const max = Math.max(1, Math.min(MAX_QTY_PER_LINE, line.stock));
  const lowStock = line.stock > 0 && line.stock <= 5;
  const href = `/product/${line.slug}`;

  function remove() {
    const before = allLines;
    cartActions.remove(line.productId);
    toast("Removed from your bag", {
      description: line.name,
      action: { label: "Undo", onClick: () => cartActions.replaceLines(before) },
    });
  }

  function moveToWishlist() {
    const summary = lineToSummary(line, product);
    cartActions.remove(line.productId);
    cartActions.removeFromWishlist(line.productId);
    cartActions.toggleWishlist(summary);
    toast.success("Moved to your wishlist", {
      description: line.name,
      action: { label: "View", onClick: () => router.push("/wishlist") },
    });
  }

  return (
    <li className="flex gap-4 py-5 sm:gap-5">
      <Link
        href={href}
        className="relative block aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-lg bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-28"
        tabIndex={-1}
        aria-hidden
      >
        <ProductImage src={line.image} alt={line.name} group={product?.group} label={product?.categoryName} sizes="112px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product?.categoryName ? (
              <p className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">{product.categoryName}</p>
            ) : null}
            <h3 className="mt-0.5 font-sans text-sm leading-snug font-medium sm:text-[0.95rem]">
              <Link href={href} className="hover:underline hover:underline-offset-4">
                {line.name}
              </Link>
            </h3>
            {line.size ? <p className="mt-1 text-xs text-muted-foreground">Size: {line.size}</p> : null}
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums sm:text-base">{formatINR(line.price * line.quantity)}</p>
        </div>

        <Price price={line.price} mrp={line.mrp} size="sm" className="mt-1.5" />
        {lowStock ? <p className="mt-1 text-xs font-medium text-terracotta">Only {line.stock} left in stock</p> : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
          <QuantityStepper
            value={line.quantity}
            max={max}
            label={line.name}
            onChange={(q) => {
              if (q > max) {
                toast.info(
                  line.stock < MAX_QTY_PER_LINE ? `Only ${line.stock} available` : `You can add up to ${MAX_QTY_PER_LINE} of this item`,
                );
                return;
              }
              cartActions.setQuantity(line.productId, Math.max(1, q));
            }}
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={moveToWishlist}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Heart className="size-3.5" aria-hidden />
              <span>
                Move to wishlist<span className="sr-only">: {line.name}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={remove}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Trash2 className="size-3.5" aria-hidden />
              <span>
                Remove<span className="sr-only">: {line.name}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
