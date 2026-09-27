"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatINR } from "@/lib/format";
import { resolveCancellationAction } from "@/server/actions/admin-orders";

type Props = {
  requestId: string;
  orderNumber: string;
  mode: "approve" | "reject";
  /** True when money was captured, so approving queues a refund. */
  paid: boolean;
  total: number;
  size?: "sm" | "default";
};

export function ResolveCancellationDialog({ requestId, orderNumber, mode, paid, total, size = "sm" }: Props) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const approve = mode === "approve";

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await resolveCancellationAction(requestId, approve, note.trim() || undefined);
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      toast.success(approve ? `Order ${orderNumber} cancelled` : `Cancellation request for ${orderNumber} declined`);
      setOpen(false);
      setNote("");
    });
  }

  const noteId = `cancel-note-${requestId}-${mode}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={approve ? "default" : "outline"} size={size} />}>
        {approve ? <Check aria-hidden /> : <X aria-hidden />}
        {approve ? "Approve" : "Reject"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans text-base font-semibold">
            {approve ? "Approve cancellation" : "Reject cancellation"} · {orderNumber}
          </DialogTitle>
          <DialogDescription>
            {approve ? (
              <>
                The order will be cancelled and all items returned to stock.{" "}
                {paid ? (
                  <>
                    A pending refund of <strong className="text-foreground">{formatINR(total)}</strong> will be created in
                    the Refunds queue.
                  </>
                ) : (
                  "No payment was captured, so no refund is needed."
                )}
              </>
            ) : (
              "The order continues through fulfilment. The customer sees your note on their order timeline."
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor={noteId}>
            Note {approve ? "(internal, optional)" : "for the customer (optional)"}
          </Label>
          <Textarea
            id={noteId}
            value={note}
            maxLength={300}
            onChange={(e) => setNote(e.target.value)}
            placeholder={approve ? "e.g. Customer called support to confirm" : "e.g. Your parcel has already been handed to the courier"}
            rows={3}
          />
          {error ? (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={pending} />}>Keep as is</DialogClose>
          <Button variant={approve ? "destructive" : "default"} onClick={submit} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
            {approve ? "Cancel order" : "Reject request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
