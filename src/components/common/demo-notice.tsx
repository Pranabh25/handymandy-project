import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** Clearly labels demo-only behaviour (OTP, payments, credentials). */
export function DemoNotice({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-dashed border-gold/50 bg-[#fbf5e9] px-3.5 py-2.5 text-xs leading-5 text-[#6b5323]",
        className,
      )}
      role="note"
    >
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <div>
        <span className="font-semibold">Demo mode · </span>
        {children}
      </div>
    </div>
  );
}
