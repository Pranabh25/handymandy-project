"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CANCELLATION_REASONS } from "@/config/site";
import { requestCancellationAction } from "@/server/actions/account";

export function CancelOrderDialog({ orderNumber, unpaid }: { orderNumber: string; unpaid: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit() {
    if (!reason) return setError("Please choose a reason");
    setError(null);
    start(async () => {
      const res = await requestCancellationAction({ orderNumber, reason, comment });
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      setOpen(false);
      if (res.data.autoCancelled) {
        toast.success("Your order has been cancelled", { description: "No payment was taken for this order." });
      } else {
        toast.success("Cancellation request submitted", {
          description: "We'll confirm within 24 hours. Any payment will be refunded to the original method.",
        });
      }
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="w-full sm:w-auto" />}>Cancel order</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Cancel order {orderNumber}?</DialogTitle>
          <DialogDescription>
            {unpaid
              ? "This order hasn't been paid for, so it will be cancelled right away."
              : "We'll review your request and confirm within 24 hours. Paid amounts are refunded in 5–7 working days."}
          </DialogDescription>
        </DialogHeader>
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-medium">Reason for cancelling</legend>
          <RadioGroup value={reason} onValueChange={(v) => setReason(String(v))} aria-label="Reason for cancelling">
            {CANCELLATION_REASONS.map((r) => (
              <Label
                key={r}
                className="cursor-pointer gap-3 rounded-lg border px-3 py-2.5 font-normal transition-colors has-data-checked:border-charcoal has-data-checked:bg-muted"
              >
                <RadioGroupItem value={r} />
                {r}
              </Label>
            ))}
          </RadioGroup>
        </fieldset>
        <div className="space-y-1.5">
          <Label htmlFor="cancel-comment">Anything else we should know? (optional)</Label>
          <Textarea
            id="cancel-comment"
            rows={3}
            maxLength={500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g. I'd like to reorder with a different gift message"
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Keep order
          </Button>
          <Button variant="accent" onClick={submit} disabled={pending}>
            {pending ? "Submitting…" : unpaid ? "Cancel order" : "Request cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
