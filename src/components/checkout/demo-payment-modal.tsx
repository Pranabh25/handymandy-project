"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, CreditCard, Landmark, Lock, Smartphone, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { confirmPayment } from "@/server/actions/checkout";
import type { PrepaidMethod } from "./payment-options";
import { CardPanel, NetbankingPanel, UpiPanel, WalletPanel, emptyDetails, validateDetails, type PayDetails } from "./demo-payment-panels";

export type PayableOrder = { orderId: string; orderNumber: string; total: number };

type Props = {
  open: boolean;
  order: PayableOrder;
  initialMethod: PrepaidMethod;
  onSuccess: (orderNumber: string) => void;
  /** Called when the customer closes the modal without paying. */
  onDismiss: () => void;
};

type Phase = "details" | "processing" | "authorise" | "confirming" | "failed" | "done";

const TABS: { value: PrepaidMethod; label: string; icon: typeof Smartphone }[] = [
  { value: "UPI", label: "UPI", icon: Smartphone },
  { value: "CARD", label: "Card", icon: CreditCard },
  { value: "NETBANKING", label: "Netbanking", icon: Landmark },
  { value: "WALLET", label: "Wallet", icon: Wallet },
];

const PROCESSING_MS = 1500;

/**
 * DEMO payment gateway modal, styled after hosted Indian checkouts.
 * Nothing entered here leaves the browser: only the chosen method and the
 * simulated outcome are sent to the server.
 */
