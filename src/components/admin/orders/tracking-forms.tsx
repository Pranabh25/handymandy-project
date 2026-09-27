"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COURIERS } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma/enums";
import { addTrackingEventAction, setTrackingAction } from "@/server/actions/admin-orders";
import { NativeSelect } from "./list-controls";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

type TrackingProps = {
  orderId: string;
  status: OrderStatus;
  courier: string | null;
  trackingNumber: string | null;
  /** yyyy-mm-dd */
  estimatedDelivery: string;
};

export function TrackingForm({ orderId, status, courier, trackingNumber, estimatedDelivery }: TrackingProps) {
  const canShip = status === "CONFIRMED" || status === "PACKED";
  const [form, setForm] = useState({
    courier: courier ?? "",
    trackingNumber: trackingNumber ?? "",
    estimatedDelivery,
    markShipped: canShip,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    startTransition(async () => {
      const res = await setTrackingAction(orderId, { ...form, markShipped: canShip && form.markShipped });
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        return;
      }
      toast.success(canShip && form.markShipped ? "Tracking saved and order marked as shipped" : "Tracking details saved");
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="courier">Courier</Label>
          <NativeSelect
            id="courier"
            value={form.courier}
            onChange={(e) => setForm({ ...form, courier: e.target.value })}
            aria-invalid={!!errors.courier}
            aria-describedby={errors.courier ? "courier-error" : undefined}
          >
            <option value="" disabled>
              Choose courier
            </option>
            {COURIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
          <FieldError id="courier-error" message={errors.courier} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="awb">AWB / tracking no.</Label>
          <Input
            id="awb"
            value={form.trackingNumber}
            onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
            placeholder="e.g. 7734 5521 9081"
            className="h-9 font-mono uppercase"
            autoComplete="off"
            aria-invalid={!!errors.trackingNumber}
            aria-describedby={errors.trackingNumber ? "awb-error" : undefined}
          />
          <FieldError id="awb-error" message={errors.trackingNumber} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="eta">Estimated delivery</Label>
        <Input
          id="eta"
          type="date"
          value={form.estimatedDelivery}
          onChange={(e) => setForm({ ...form, estimatedDelivery: e.target.value })}
          className="h-9"
          aria-invalid={!!errors.estimatedDelivery}
        />
        <FieldError id="eta-error" message={errors.estimatedDelivery} />
      </div>
      {canShip ? (
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox checked={form.markShipped} onCheckedChange={(v) => setForm({ ...form, markShipped: v === true })} />
          Mark as shipped
        </label>
      ) : null}
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
        Save tracking
      </Button>
    </form>
  );
}

const SUGGESTED_TITLES = ["Picked up by courier", "In transit", "Reached destination hub", "Delivery attempted", "Delayed due to weather"];

export function TrackingEventForm({ orderId }: { orderId: string }) {
  const [form, setForm] = useState({ title: "", location: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    startTransition(async () => {
      const res = await addTrackingEventAction(orderId, form);
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        return;
      }
      toast.success("Tracking update added to the timeline");
      setForm({ title: "", location: "", note: "" });
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="event-title">Update</Label>
        <Input
          id="event-title"
          list="event-title-suggestions"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. In transit"
          className="h-9"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "event-title-error" : undefined}
        />
        <datalist id="event-title-suggestions">
          {SUGGESTED_TITLES.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <FieldError id="event-title-error" message={errors.title} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="event-location">Location (optional)</Label>
          <Input
            id="event-location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Bhiwandi hub, Maharashtra"
            className="h-9"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="event-note">Note (optional)</Label>
          <Input
            id="event-note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Shown to the customer"
            className="h-9"
            aria-invalid={!!errors.note}
          />
          <FieldError id="event-note-error" message={errors.note} />
        </div>
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
        Add update
      </Button>
    </form>
  );
}
