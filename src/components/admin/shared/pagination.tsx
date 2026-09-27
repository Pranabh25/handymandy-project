import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { SearchParams } from "@/server/admin/params";
import { cn } from "@/lib/utils";

function hrefFor(basePath: string, sp: SearchParams, page: number) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const val = Array.isArray(v) ? v[0] : v;
    if (val && k !== "page") q.set(k, val);
  }
  if (page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `${basePath}?${s}` : basePath;
}

/** "Showing 21–40 of 86" with previous/next links that keep the current filters. */
export function AdminPagination({ basePath, searchParams, page, pageCount, total, pageSize }: {
  basePath: string;
  searchParams: SearchParams;
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
}) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const btn = cn(buttonVariants({ variant: "outline", size: "sm" }));
  const disabled = "pointer-events-none opacity-40";
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground">
      <p>
        Showing <span className="font-medium text-foreground tabular-nums">{from}–{to}</span> of <span className="tabular-nums">{total}</span>
      </p>
      {pageCount > 1 ? (
        <div className="flex items-center gap-2">
          <Link href={hrefFor(basePath, searchParams, page - 1)} className={cn(btn, page <= 1 && disabled)} aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined}>
            <ChevronLeft aria-hidden /> <span className="sr-only sm:not-sr-only">Previous</span>
          </Link>
          <span className="tabular-nums">
            {page} / {pageCount}
          </span>
          <Link href={hrefFor(basePath, searchParams, page + 1)} className={cn(btn, page >= pageCount && disabled)} aria-disabled={page >= pageCount} tabIndex={page >= pageCount ? -1 : undefined}>
            <span className="sr-only sm:not-sr-only">Next</span> <ChevronRight aria-hidden />
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
