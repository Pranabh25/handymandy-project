import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { getAdminCategories, getAdminProduct, getMerchandisingVocabulary } from "@/server/admin/products";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { PRODUCT_STATUS_META } from "@/components/admin/shared/status-meta";
import { ProductForm } from "@/components/admin/products/product-form";
import { toFormValues } from "@/components/admin/products/form-types";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories, vocab] = await Promise.all([getAdminProduct(id), getAdminCategories(), getMerchandisingVocabulary()]);
  if (!product) notFound();
  const meta = PRODUCT_STATUS_META[product.status];

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title={product.name}
        description={`${product.sku} · last updated ${formatDateTime(product.updatedAt)}`}
        back={{ href: "/admin/products", label: "Products" }}
        actions={<StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>}
      />
      <ProductForm
        key={product.updatedAt.toISOString()}
        productId={product.id}
        initial={toFormValues(product)}
        categories={categories}
        vocab={vocab}
        orderCount={product._count.orderItems}
        publicSlug={product.slug}
      />
    </div>
  );
}
