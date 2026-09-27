import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="container-page pt-8 pb-20 md:pt-12" aria-busy aria-label="Loading your bag">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-9 w-48" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="space-y-6">
          <Skeleton className="h-16 w-full rounded-xl" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="aspect-[4/5] w-24 rounded-lg sm:w-28" />
              <div className="flex-1 space-y-2.5 pt-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="mt-6 h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
