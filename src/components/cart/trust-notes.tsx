import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const NOTES = [
  { icon: Lock, title: "Secure checkout", text: "Encrypted payments via UPI, cards & net banking" },
  { icon: ShieldCheck, title: "100% authentic", text: "Made in small batches, sealed and quality-checked" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day returns on unopened products" },
  { icon: Truck, title: "Pan-India delivery", text: "Dispatched in 24–48 hours from Bengaluru" },
] as const;

export function TrustNotes({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <ul className={cn("grid gap-3", compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-1", className)}>
      {NOTES.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-2.5">
          <Icon className="mt-0.5 size-4 shrink-0 text-terracotta" strokeWidth={1.75} aria-hidden />
          <div>
            <p className="text-xs font-semibold">{title}</p>
            {!compact ? <p className="mt-0.5 text-[0.7rem] leading-4 text-muted-foreground">{text}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
