import { Check, CircleDot, MapPin, XCircle } from "lucide-react";
import type { OrderStatus } from "@/generated/prisma/enums";
import { FULFILMENT_STEPS, ORDER_STATUS_META } from "@/lib/order-status";
import { formatDateTime, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type TimelineEvent = {
  id: string;
  status: OrderStatus | null;
  title: string;
  note: string | null;
  location: string | null;
  createdAt: Date;
};

const STEP_LABEL: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: "Confirmed",
  PACKED: "Gift-packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
};

/** Visual fulfilment stepper: vertical on mobile, horizontal from md. */
export function OrderStepper({
  status,
  events,
  estimatedDelivery,
}: {
  status: OrderStatus;
  events: TimelineEvent[];
  estimatedDelivery?: Date | null;
}) {
  const reachedAt = (step: OrderStatus) => events.find((e) => e.status === step)?.createdAt;
  const cancelled = status === "CANCELLED";
  const currentIndex = FULFILMENT_STEPS.indexOf(status);
  // For cancelled orders show only the steps that were actually reached.
  const lastReached = cancelled
    ? FULFILMENT_STEPS.reduce((acc, s, i) => (reachedAt(s) ? i : acc), -1)
    : currentIndex;
  const cancelledAt = cancelled ? events.find((e) => e.status === "CANCELLED")?.createdAt : undefined;

  if (status === "PENDING_PAYMENT") {
    return (
      <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
        Tracking begins once your payment is confirmed.
      </p>
    );
  }

  const steps = cancelled ? FULFILMENT_STEPS.slice(0, Math.max(lastReached + 1, 0)) : FULFILMENT_STEPS;

  return (
    <div>
      <ol className="relative flex flex-col gap-0 md:flex-row md:items-start">
        {steps.map((step, i) => {
          const done = i <= lastReached;
          const isCurrent = !cancelled && i === currentIndex && step !== "DELIVERED";
          const at = reachedAt(step);
          const isLast = i === steps.length - 1 && !cancelled;
          return (
            <li key={step} className="relative flex gap-3 pb-6 md:flex-1 md:flex-col md:items-center md:gap-2 md:pb-0 md:text-center">
              {!isLast ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-8 left-[15px] h-[calc(100%-2rem)] w-px md:top-[15px] md:left-[calc(50%+16px)] md:h-px md:w-[calc(100%-32px)]",
                    i < lastReached || (cancelled && i === lastReached) ? "bg-sage" : "bg-border",
                    cancelled && i === lastReached && "bg-destructive/40",
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                  done ? "bg-sage text-white" : "border border-border bg-card text-muted-foreground",
                  isCurrent && "bg-terracotta",
                )}
              >
                {done && !isCurrent ? <Check className="size-4" aria-hidden /> : <CircleDot className="size-4" aria-hidden />}
              </span>
              <div className="pt-1 md:pt-0">
                <p className={cn("text-sm font-medium", !done && "text-muted-foreground")}>
                  {STEP_LABEL[step] ?? ORDER_STATUS_META[step].label}
                  <span className="sr-only">{done ? " — completed" : " — upcoming"}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {at
                    ? formatDateTime(at)
                    : step === "DELIVERED" && estimatedDelivery && !cancelled
                      ? `Expected ${formatShortDate(estimatedDelivery)}`
                      : " "}
                </p>
              </div>
            </li>
          );
        })}
        {cancelled ? (
          <li className="relative flex gap-3 md:flex-1 md:flex-col md:items-center md:gap-2 md:text-center">
            <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive text-white ring-4 ring-card">
              <XCircle className="size-4" aria-hidden />
            </span>
            <div className="pt-1 md:pt-0">
              <p className="text-sm font-medium text-destructive">Cancelled</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{cancelledAt ? formatDateTime(cancelledAt) : " "}</p>
            </div>
          </li>
        ) : null}
      </ol>
    </div>
  );
}

/** Full event log, newest first. */
export function OrderEventList({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  if (!sorted.length) return <p className="text-sm text-muted-foreground">No updates yet.</p>;
  return (
    <ol className="space-y-0">
      {sorted.map((e, i) => (
        <li key={e.id} className="relative flex gap-4 pb-5 last:pb-0">
          {i < sorted.length - 1 ? <span aria-hidden className="absolute top-3 left-[5px] h-full w-px bg-border" /> : null}
          <span
            aria-hidden
            className={cn("relative mt-1.5 size-[11px] shrink-0 rounded-full border-2", i === 0 ? "border-terracotta bg-terracotta" : "border-border bg-card")}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <p className={cn("text-sm", i === 0 ? "font-medium" : "text-foreground/85")}>{e.title}</p>
              <time dateTime={e.createdAt.toISOString()} className="shrink-0 text-xs text-muted-foreground">
                {formatDateTime(e.createdAt)}
              </time>
            </div>
            {e.note ? <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{e.note}</p> : null}
            {e.location ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" aria-hidden />
                {e.location}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Courier, AWB and delivery estimate. */
export function ShipmentDetails({
  courier,
  trackingNumber,
  estimatedDelivery,
  status,
}: {
  courier: string | null;
  trackingNumber: string | null;
  estimatedDelivery: Date | null;
  status: OrderStatus;
}) {
  const rows = [
    { label: "Courier", value: courier ?? "Assigned when shipped" },
    { label: "AWB / Tracking no.", value: trackingNumber ?? "—", mono: !!trackingNumber },
    {
      label: status === "DELIVERED" ? "Delivered" : "Estimated delivery",
      value:
        status === "CANCELLED"
          ? "—"
          : status === "DELIVERED"
            ? "Completed"
            : estimatedDelivery
              ? formatShortDate(estimatedDelivery)
              : "To be confirmed",
    },
  ];
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {rows.map((r) => (
        <div key={r.label}>
          <dt className="text-xs text-muted-foreground">{r.label}</dt>
          <dd className={cn("mt-0.5 text-sm font-medium", r.mono && "font-mono tracking-wide")}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
