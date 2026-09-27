import { ProductGridSkeleton } from "@/components/product/product-card";

/** Loading state for listing routes (header band + sidebar + grid). */
export function ListingSkeleton({ withHeader = true }: { withHeader?: boolean }) {
  return (
    <div role="status" aria-label="Loading products">
      {withHeader ? (
        <div className="border-b bg-sand/40">
          <div className="container-page py-6 md:py-10">
            <div className="h-3 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-8 h-12 w-2/3 max-w-md animate-pulse rounded-lg bg-muted" />
            <div className="mt-4 h-4 w-full max-w-lg animate-pulse rounded bg-muted" />
            <div className="mt-7 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-muted" />
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] xl:gap-14">
        <div className="hidden space-y-6 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-40 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-36 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        <div>
          <div className="mb-8 flex justify-between border-b pb-4">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
          </div>
          <ProductGridSkeleton count={6} />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
