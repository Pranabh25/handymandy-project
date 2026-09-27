"use client";

import { useId, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PRICE_BUCKETS,
  buildHref,
  setParam,
  splitList,
  toggleListValue,
  type ListKey,
  type ListingQuery,
} from "./listing-params";

export type FacetConfig = {
  categories?: { slug: string; name: string; count: number }[];
  skinTypes?: string[];
  occasions?: string[];
  recipients?: string[];
};

type Props = {
  basePath: string;
  query: ListingQuery;
  facets: FacetConfig;
  /** Called after navigating (e.g. to close the mobile sheet). */
  onNavigate?: () => void;
  className?: string;
};

const optionClass =
  "flex cursor-pointer items-center gap-3 rounded-md py-1.5 text-sm text-foreground/85 transition-colors hover:text-foreground";
const inputClass = "size-4 shrink-0 cursor-pointer accent-[var(--charcoal)] focus-visible:outline-2 focus-visible:outline-ring";

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group/facet border-b py-4 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-md text-sm font-semibold focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open/facet:rotate-180" aria-hidden />
      </summary>
      <fieldset className="mt-3 space-y-0.5">
        <legend className="sr-only">{title}</legend>
        {children}
      </fieldset>
    </details>
  );
}

export function FilterPanel({ basePath, query, facets, onNavigate, className }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const radioName = useId();

  function go(next: ListingQuery) {
    startTransition(() => {
      router.push(buildHref(basePath, next), { scroll: false });
    });
    onNavigate?.();
  }

  function listGroup(title: string, key: ListKey, values: string[] | undefined, labels?: Record<string, string>) {
    if (!values?.length) return null;
    const selected = splitList(query[key]);
    return (
      <Group title={title}>
        {values.map((v) => (
          <label key={v} className={optionClass}>
            <input type="checkbox" className={inputClass} checked={selected.includes(v)} onChange={() => go(toggleListValue(query, key, v))} />
            <span className="flex-1">{labels?.[v] ?? v}</span>
          </label>
        ))}
      </Group>
    );
  }

  const categoryLabels = Object.fromEntries((facets.categories ?? []).map((c) => [c.slug, c.name]));

  return (
    <div className={cn("transition-opacity", pending && "opacity-60", className)} aria-busy={pending}>
      {listGroup(
        "Category",
        "category",
        facets.categories?.map((c) => c.slug),
        categoryLabels,
      )}

      <Group title="Price">
        {PRICE_BUCKETS.map((b) => (
          <label key={b.value} className={optionClass}>
            <input
              type="radio"
              name={radioName}
              className={inputClass}
              checked={query.price === b.value}
              onChange={() => go(setParam(query, "price", b.value))}
            />
            <span className="flex-1">{b.label}</span>
          </label>
        ))}
        {query.price ? (
          <button
            type="button"
            onClick={() => go(setParam(query, "price", undefined))}
            className="mt-1 text-xs font-medium text-terracotta underline-offset-4 hover:underline"
          >
            Any price
          </button>
        ) : null}
      </Group>

      <Group title="Rating & availability">
        <label className={optionClass}>
          <input
            type="checkbox"
            className={inputClass}
            checked={query.rating === "4"}
            onChange={() => go(setParam(query, "rating", query.rating === "4" ? undefined : "4"))}
          />
          <span className="flex-1">4★ & above</span>
        </label>
        <label className={optionClass}>
          <input
            type="checkbox"
            className={inputClass}
            checked={query.stock === "1"}
            onChange={() => go(setParam(query, "stock", query.stock === "1" ? undefined : "1"))}
          />
          <span className="flex-1">In stock only</span>
        </label>
      </Group>

      {listGroup("Skin type", "skin", facets.skinTypes)}
      {listGroup("Occasion", "occasion", facets.occasions)}
      {listGroup("Gift for", "recipient", facets.recipients)}
    </div>
  );
}
