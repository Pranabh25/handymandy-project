import type { Ref } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  index: number;
  title: string;
  status: "active" | "done" | "upcoming";
  summary?: React.ReactNode;
  onEdit?: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
  children?: React.ReactNode;
};

/** One collapsible checkout step. Completed steps collapse to a summary with a “Change” link. */
export function StepSection({ index, title, status, summary, onEdit, headingRef, children }: Props) {
  const headingId = `checkout-step-${index}`;
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "rounded-xl border bg-card transition-shadow",
        status === "active" ? "shadow-soft" : "",
        status === "upcoming" && "bg-card/60",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-semibold",
            status === "done" && "bg-sage text-white",
            status === "active" && "bg-charcoal text-ivory",
            status === "upcoming" && "bg-muted text-muted-foreground",
          )}
          aria-hidden
        >
          {status === "done" ? <Check className="size-3.5" /> : index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={headingId}
            ref={headingRef}
            tabIndex={-1}
            className={cn(
              "font-sans text-base font-semibold outline-none",
              status === "upcoming" && "text-muted-foreground",
            )}
          >
            {title}
          </h2>
          {status === "done" && summary ? <div className="mt-1 text-sm text-muted-foreground">{summary}</div> : null}
        </div>
        {status === "done" && onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-terracotta underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Change<span className="sr-only"> {title.toLowerCase()}</span>
          </button>
        ) : null}
      </div>
      {status === "active" ? <div className="border-t px-4 py-5 sm:px-6">{children}</div> : null}
    </section>
  );
}
