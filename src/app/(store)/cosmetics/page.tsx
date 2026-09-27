import type { Metadata } from "next";
import { ListingHeader } from "@/components/catalog/listing-header";
import { ProductListing } from "@/components/catalog/product-listing";
import { media } from "@/config/media";
import { getCategories } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Clean Beauty — Skincare, Makeup, Fragrance & Bath",
  description:
    "Cruelty-free, Ayurveda-inspired skincare, makeup, fragrance and bath & body essentials made in India. Kumkumadi, saffron, niacinamide and more.",
  alternates: { canonical: "/cosmetics" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CosmeticsPage({ searchParams }: Props) {
  const [sp, categories] = await Promise.all([searchParams, getCategories("COSMETICS")]);
  return (
    <>
      <ListingHeader
        eyebrow="Clean beauty, rooted in Ayurveda"
        title="Beauty that's kind to your skin"
        description="Time-honoured Indian botanicals meet modern actives — every formula is cruelty-free, dermatologically tested and made for Indian skin and weather."
        image={media.categories.cosmetics}
        crumbs={[{ label: "Cosmetics" }]}
        chipsLabel="Beauty categories"
        chips={[{ label: "All beauty", href: "/cosmetics", active: true }, ...categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` }))]}
      />
      <div className="container-page py-10 md:py-14">
        <ProductListing basePath="/cosmetics" searchParams={sp} group="COSMETICS" />
      </div>
    </>
  );
}
