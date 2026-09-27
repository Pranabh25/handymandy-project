import { Skeleton } from "@/components/ui/skeleton";

/** Subtle skeleton shown while a storefront page streams in. */
export default function StoreLoading() {
  return (
    <div className="container-page py-10 md:py-14" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-3 w-40 bg-sand/70" />
      <Skeleton className="mt-6 h-10 w-3/4 max-w-lg bg-sand/70" />
      <Skeleton className="mt-3 h-4 w-2/3 max-w-md bg-sand/60" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={i >= 4 ? "hidden md:block" : undefined}>
            <Skeleton className="aspect-[4/5] w-full rounded-xl bg-sand/60" />
            <Skeleton className="mt-3 h-4 w-4/5 bg-sand/60" />
            <Skeleton className="mt-2 h-4 w-1/3 bg-sand/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
