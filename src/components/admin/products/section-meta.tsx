"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormSection, ToggleRow } from "./form-fields";
import type { FieldErrors, ProductFormValues, SetValues } from "./form-types";

type Props = { values: ProductFormValues; set: SetValues; errors: FieldErrors };

export function MerchandisingSection({ values, set }: Omit<Props, "errors">) {
  return (
    <FormSection title="Merchandising">
      <div className="divide-y [&>*]:py-2">
        <ToggleRow label="Featured" description="Highlighted on the homepage" checked={values.isFeatured} onChange={(isFeatured) => set({ isFeatured })} />
        <ToggleRow label="Bestseller" description="Shows a Bestseller badge" checked={values.isBestseller} onChange={(isBestseller) => set({ isBestseller })} />
        <ToggleRow label="New arrival" description="Shows a New badge" checked={values.isNew} onChange={(isNew) => set({ isNew })} />
        <ToggleRow label="Gift wrap available" checked={values.giftWrapAvailable} onChange={(giftWrapAvailable) => set({ giftWrapAvailable })} />
        <ToggleRow label="Personalisable" description="Name or message can be added" checked={values.isPersonalizable} onChange={(isPersonalizable) => set({ isPersonalizable })} />
      </div>
    </FormSection>
  );
}

export function ComplianceSection({ values, set, errors }: Props) {
  return (
    <FormSection title="Compliance" description="Legal Metrology and GST details printed on invoices and the product page.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="HSN code" error={errors.hsnCode} optional>
          <Input inputMode="numeric" value={values.hsnCode} onChange={(e) => set({ hsnCode: e.target.value.replace(/\D/g, "") })} placeholder="3304" maxLength={8} />
        </Field>
        <Field label="Country of origin" error={errors.countryOfOrigin}>
          <Input value={values.countryOfOrigin} onChange={(e) => set({ countryOfOrigin: e.target.value })} maxLength={60} />
        </Field>
        <Field label="Weight (grams)" error={errors.weightGrams} optional>
          <Input type="number" inputMode="numeric" min={0} value={values.weightGrams} onChange={(e) => set({ weightGrams: e.target.value })} />
        </Field>
      </div>
      <Field label="Manufacturer / marketer" error={errors.manufacturer} optional>
        <Textarea value={values.manufacturer} onChange={(e) => set({ manufacturer: e.target.value })} rows={2} maxLength={300} placeholder="Name and full address" />
      </Field>
    </FormSection>
  );
}

export function SeoSection({ values, set, errors }: Props) {
  return (
    <FormSection title="Search engine listing" description="Leave blank to use the product name and short description.">
      <Field label="Meta title" error={errors.metaTitle} hint={`${values.metaTitle.length}/70`} optional>
        <Input value={values.metaTitle} onChange={(e) => set({ metaTitle: e.target.value })} maxLength={70} placeholder={values.name} />
      </Field>
      <Field label="Meta description" error={errors.metaDescription} hint={`${values.metaDescription.length}/170`} optional>
        <Textarea value={values.metaDescription} onChange={(e) => set({ metaDescription: e.target.value })} rows={2} maxLength={170} placeholder={values.shortDescription} />
      </Field>
    </FormSection>
  );
}
