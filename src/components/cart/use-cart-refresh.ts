"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cartActions, useCartHydrated, useCartState, MAX_QTY_PER_LINE } from "@/hooks/use-cart";
import { refreshCart } from "@/server/actions/cart";
import type { CartLine, ProductSummary } from "@/types";

/**
 * On mount, re-reads every bag item from the server and merges the current
 * price / MRP / stock into the local cart. Unavailable items are dropped and
 * quantities are clamped to stock, each with a toast.
 */
export function useCartRefresh() {
  const hydrated = useCartHydrated();
  const { lines } = useCartState();
  const [products, setProducts] = useState<Record<string, ProductSummary>>({});
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const latest = useRef<CartLine[]>(lines);

  useEffect(() => {
    latest.current = lines;
  }, [lines]);

  useEffect(() => {
    if (!hydrated || started.current) return;
    started.current = true;
    const snapshot = lines.map((l) => ({ productId: l.productId, quantity: l.quantity }));
    if (!snapshot.length) {
      queueMicrotask(() => setDone(true));
      return;
    }
    refreshCart(snapshot)
      .then((res) => {
        if (!res.ok) return;
        const byId = new Map(res.data.updates.map((u) => [u.productId, u]));
        const removed: string[] = [];
        const repriced: string[] = [];
        const reduced: string[] = [];
        const next: CartLine[] = [];
        for (const line of latest.current) {
          const u = byId.get(line.productId);
          if (!u) {
            next.push(line);
            continue;
          }
          if (!u.available || !u.product) {
            removed.push(line.name);
            continue;
          }
          const p = u.product;
          const cap = Math.min(MAX_QTY_PER_LINE, p.stock);
          const quantity = Math.min(line.quantity, cap);
          if (quantity < line.quantity) reduced.push(`${p.name} (only ${p.stock} left)`);
          if (p.price !== line.price) repriced.push(p.name);
          next.push({
            ...line,
            slug: p.slug,
            name: p.name,
            sku: p.sku,
            price: p.price,
            mrp: p.mrp,
            image: p.image,
            stock: p.stock,
            size: p.size,
            quantity,
          });
        }
        cartActions.replaceLines(next);
        setProducts(Object.fromEntries(res.data.updates.filter((u) => u.product).map((u) => [u.productId, u.product!])));
        if (removed.length) {
          toast.error(
            removed.length === 1 ? "An item is no longer available" : `${removed.length} items are no longer available`,
            { description: `Removed from your bag: ${removed.join(", ")}` },
          );
        }
        if (reduced.length) toast.info("Quantity updated to match stock", { description: reduced.join(", ") });
        if (repriced.length) toast.info("Some prices have been updated", { description: repriced.join(", ") });
      })
      .catch(() => {
        /* Offline or server hiccup — keep showing the stored bag; checkout re-validates. */
      })
      .finally(() => setDone(true));
  }, [hydrated, lines]);

  return { hydrated, refreshed: done, products };
}

/** Builds a ProductSummary for the wishlist from a cart line when fresh data isn't available. */
export function lineToSummary(line: CartLine, fresh?: ProductSummary): ProductSummary {
  if (fresh) return fresh;
  return {
    id: line.productId,
    slug: line.slug,
    name: line.name,
    sku: line.sku,
    price: line.price,
    mrp: line.mrp,
    stock: line.stock,
    rating: 0,
    reviewCount: 0,
    image: line.image,
    imageAlt: line.name,
    categoryName: "",
    categorySlug: "",
    group: "GIFTS",
    isBestseller: false,
    isNew: false,
    size: line.size,
  };
}
