import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Params = Record<string, string | undefined>;

/** Builds `/path?a=1&b=2`, dropping empty values. `page` resets unless explicitly passed. */
export function hrefWith(base: string, params: Params, overrides: Params = {}) {
  const merged: Params = { ...params, page: undefined, ...overrides };
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

export type FilterTab = { label: string; href: string; active: boolean; count?: number };

/** URL-driven tab strip. Scrolls horizontally inside itself on small screens. */
export function FilterTabs({ tabs, label }: { tabs: FilterTab[]; label: string }) {
  return (
    <nav aria-label={label} className="-mx-1 overflow-x-auto px-1 pb-1">
      <ul className="flex w-max gap-1 rounded-lg bg-muted p-1">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              scroll={false}
              aria-current={t.active ? "page" : undefined}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                t.active ? "bg-background text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground",
              )}
            >
              {t.label}
              {t.count != null ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[0.7rem] leading-4.5 tabular-nums",
                    t.active ? "bg-charcoal text-ivory" : "bg-background/70 text-muted-foreground",
                  )}
                >
                  {t.count}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  hrefFor: (page: number) => string;
}) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const btn = buttonVariants({ variant: "outline", size: "sm" });
  return (
    <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground sm:px-5">
      <p className="tabular-nums">
        Showing {from}–{to} of {total}
      </p>
      {pageCount > 1 ? (
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} className={btn} aria-label="Previous page">
              <ChevronLeft aria-hidden /> <span className="hidden sm:inline">Previous</span>
            </Link>
          ) : null}
          <span className="tabular-nums">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={hrefFor(page + 1)} className={btn} aria-label="Next page">
              <span className="hidden sm:inline">Next</span> <ChevronRight aria-hidden />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Native select styled to match `Input` (compact admin size). */
export function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

/** Small label/value stat tile used on refunds and payments pages. */
export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3.5 shadow-soft">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
