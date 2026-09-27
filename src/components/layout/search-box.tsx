"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { formatINR } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

type Suggestion = {
  id: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string | null;
  categoryName: string;
  group: "GIFTS" | "COSMETICS";
};

const POPULAR = ["Diwali hamper", "Vitamin C serum", "Kumkumadi", "Lipstick", "Personalised", "Candle"];

/** Search input with debounced autocomplete and keyboard navigation. */
export function SearchBox({ className, autoFocus, onNavigate }: { className?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const listId = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { items: Suggestion[] };
        setItems(data.items);
        setActive(-1);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (active >= 0 && items[active]) return go(`/product/${items[active].slug}`);
    if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const showPanel = open && (q.trim().length < 2 || items.length > 0 || !loading);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <form role="search" onSubmit={submit}>
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id={`${listId}-input`}
            type="search"
            value={q}
            autoFocus={autoFocus}
            autoComplete="off"
            placeholder="Search hampers, serums, lipsticks…"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(items.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(-1, a - 1));
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            className="h-11 w-full rounded-full border border-input bg-card pr-10 pl-10 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {loading ? (
            <Loader2 className="absolute top-1/2 right-3.5 size-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />
          ) : q ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQ("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </form>

      {showPanel ? (
        <div
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-popover shadow-lift"
        >
          {q.trim().length < 2 ? (
            <div className="p-4">
              <p className="mb-2.5 text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => go(`/search?q=${encodeURIComponent(term)}`)}
                    className="rounded-full border bg-card px-3 py-1.5 text-xs hover:border-foreground/30"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : items.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No matches for “{q.trim()}”. Try “hamper” or “serum”.</p>
          ) : (
            <>
              <ul className="max-h-96 overflow-y-auto py-1.5">
                {items.map((item, i) => (
                  <li key={item.id} id={`${listId}-${i}`} role="option" aria-selected={active === i}>
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className={cn("flex items-center gap-3 px-3 py-2 hover:bg-muted", active === i && "bg-muted")}
                    >
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
                        <ProductImage src={item.image} alt="" group={item.group} sizes="44px" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{item.name}</span>
                        <span className="block text-xs text-muted-foreground">{item.categoryName}</span>
                      </span>
                      <span className="text-sm font-medium tabular-nums">{formatINR(item.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
                className="block w-full border-t px-4 py-3 text-left text-sm font-medium hover:bg-muted"
              >
                See all results for “{q.trim()}”
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
