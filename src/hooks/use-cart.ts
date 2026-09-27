"use client";

import { useSyncExternalStore } from "react";
import type { CartLine, ProductSummary } from "@/types";

/**
 * Client cart + wishlist store backed by localStorage.
 * Guests can shop before logging in; checkout re-validates every line against
 * the database, so the stored prices are display-only.
 */

export const MAX_QTY_PER_LINE = 10;
const STORAGE_KEY = "lushaura:cart:v1";

export type CartState = {
  lines: CartLine[];
  wishlist: ProductSummary[];
  couponCode: string | null;
  giftWrap: boolean;
  giftMessage: string;
};

const EMPTY: CartState = { lines: [], wishlist: [], couponCode: null, giftWrap: false, giftMessage: "" };

let state: CartState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as Partial<CartState>) };
  } catch {
    state = EMPTY;
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) — keep in memory only */
  }
}

function setState(updater: (s: CartState) => CartState) {
  load();
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      hydrated = false;
      load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

// ─── Actions ───────────────────────────────────────────────────────────────

export function productToLine(p: ProductSummary, quantity = 1): CartLine {
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    price: p.price,
    mrp: p.mrp,
    image: p.image,
    stock: p.stock,
    size: p.size,
    quantity,
  };
}

export const cartActions = {
  add(product: ProductSummary, quantity = 1) {
    setState((s) => {
      const existing = s.lines.find((l) => l.productId === product.id);
      const cap = Math.min(MAX_QTY_PER_LINE, product.stock);
      if (existing) {
        return {
          ...s,
          lines: s.lines.map((l) =>
            l.productId === product.id ? { ...l, ...productToLine(product), quantity: Math.min(cap, l.quantity + quantity) } : l,
          ),
        };
      }
      return { ...s, lines: [...s.lines, productToLine(product, Math.min(cap, quantity))] };
    });
  },
  setQuantity(productId: string, quantity: number) {
    setState((s) => ({
      ...s,
      lines: s.lines
        .map((l) => (l.productId === productId ? { ...l, quantity: Math.max(0, Math.min(quantity, MAX_QTY_PER_LINE, l.stock)) } : l))
        .filter((l) => l.quantity > 0),
    }));
  },
  remove(productId: string) {
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.productId !== productId) }));
  },
  /** Replace lines with server-validated data (prices/stock refreshed). */
  replaceLines(lines: CartLine[]) {
    setState((s) => ({ ...s, lines }));
  },
  clear() {
    setState((s) => ({ ...s, lines: [], couponCode: null, giftWrap: false, giftMessage: "" }));
  },
  setCoupon(code: string | null) {
    setState((s) => ({ ...s, couponCode: code }));
  },
  setGiftWrap(giftWrap: boolean) {
    setState((s) => ({ ...s, giftWrap }));
  },
  setGiftMessage(giftMessage: string) {
    setState((s) => ({ ...s, giftMessage: giftMessage.slice(0, 200) }));
  },
  toggleWishlist(product: ProductSummary) {
    let added = false;
    setState((s) => {
      const exists = s.wishlist.some((w) => w.id === product.id);
      added = !exists;
      return { ...s, wishlist: exists ? s.wishlist.filter((w) => w.id !== product.id) : [product, ...s.wishlist] };
    });
    return added;
  },
  removeFromWishlist(productId: string) {
    setState((s) => ({ ...s, wishlist: s.wishlist.filter((w) => w.id !== productId) }));
  },
};

// ─── Hooks ─────────────────────────────────────────────────────────────────

/** Full cart state. Returns an empty cart during SSR/first paint. */
export function useCartState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True once the browser store has been read (avoid flashing empty states). */
export function useCartHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useCartCount() {
  const s = useCartState();
  return s.lines.reduce((n, l) => n + l.quantity, 0);
}

export function useIsWishlisted(productId: string) {
  const s = useCartState();
  return s.wishlist.some((w) => w.id === productId);
}
