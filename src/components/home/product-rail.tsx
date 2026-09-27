import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/product/product-card";
import type { ProductSummary } from "@/types";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
  products: ProductSummary[];
  className?: string;
};

export function ProductRail({ eyebrow, title, description, link, products, className }: Props) {
  if (!products.length) return null;
  return (
    <section aria-label={title} className={className ?? "container-page py-16 md:py-24"}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} link={link} />
      <ProductGrid products={products} />
    </section>
  );
}
