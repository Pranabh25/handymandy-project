"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterPanel, type FacetConfig } from "./filter-panel";
import { buildHref, clearedQuery, type ListingQuery } from "./listing-params";

type Props = { basePath: string; query: ListingQuery; facets: FacetConfig; total: number; activeCount: number };

/** Filter drawer for phones and tablets. Results update live behind the sheet. */
export function MobileFilters({ basePath, query, facets, total, activeCount }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" className="gap-2 lg:hidden" />}>
        <SlidersHorizontal className="size-4" aria-hidden />
        Filters
        {activeCount > 0 ? (
          <span className="ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-charcoal px-1.5 text-[0.65rem] leading-5 font-semibold text-ivory">
            {activeCount}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] max-w-sm gap-0 bg-background p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="font-display text-2xl font-semibold">Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5">
          <FilterPanel basePath={basePath} query={query} facets={facets} />
        </div>
        <SheetFooter className="flex-row gap-2 border-t px-5 py-4">
          {activeCount > 0 ? (
            <Link
              href={buildHref(basePath, clearedQuery(query))}
              scroll={false}
              className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
            >
              Clear all
            </Link>
          ) : null}
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Show {total.toLocaleString("en-IN")} {total === 1 ? "result" : "results"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
