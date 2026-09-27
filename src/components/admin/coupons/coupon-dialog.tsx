"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { nativeSelectClass } from "@/components/admin/shared/native-select";
import { Field, ToggleRow } from "@/components/admin/products/form-fields";
import { saveCoupon } from "@/server/actions/admin-coupons";

export type CouponFormValues = {
  code: string;
  description: string;
  type: "PERCENT" | "FLAT" | "FREE_SHIPPING";
  value: string;
  minOrder: string;
  maxDiscount: string;
  usageLimit: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

export const EMPTY_COUPON: CouponFormValues = {
  code: "",
  description: "",
  type: "PERCENT",
  value: "10",
  minOrder: "0",
  maxDiscount: "",
  usageLimit: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
};

const num = (s: string) => (s.trim() === "" ? Number.NaN : Number(s));
const opt = (s: string) => (s.trim() === "" ? null : Number(s));

export function CouponDialog({ open, onOpenChange, couponId, initial }: { open: boolean; onOpenChange: (o: boolean) => void; couponId: string | null; initial: CouponFormValues }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const set = (patch: Partial<CouponFormValues>) => setV((cur) => ({ ...cur, ...patch }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveCoupon(couponId, {
        ...v,
        value: v.type === "FREE_SHIPPING" ? 0 : num(v.value),
        minOrder: num(v.minOrder || "0"),
        maxDiscount: opt(v.maxDiscount),
        usageLimit: opt(v.usageLimit),
      });
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        return;
      }
      toast.success(couponId ? `${v.code.toUpperCase()} updated` : `${v.code.toUpperCase()} created`);
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <form onSubmit={submit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle className="font-sans font-semibold">{couponId ? "Edit coupon" : "New coupon"}</DialogTitle>
            <DialogDescription>Customers enter the code at checkout. Discounts apply to the cart subtotal.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code" error={errors.code}>
              <Input value={v.code} onChange={(e) => set({ code: e.target.value.toUpperCase().replace(/\s/g, "") })} placeholder="DIWALI15" maxLength={24} className="font-mono uppercase" />
            </Field>
            <Field label="Discount type" error={errors.type}>
              <select value={v.type} onChange={(e) => set({ type: e.target.value as CouponFormValues["type"] })} className={nativeSelectClass}>
                <option value="PERCENT">Percent off</option>
                <option value="FLAT">Flat ₹ off</option>
                <option value="FREE_SHIPPING">Free shipping</option>
              </select>
            </Field>
          </div>
          <Field label="Description" error={errors.description} hint="Shown to customers, e.g. “15% off festive hampers”">
            <Input value={v.description} onChange={(e) => set({ description: e.target.value })} maxLength={160} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            {v.type !== "FREE_SHIPPING" ? (
              <Field label={v.type === "PERCENT" ? "Percent off" : "Amount off (₹)"} error={errors.value}>
                <Input type="number" inputMode="numeric" min={1} value={v.value} onChange={(e) => set({ value: e.target.value })} />
              </Field>
            ) : null}
            <Field label="Min. order (₹)" error={errors.minOrder}>
              <Input type="number" inputMode="numeric" min={0} value={v.minOrder} onChange={(e) => set({ minOrder: e.target.value })} />
            </Field>
            {v.type === "PERCENT" ? (
              <Field label="Max discount (₹)" error={errors.maxDiscount} optional>
                <Input type="number" inputMode="numeric" min={0} value={v.maxDiscount} onChange={(e) => set({ maxDiscount: e.target.value })} placeholder="No cap" />
              </Field>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Usage limit" error={errors.usageLimit} optional>
              <Input type="number" inputMode="numeric" min={1} value={v.usageLimit} onChange={(e) => set({ usageLimit: e.target.value })} placeholder="Unlimited" />
            </Field>
            <Field label="Starts" error={errors.startsAt} optional>
              <Input type="date" value={v.startsAt} onChange={(e) => set({ startsAt: e.target.value })} />
            </Field>
            <Field label="Ends" error={errors.endsAt} optional>
              <Input type="date" value={v.endsAt} min={v.startsAt || undefined} onChange={(e) => set({ endsAt: e.target.value })} />
            </Field>
          </div>
          <ToggleRow label="Active" description="Inactive codes are rejected at checkout" checked={v.isActive} onChange={(isActive) => set({ isActive })} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
              {couponId ? "Save coupon" : "Create coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
