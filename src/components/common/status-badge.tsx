import type { Tone } from "@/lib/order-status";
import { cn } from "@/lib/utils";

const TONES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground ring-border",
  info: "bg-[#e8eef3] text-[#3c5a73] ring-[#d3dee8]",
  success: "bg-sage-soft text-sage ring-[#d2ddce]",
  warning: "bg-[#f7ecd8] text-[#8a6420] ring-[#ecdcbc]",
  danger: "bg-[#f6e1de] text-destructive ring-[#ecc9c4]",
  accent: "bg-terracotta-soft text-accent-foreground ring-[#ebcfc0]",
};

export function StatusBadge({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
