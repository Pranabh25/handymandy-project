"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormSection, ToggleRow } from "@/components/admin/products/form-fields";
import { saveStoreSettings } from "@/server/actions/admin-settings";

export type SettingsFormValues = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  gstin: string;
  registeredAddress: string;
  freeShippingThreshold: string;
  shippingFee: string;
  codFee: string;
  codEnabled: boolean;
  giftWrapFee: string;
  announcement: string;
};

const num = (s: string) => (s.trim() === "" ? Number.NaN : Number(s));

export function SettingsForm({ initial }: { initial: SettingsFormValues }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const set = (patch: Partial<SettingsFormValues>) => setV((cur) => ({ ...cur, ...patch }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveStoreSettings({
        ...v,
        freeShippingThreshold: num(v.freeShippingThreshold),
        shippingFee: num(v.shippingFee),
        codFee: num(v.codFee),
        giftWrapFee: num(v.giftWrapFee),
      });
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        return;
      }
      setErrors({});
      toast.success("Store settings saved");
      router.refresh();
    });
  }

  const money = (key: "freeShippingThreshold" | "shippingFee" | "codFee" | "giftWrapFee", label: string, hint?: string) => (
    <Field label={label} error={errors[key]} hint={hint}>
      <Input type="number" inputMode="numeric" min={0} value={v[key]} onChange={(e) => set({ [key]: e.target.value })} />
    </Field>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-4 sm:space-y-6">
      <FormSection title="Store details" description="Shown in the footer, invoices and order emails.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Store name" error={errors.storeName}>
            <Input value={v.storeName} onChange={(e) => set({ storeName: e.target.value })} maxLength={60} />
          </Field>
          <Field label="GSTIN" error={errors.gstin} optional>
            <Input value={v.gstin} onChange={(e) => set({ gstin: e.target.value.toUpperCase() })} maxLength={15} className="uppercase" placeholder="27ABCDE1234F1Z5" />
          </Field>
        </div>
        <Field label="Registered address" error={errors.registeredAddress}>
          <Textarea value={v.registeredAddress} onChange={(e) => set({ registeredAddress: e.target.value })} rows={3} maxLength={400} />
        </Field>
      </FormSection>

      <FormSection title="Customer support">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Support email" error={errors.supportEmail}>
            <Input type="email" value={v.supportEmail} onChange={(e) => set({ supportEmail: e.target.value })} />
          </Field>
          <Field label="Support phone" error={errors.supportPhone}>
            <Input type="tel" value={v.supportPhone} onChange={(e) => set({ supportPhone: e.target.value })} />
          </Field>
          <Field label="WhatsApp number" error={errors.whatsappNumber} optional>
            <Input type="tel" value={v.whatsappNumber} onChange={(e) => set({ whatsappNumber: e.target.value })} />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Shipping & fees" description="Whole rupees. Changes apply to new carts immediately.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {money("freeShippingThreshold", "Free shipping above (₹)", "Set 0 to always ship free")}
          {money("shippingFee", "Shipping fee (₹)")}
          {money("giftWrapFee", "Gift wrap fee (₹)")}
          {money("codFee", "COD fee (₹)")}
        </div>
        <ToggleRow label="Cash on Delivery" description="Offer COD at checkout" checked={v.codEnabled} onChange={(codEnabled) => set({ codEnabled })} />
      </FormSection>

      <FormSection title="Announcement bar" description="The thin strip above the store header. Leave blank to hide it.">
        <Field label="Announcement text" error={errors.announcement} hint={`${v.announcement.length}/160`} optional>
          <Input value={v.announcement} onChange={(e) => set({ announcement: e.target.value })} maxLength={160} />
        </Field>
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />} Save settings
        </Button>
      </div>
    </form>
  );
}
