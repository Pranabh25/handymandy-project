"use client";

import { useState, useTransition } from "react";
import { Loader2, RotateCcw, Zap, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DemoNotice } from "@/components/common/demo-notice";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { processRefundAction } from "@/server/actions/admin-orders";

type Props = {
  refundId: string;
  orderNumber: string;
  amount: number;
  methodLabel: string;
  /** Show "Retry" wording for a refund that previously failed. */
  retry?: boolean;
};

const SPEEDS = [
  { value: "normal", label: "Normal", hint: "5–7 working days · no extra charge", icon: Clock },
  { value: "instant", label: "Instant", hint: "Within minutes for UPI & cards", icon: Zap },
] as const;

export function ProcessRefundDialog({ refundId, orderNumber, amount, methodLabel, retry }: Props) {
  const [open, setOpen] = useState(false);
  const [speed, setSpeed] = useState<string>("normal");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const res = await processRefundAction(refundId, true);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(`${formatINR(amount)} refunded for ${orderNumber}`);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <RotateCcw aria-hidden /> {retry ? "Retry refund" : "Process refund"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans text-base font-semibold">Refund {orderNumber}</DialogTitle>
          <DialogDescription>The amount is returned to the customer&apos;s original payment method.</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-2 gap-3 rounded-lg bg-muted/60 p-3.5 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Refund amount</dt>
            <dd className="text-lg font-semibold tabular-nums">{formatINR(amount)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Original method</dt>
            <dd className="font-medium">{methodLabel}</dd>
          </div>
        </dl>
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium">Refund speed</legend>
          <RadioGroup value={speed} onValueChange={(v) => setSpeed(String(v))} className="gap-2">
            {SPEEDS.map((s) => (
              <label
                key={s.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                  speed === s.value ? "border-charcoal bg-muted/40" : "hover:bg-muted/40",
                )}
              >
                <RadioGroupItem value={s.value} className="mt-0.5" />
                <span className="flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <s.icon className="size-3.5" aria-hidden /> {s.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.hint}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>
        <DemoNotice>Razorpay test mode — no real money moves. A demo refund reference is generated.</DemoNotice>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={pending} />}>Cancel</DialogClose>
          <Button onClick={submit} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Refund {formatINR(amount)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MarkRefundFailedButton({ refundId, orderNumber }: { refundId: string; orderNumber: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const res = await processRefundAction(refundId, false);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(`Refund for ${orderNumber} marked as failed`);
      setOpen(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" />}>
        Mark failed
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-sans font-semibold">Mark refund as failed?</AlertDialogTitle>
          <AlertDialogDescription>
            Use this when the gateway rejected the refund for {orderNumber}. It moves to the Failed tab, where you can retry it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Go back</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={submit} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Mark failed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
