import type { Metadata } from "next";
import { ListingHeader } from "@/components/catalog/listing-header";
import { ProductListing } from "@/components/catalog/product-listing";
import { media } from "@/config/media";
import { getCategories } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Shop All — Gifts, Hampers & Clean Beauty",
  description:
    "Shop LushAura's full collection: handcrafted gift hampers, personalised gifts, Ayurvedic skincare, makeup and fragrances. Free shipping above ₹999, COD available.",
  alternates: { canonical: "/shop" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ShopPage({ searchParams }: Props) {
  const [sp, categories] = await Promise.all([searchParams, getCategories()]);
  return (
    <>
      <ListingHeader
        eyebrow="The full collection"
        title="Shop everything LushAura"
        description="Thoughtful gifts and clean, Ayurveda-inspired beauty — handcrafted in small batches across India and delivered to your door."
        image={media.heroSecondary}
        crumbs={[{ label: "Shop All" }]}
        chips={[
          { label: "All gifts", href: "/gifts" },
          { label: "All beauty", href: "/cosmetics" },
          ...categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
        ]}
      />
      <div className="container-page py-10 md:py-14">
        <ProductListing basePath="/shop" searchParams={sp} />
      </div>
    </>
  );
}
