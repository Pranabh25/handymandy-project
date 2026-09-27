"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatINR } from "@/lib/format";
import { NEXT_STATUSES, ORDER_STATUS_META } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma/enums";
import { updateOrderStatusAction } from "@/server/actions/admin-orders";
import { NativeSelect } from "./list-controls";

type Props = { orderId: string; orderNumber: string; status: OrderStatus; paid: boolean; total: number };

export function StatusForm({ orderId, orderNumber, status, paid, total }: Props) {
  const options = NEXT_STATUSES[status];
  const [next, setNext] = useState<OrderStatus | "">(options.find((s) => s !== "CANCELLED") ?? options[0] ?? "");
  const [note, setNote] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!options.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {status === "DELIVERED" ? "This order has been delivered — no further status changes." : "This order is cancelled and closed."}
      </p>
    );
  }

  function run() {
    if (!next) return;
    setError(null);
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, next, note.trim() || undefined);
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      toast.success(`${orderNumber} marked as ${ORDER_STATUS_META[next].label.toLowerCase()}`);
      setConfirmOpen(false);
      setNote("");
      const remaining = NEXT_STATUSES[next];
      setNext(remaining.find((s) => s !== "CANCELLED") ?? remaining[0] ?? "");
    });
  }

  return (
    <>
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (next === "CANCELLED") setConfirmOpen(true);
        else run();
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="next-status">Move to</Label>
        <NativeSelect id="next-status" value={next} onChange={(e) => setNext(e.target.value as OrderStatus)}>
          {options.map((s) => (
            <option key={s} value={s}>
              {s === "CANCELLED" ? "Cancel order" : ORDER_STATUS_META[s].label}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="status-note">Note for the timeline (optional)</Label>
        <Textarea
          id="status-note"
          rows={2}
          maxLength={300}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={next === "CANCELLED" ? "e.g. Item damaged in warehouse — customer informed" : ORDER_STATUS_META[next || status].description}
        />
      </div>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="sm" variant={next === "CANCELLED" ? "destructive" : "default"} disabled={pending || !next}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {next === "CANCELLED" ? "Cancel order…" : "Update status"}
      </Button>
    </form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans font-semibold">Cancel {orderNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              All items go back into stock and the customer sees the order as cancelled.{" "}
              {paid
                ? `A pending refund of ${formatINR(total)} will be added to the Refunds queue for processing.`
                : "No payment was captured, so no refund is created."}{" "}
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep order</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={run} disabled={pending}>
              {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
