"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDIAN_STATES } from "@/config/site";
import { saveAddress, type SavedAddress } from "@/server/actions/addresses";
import { cn } from "@/lib/utils";

type FormState = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  type: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
};

const EMPTY: FormState = {
  fullName: "", phone: "", line1: "", line2: "", landmark: "", city: "", state: "", pincode: "", type: "HOME", isDefault: false,
};

function toForm(a: SavedAddress | null): FormState {
  if (!a) return EMPTY;
  return { ...a, line2: a.line2 ?? "", landmark: a.landmark ?? "" };
}

const TYPES = [
  { value: "HOME", label: "Home" },
  { value: "WORK", label: "Work" },
  { value: "OTHER", label: "Other" },
] as const;

type FieldKey = "fullName" | "phone" | "line1" | "line2" | "landmark" | "city" | "pincode";
const FIELDS: { key: FieldKey; label: string; autoComplete: string; span?: boolean; inputMode?: "numeric" | "tel"; maxLength?: number }[] = [
  { key: "fullName", label: "Full name", autoComplete: "name" },
  { key: "phone", label: "Mobile number", autoComplete: "tel-national", inputMode: "tel", maxLength: 14 },
  { key: "line1", label: "Flat / house no., building, street", autoComplete: "address-line1", span: true },
  { key: "line2", label: "Area / locality (optional)", autoComplete: "address-line2", span: true },
  { key: "landmark", label: "Landmark (optional)", autoComplete: "off" },
  { key: "pincode", label: "PIN code", autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 },
  { key: "city", label: "City", autoComplete: "address-level2" },
];

export function AddressFormDialog({
  open,
  onOpenChange,
  address,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: SavedAddress | null;
}) {
  const [form, setForm] = useState<FormState>(() => toForm(address));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    start(async () => {
      const res = await saveAddress({ ...form, id: address?.id });
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        return;
      }
      toast.success(address ? "Address updated" : "Address saved");
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{address ? "Edit address" : "Add a new address"}</DialogTitle>
          <DialogDescription>We deliver across India. Please add a complete address for a smooth delivery.</DialogDescription>
        </DialogHeader>
        <form id="address-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
          {FIELDS.map((f) => (
            <div key={f.key} className={cn("space-y-1.5", f.span && "sm:col-span-2")}>
              <Label htmlFor={`addr-${f.key}`}>{f.label}</Label>
              <Input
                id={`addr-${f.key}`}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                autoComplete={f.autoComplete}
                inputMode={f.inputMode}
                maxLength={f.maxLength}
                aria-invalid={!!errors[f.key]}
                aria-describedby={errors[f.key] ? `addr-${f.key}-error` : undefined}
              />
              {errors[f.key] ? (
                <p id={`addr-${f.key}-error`} role="alert" className="text-xs text-destructive">
                  {errors[f.key]}
                </p>
              ) : null}
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="addr-state">State</Label>
            <select
              id="addr-state"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              autoComplete="address-level1"
              aria-invalid={!!errors.state}
              className="h-11 w-full rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm"
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state ? (
              <p role="alert" className="text-xs text-destructive">
                {errors.state}
              </p>
            ) : null}
          </div>
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-medium">Address type</legend>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <label
                  key={t.value}
                  className={cn(
                    "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                    form.type === t.value ? "border-charcoal bg-charcoal text-ivory" : "bg-card hover:bg-muted",
                  )}
                >
                  <input
                    type="radio"
                    name="addr-type"
                    value={t.value}
                    checked={form.type === t.value}
                    onChange={() => set("type", t.value)}
                    className="sr-only"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>
          {!address?.isDefault ? (
            <Label className="cursor-pointer gap-2.5 font-normal sm:col-span-2">
              <Checkbox checked={form.isDefault} onCheckedChange={(v) => set("isDefault", !!v)} />
              Make this my default address
            </Label>
          ) : null}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="address-form" disabled={pending}>
            {pending ? "Saving…" : "Save address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
