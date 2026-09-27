"use client";

import { useId, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { INDIAN_STATES } from "@/config/site";
import { addressSchema, fieldErrors as toFieldErrors } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { saveAddress, type SavedAddress } from "@/server/actions/addresses";

type FormState = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  type: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
};

type Props = {
  /** Existing address to edit; omit to create a new one. */
  initial?: SavedAddress | null;
  /** Prefill for a new address (e.g. the customer's name and phone). */
  defaults?: Partial<Pick<FormState, "fullName" | "phone">>;
  onSaved: (address: SavedAddress) => void;
  onCancel?: () => void;
  submitLabel?: string;
  className?: string;
};

const TYPES = [
  { value: "HOME", label: "Home" },
  { value: "WORK", label: "Work" },
  { value: "OTHER", label: "Other" },
] as const;

const selectClass =
  "h-11 w-full min-w-0 appearance-none rounded-lg border border-input bg-card px-3.5 pr-9 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm";

/** Delivery address form (checkout and My Account → Addresses). */
export function AddressForm({ initial, defaults, onSaved, onCancel, submitLabel, className }: Props) {
  const uid = useId();
  const [form, setForm] = useState<FormState>(() => ({
    fullName: initial?.fullName ?? defaults?.fullName ?? "",
    phone: initial?.phone ?? defaults?.phone ?? "",
    line1: initial?.line1 ?? "",
    line2: initial?.line2 ?? "",
    landmark: initial?.landmark ?? "",
    pincode: initial?.pincode ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    type: initial?.type ?? "HOME",
    isDefault: initial?.isDefault ?? false,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const fid = (k: string) => `${uid}-${k}`;
  const errProps = (k: keyof FormState) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${fid(k)}-error` } : {};

  function field({ name, label, optional, children }: { name: keyof FormState; label: string; optional?: boolean; children: React.ReactNode }) {
    return (
      <div className="space-y-1.5">
        <label htmlFor={fid(name)} className="text-sm font-medium">
          {label}
          {optional ? <span className="font-normal text-muted-foreground"> (optional)</span> : null}
        </label>
        {children}
        {errors[name] ? (
          <p id={`${fid(name)}-error`} role="alert" className="text-xs text-destructive">
            {errors[name]}
          </p>
        ) : null}
      </div>
    );
  }

  function submit() {
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      const fe = toFieldErrors(parsed.error);
      setErrors(fe);
      const first = Object.keys(fe)[0];
      if (first) document.getElementById(fid(first))?.focus();
      toast.error("Please check the highlighted fields");
      return;
    }
    start(async () => {
      const res = await saveAddress({ ...form, id: initial?.id });
      if (!res.ok) {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        toast.error(res.error);
        return;
      }
      toast.success(initial ? "Address updated" : "Address saved", {
        description: `${res.data.address.fullName}, ${res.data.address.city}`,
      });
      onSaved(res.data.address);
    });
  }

  return (
    <form
      noValidate
      className={cn("space-y-4", className)}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {field({
          name: "fullName",
          label: "Full name",
          children: (
            <Input id={fid("fullName")} autoComplete="name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} {...errProps("fullName")} />
          ),
        })}
        {field({
          name: "phone",
          label: "Mobile number",
          children: (
            <Input
              id={fid("phone")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile"
              maxLength={14}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              {...errProps("phone")}
            />
          ),
        })}
      </div>
      {field({
        name: "line1",
        label: "Flat / house no., building, street",
        children: (
          <Input
            id={fid("line1")}
            autoComplete="address-line1"
            placeholder="e.g. 402, Lotus Residency, 12th Main Road"
            value={form.line1}
            onChange={(e) => set("line1", e.target.value)}
            {...errProps("line1")}
          />
        ),
      })}
      <div className="grid gap-4 sm:grid-cols-2">
        {field({
          name: "line2",
          label: "Area / locality",
          optional: true,
          children: (
            <Input id={fid("line2")} autoComplete="address-line2" placeholder="e.g. HSR Layout" value={form.line2} onChange={(e) => set("line2", e.target.value)} {...errProps("line2")} />
          ),
        })}
        {field({
          name: "landmark",
          label: "Landmark",
          optional: true,
          children: (
            <Input id={fid("landmark")} placeholder="e.g. Near Agara Lake" value={form.landmark} onChange={(e) => set("landmark", e.target.value)} {...errProps("landmark")} />
          ),
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {field({
          name: "pincode",
          label: "PIN code",
          children: (
            <Input
              id={fid("pincode")}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              placeholder="560102"
              value={form.pincode}
              onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
              {...errProps("pincode")}
            />
          ),
        })}
        {field({
          name: "city",
          label: "City",
          children: (
            <Input id={fid("city")} autoComplete="address-level2" placeholder="Bengaluru" value={form.city} onChange={(e) => set("city", e.target.value)} {...errProps("city")} />
          ),
        })}
        <div className="col-span-2 sm:col-span-1">
          {field({
            name: "state",
            label: "State",
            children: (
              <div className="relative">
              <select
                id={fid("state")}
                autoComplete="address-level1"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className={selectClass}
                {...errProps("state")}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              </div>
            ),
          })}
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Address type</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={cn(
                "inline-flex h-9 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                form.type === t.value ? "border-charcoal bg-charcoal text-ivory" : "border-input bg-card hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name={`${uid}-type`}
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

      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <Checkbox checked={form.isDefault} onCheckedChange={(c) => set("isDefault", !!c)} />
        Make this my default address
      </label>

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={pending} className="sm:min-w-44">
          {pending ? "Saving…" : (submitLabel ?? (initial ? "Update address" : "Save address"))}
        </Button>
      </div>
    </form>
  );
}
