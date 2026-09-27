import Link from "next/link";
import { cn } from "@/lib/utils";

/** Tab-style filter links (server rendered, URL driven). */
export function SegmentedLinks({ items, label }: { items: { href: string; label: string; count?: number; active: boolean }[]; label: string }) {
  return (
    <nav aria-label={label} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          aria-current={it.active ? "page" : undefined}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-sm transition-colors",
            it.active ? "border-charcoal bg-charcoal text-ivory" : "bg-background text-charcoal/75 hover:bg-muted hover:text-charcoal",
          )}
        >
          {it.label}
          {it.count != null ? (
            <span className={cn("rounded-full px-1.5 text-[0.7rem] font-semibold tabular-nums", it.active ? "bg-ivory/20" : "bg-muted text-muted-foreground")}>
              {it.count}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
