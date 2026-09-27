export default function Loading() {
  return (
    <div className="container-page pt-5 pb-16 md:pt-8" role="status" aria-label="Loading product">
      <div className="h-3 w-56 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div className="aspect-[4/5] animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-5">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-4/5 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-36 animate-pulse rounded bg-muted" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-28 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
