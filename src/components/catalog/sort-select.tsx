"use client";

import { useId, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildHref, setParam, type ListingQuery } from "./listing-params";

type Props = {
  basePath: string;
  query: ListingQuery;
  options: readonly { value: string; label: string }[];
  className?: string;
};

export function SortSelect({ basePath, query, options, className }: Props) {
  const id = useId();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={id} className="hidden text-sm text-muted-foreground sm:inline">
        Sort by
      </label>
      <div className="relative">
        <select
          id={id}
          value={query.sort ?? "featured"}
          aria-busy={pending}
          onChange={(e) =>
            startTransition(() => router.push(buildHref(basePath, setParam(query, "sort", e.target.value)), { scroll: false }))
          }
          className="h-9 appearance-none rounded-lg border border-input bg-card py-1 pr-9 pl-3 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      </div>
    </div>
  );
}
