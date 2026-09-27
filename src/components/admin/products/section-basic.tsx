"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { nativeSelectClass } from "@/components/admin/shared/native-select";
import { discountPercent, formatINR } from "@/lib/format";
import { Field, FormSection } from "./form-fields";
import { TagInput } from "./tag-input";
import { slugify, type FieldErrors, type ProductFormValues, type SetValues } from "./form-types";

export type CategoryOption = { id: string; name: string; slug: string; group: "GIFTS" | "COSMETICS" };

type Props = { values: ProductFormValues; set: SetValues; errors: FieldErrors };

export function BasicInfoSection({ values, set, errors, categories, slugLocked, onSlugEdited }: Props & {
  categories: CategoryOption[];
  slugLocked: boolean;
  onSlugEdited: () => void;
}) {
  const groups = [
    { label: "Gifts", items: categories.filter((c) => c.group === "GIFTS") },
    { label: "Cosmetics", items: categories.filter((c) => c.group === "COSMETICS") },
  ];
  return (
    <FormSection title="Basic information" description="What customers see first on cards and the product page.">
      <Field label="Product name" error={errors.name}>
        <Input
          value={values.name}
          onChange={(e) => set(slugLocked ? { name: e.target.value } : { name: e.target.value, slug: slugify(e.target.value) })}
          placeholder="Kesar Chandan Diwali Hamper"
          maxLength={120}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="URL slug" error={errors.slug} hint={<>lushaura.in/product/{values.slug || "…"}</>}>
          <Input
            value={values.slug}
            onChange={(e) => {
              onSlugEdited();
              set({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
            }}
            onBlur={() => set({ slug: slugify(values.slug) })}
            maxLength={140}
          />
        </Field>
        <Field label="SKU" error={errors.sku} hint="Unique stock code, e.g. LA-GH-014">
          <Input value={values.sku} onChange={(e) => set({ sku: e.target.value.toUpperCase() })} maxLength={40} className="uppercase" />
        </Field>
      </div>
      <Field label="Category" error={errors.categoryId}>
        <select value={values.categoryId} onChange={(e) => set({ categoryId: e.target.value })} className={nativeSelectClass}>
          <option value="" disabled>
            Choose a category
          </option>
          {groups.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>
      <Field label="Short description" error={errors.shortDescription} hint={`${values.shortDescription.length}/200 · shown on product cards`}>
        <Input value={values.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} maxLength={200} />
      </Field>
      <Field label="Full description" error={errors.description}>
        <Textarea value={values.description} onChange={(e) => set({ description: e.target.value })} rows={6} maxLength={5000} />
      </Field>
      <Field label="Search tags" error={errors.tags} hint="Press Enter or comma after each tag" optional>
        <TagInput value={values.tags} onChange={(tags) => set({ tags })} placeholder="diwali, sandalwood, brass" />
      </Field>
    </FormSection>
  );
}

export function PricingSection({ values, set, errors }: Props) {
  const price = Number(values.price) || 0;
  const mrp = Number(values.mrp) || 0;
  const off = discountPercent(price, mrp);
  return (
    <FormSection title="Pricing & inventory" description="Whole rupees, GST inclusive.">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Selling price (₹)" error={errors.price}>
          <Input type="number" inputMode="numeric" min={1} step={1} value={values.price} onChange={(e) => set({ price: e.target.value })} />
        </Field>
        <Field label="MRP (₹)" error={errors.mrp}>
          <Input type="number" inputMode="numeric" min={1} step={1} value={values.mrp} onChange={(e) => set({ mrp: e.target.value })} />
        </Field>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Discount</p>
          <p className="flex h-10 items-center rounded-lg bg-muted px-3 text-sm tabular-nums" aria-live="polite">
            {off ? (
              <span>
                <span className="font-semibold text-sage">{off}% off</span>
                <span className="text-muted-foreground"> · saves {formatINR(mrp - price)}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">No discount</span>
            )}
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Stock on hand" error={errors.stock}>
          <Input type="number" inputMode="numeric" min={0} step={1} value={values.stock} onChange={(e) => set({ stock: e.target.value })} />
        </Field>
        <Field label="Low-stock alert at" error={errors.lowStockAt} hint="Flag on dashboard at or below">
          <Input type="number" inputMode="numeric" min={0} step={1} value={values.lowStockAt} onChange={(e) => set({ lowStockAt: e.target.value })} />
        </Field>
        <Field label="Status" error={errors.status}>
          <select value={values.status} onChange={(e) => set({ status: e.target.value as ProductFormValues["status"] })} className={nativeSelectClass}>
            <option value="ACTIVE">Active — visible in store</option>
            <option value="DRAFT">Draft — hidden</option>
            <option value="ARCHIVED">Archived — retired</option>
          </select>
        </Field>
      </div>
    </FormSection>
  );
}