export function DemoPaymentModal({ open, order, initialMethod, onSuccess, onDismiss }: Props) {
  const [method, setMethod] = useState<PrepaidMethod>(initialMethod);
  const [details, setDetails] = useState<PayDetails>(emptyDetails);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("details");
  const [failure, setFailure] = useState<string | null>(null);
  const [, start] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const busy = phase === "processing" || phase === "confirming" || phase === "done";

  function pay() {
    const problem = validateDetails(method, details);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setPhase("processing");
    timer.current = setTimeout(() => setPhase("authorise"), PROCESSING_MS);
  }

  function resolve(success: boolean) {
    setPhase("confirming");
    start(async () => {
      const res = await confirmPayment({ orderId: order.orderId, success, method });
      if (!res.ok) {
        setFailure(res.error);
        setPhase("failed");
        toast.error("Payment could not be completed", { description: res.error });
        return;
      }
      if (res.data.paid) {
        setPhase("done");
        toast.success("Payment successful", { description: `${formatINR(order.total)} paid for order ${order.orderNumber}` });
        onSuccess(res.data.orderNumber);
        return;
      }
      setFailure("Your bank declined this payment (simulated). No money has been deducted.");
      setPhase("failed");
      toast.error("Payment failed", { description: "You can retry now or later from My Orders." });
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onDismiss();
      }}
    >
      <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:max-w-md">
        {/* Header */}
        <div className="relative overflow-hidden bg-charcoal px-5 pt-5 pb-4 text-ivory">
          <span
            aria-hidden
            className="absolute top-3 -left-9 w-32 -rotate-45 bg-gold py-0.5 text-center text-[0.6rem] font-bold tracking-[0.14em] text-charcoal uppercase"
          >
            Test mode
          </span>
          <div className="flex items-start justify-between gap-3 pl-8">
            <div>
              <DialogTitle className="font-display text-xl font-semibold text-ivory">LushAura</DialogTitle>
              <DialogDescription className="mt-1 text-xs text-ivory/70">Order {order.orderNumber}</DialogDescription>
            </div>
            <div className="text-right">
              <p className="text-[0.65rem] tracking-[0.14em] text-ivory/60 uppercase">Amount</p>
              <p className="text-xl font-semibold tabular-nums">{formatINR(order.total)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => !busy && onDismiss()}
            disabled={busy}
            className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-md text-ivory/70 hover:bg-white/10 hover:text-ivory disabled:opacity-40"
            aria-label="Close payment window"
          >
            <X className="size-4" aria-hidden />
          </button>
          <p className="sr-only">Test mode: this is a demo payment. No real money will be charged.</p>
        </div>

        <div className="min-h-80 px-5 py-5">
          {phase === "details" ? (
            <>
              <div role="tablist" aria-label="Payment method" className="grid grid-cols-4 gap-1.5 rounded-lg bg-muted p-1">
                {TABS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={method === value}
                    onClick={() => {
                      setMethod(value);
                      setError(null);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[0.7rem] font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      method === value ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </button>
                ))}
              </div>

              <div role="tabpanel" className="mt-5">
                {method === "UPI" ? <UpiPanel details={details} onChange={setDetails} invalid={!!error} /> : null}
                {method === "CARD" ? <CardPanel details={details} onChange={setDetails} invalid={!!error} /> : null}
                {method === "NETBANKING" ? <NetbankingPanel details={details} onChange={setDetails} /> : null}
                {method === "WALLET" ? <WalletPanel details={details} onChange={setDetails} /> : null}
              </div>

              {error ? (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button type="button" size="lg" className="mt-5 w-full" onClick={pay}>
                <Lock className="size-4" aria-hidden />
                Pay {formatINR(order.total)}
              </Button>
            </>
          ) : null}

          {phase === "processing" || phase === "confirming" || phase === "done" ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center" role="status" aria-live="polite">
              {phase === "done" ? (
                <CircleCheck className="size-12 text-sage" strokeWidth={1.5} aria-hidden />
              ) : (
                <span className="size-10 animate-spin rounded-full border-2 border-muted border-t-terracotta" aria-hidden />
              )}
              <p className="mt-5 font-semibold">
                {phase === "processing" ? "Processing your payment…" : phase === "confirming" ? "Confirming with your bank…" : "Payment successful"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {phase === "done" ? "Taking you to your order confirmation…" : "Please don't close this window or press back."}
              </p>
            </div>
          ) : null}

          {phase === "authorise" ? (
            <div className="flex min-h-72 flex-col justify-center" role="status" aria-live="polite">
              <p className="eyebrow text-center">Demo bank page</p>
              <p className="mt-2 text-center text-lg font-semibold">Authorise {formatINR(order.total)}?</p>
              <p className="mx-auto mt-2 max-w-xs text-center text-sm text-muted-foreground">
                In a live store this is where your UPI app or bank asks you to approve. Choose an outcome to continue the demo.
              </p>
              <div className="mt-6 grid gap-2.5">
                <Button type="button" size="lg" className="w-full bg-sage text-white hover:bg-sage/90" onClick={() => resolve(true)}>
                  <CircleCheck className="size-4" aria-hidden />
                  Simulate success
                </Button>
                <Button type="button" size="lg" variant="outline" className="w-full text-destructive hover:text-destructive" onClick={() => resolve(false)}>
                  <CircleAlert className="size-4" aria-hidden />
                  Simulate failure
                </Button>
              </div>
            </div>
          ) : null}

          {phase === "failed" ? (
            <div className="flex min-h-72 flex-col justify-center text-center" role="alert">
              <CircleAlert className="mx-auto size-11 text-destructive" strokeWidth={1.5} aria-hidden />
              <p className="mt-4 text-lg font-semibold">Payment failed</p>
              <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground">{failure}</p>
              <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
                Your order {order.orderNumber} is saved and awaiting payment.
              </p>
              <div className="mt-6 grid gap-2.5">
                <Button type="button" size="lg" onClick={() => setPhase("details")}>
                  Retry payment
                </Button>
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  View order in My Orders
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t bg-muted/50 px-5 py-3 text-[0.7rem] text-muted-foreground">
          <Lock className="size-3" aria-hidden />
          Demo payment gateway · no real money is charged and no card details are stored
        </div>
      </DialogContent>
    </Dialog>
  );
}
