"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { saveProduct } from "@/server/actions/admin-catalog";
import { FormSection } from "./form-fields";
import { ImageManager } from "./image-manager";
import { BasicInfoSection, PricingSection, type CategoryOption } from "./section-basic";
import { CosmeticSection, GiftSection, type Vocabulary } from "./section-details";
import { ComplianceSection, MerchandisingSection, SeoSection } from "./section-meta";
import { DeleteProductButton } from "./delete-product-button";
import { toProductInput, type FieldErrors, type ProductFormValues } from "./form-types";

type Props = {
  productId: string | null;
  initial: ProductFormValues;
  categories: CategoryOption[];
  vocab: Vocabulary;
  orderCount?: number;
  publicSlug?: string | null;
};

export function ProductForm({ productId, initial, categories, vocab, orderCount = 0, publicSlug }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [slugLocked, setSlugLocked] = useState(Boolean(productId));
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (patch: Partial<ProductFormValues>) => {
    setValues((v) => ({ ...v, ...patch }));
    setDirty(true);
    const keys = Object.keys(patch);
    if (keys.some((k) => errors[k])) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !keys.includes(k))));
  };

  const group = categories.find((c) => c.id === values.categoryId)?.group;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveProduct(productId, toProductInput(values));
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
        return;
      }
      setErrors({});
      setDirty(false);
      toast.success(productId ? "Product saved" : "Product created");
      if (!productId) router.push(`/admin/products/${res.data.id}`);
      else router.refresh();
    });
  }

  const imageError = Object.entries(errors).find(([k]) => k.startsWith("images"))?.[1];
  const cosmeticsFirst = group === "COSMETICS";
  const details = [
    <CosmeticSection key="c" values={values} set={set} errors={errors} vocab={vocab} />,
    <GiftSection key="g" values={values} set={set} errors={errors} vocab={vocab} />,
  ];

  return (
    <form id="product-form" onSubmit={onSubmit} noValidate className="pb-20">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
          <BasicInfoSection values={values} set={set} errors={errors} categories={categories} slugLocked={slugLocked} onSlugEdited={() => setSlugLocked(true)} />
          <FormSection title="Images" description="Square photos (1200 × 1200 px or larger) look best.">
            <ImageManager images={values.images} onChange={(images) => set({ images })} productName={values.name} error={imageError} />
          </FormSection>
          <PricingSection values={values} set={set} errors={errors} />
          {cosmeticsFirst ? details : details.reverse()}
          <ComplianceSection values={values} set={set} errors={errors} />
          <SeoSection values={values} set={set} errors={errors} />
        </div>
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:sticky lg:top-20 lg:self-start">
          <MerchandisingSection values={values} set={set} />
          {productId ? (
            <FormSection title="Danger zone">
              <p className="text-xs text-muted-foreground">
                {orderCount > 0
                  ? "This product appears in past orders, so it will be archived (hidden from the store) rather than deleted."
                  : "Deleting removes the product and its photos permanently."}
              </p>
              <DeleteProductButton productId={productId} productName={values.name} hasOrders={orderCount > 0} />
            </FormSection>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur-sm lg:left-60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {pending ? "Saving…" : dirty ? "You have unsaved changes" : productId ? "All changes saved" : "New product"}
          </p>
          <div className="flex items-center gap-2">
            {publicSlug && initial.status === "ACTIVE" ? (
              <Link href={`/product/${publicSlug}`} target="_blank" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                <ExternalLink aria-hidden /> <span className="hidden sm:inline">View in store</span>
              </Link>
            ) : null}
            <Link href="/admin/products" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Cancel
            </Link>
            <Button type="submit" variant="accent" size="sm" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
              {productId ? "Save changes" : "Create product"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
