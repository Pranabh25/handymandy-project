import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getAdminCategories, getMerchandisingVocabulary } from "@/server/admin/products";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/products/product-form";
import { EMPTY_PRODUCT } from "@/components/admin/products/form-types";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin();
  const [categories, vocab] = await Promise.all([getAdminCategories(), getMerchandisingVocabulary()]);
  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader title="Add product" description="New products start as drafts until you set them to Active." back={{ href: "/admin/products", label: "Products" }} />
      <ProductForm productId={null} initial={EMPTY_PRODUCT} categories={categories} vocab={vocab} />
    </div>
  );
}
