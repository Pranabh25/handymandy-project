import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your account…</span>
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Skeleton className="h-44 rounded-xl" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-1">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
