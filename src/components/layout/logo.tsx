import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-baseline gap-0.5 leading-none", className)} aria-label="LushAura home">
      <span className="font-display text-[1.65rem] font-semibold tracking-tight text-charcoal">Lush</span>
      <span className="font-display text-[1.65rem] font-medium tracking-tight text-terracotta italic">Aura</span>
    </Link>
  );
}
