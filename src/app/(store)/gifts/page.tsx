import type { Metadata } from "next";
import { ListingHeader } from "@/components/catalog/listing-header";
import { ProductListing } from "@/components/catalog/product-listing";
import { media } from "@/config/media";
import { getCategories } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Gifts & Hampers — Diwali, Rakhi, Birthdays & More",
  description:
    "Curated gift hampers, personalised keepsakes, festive gifts and home fragrance — gift-wrapped with a handwritten note and delivered across India.",
  alternates: { canonical: "/gifts" },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function GiftsPage({ searchParams }: Props) {
  const [sp, categories] = await Promise.all([searchParams, getCategories("GIFTS")]);
  return (
    <>
      <ListingHeader
        eyebrow="Gifting, thoughtfully done"
        title="Gifts that feel personal"
        description="Hampers packed by hand, keepsakes engraved with a name, and festive boxes that arrive ready to give — with a handwritten note, if you like."
        image={media.categories.gifts}
        crumbs={[{ label: "Gifts" }]}
        chipsLabel="Gift categories"
        chips={[{ label: "All gifts", href: "/gifts", active: true }, ...categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` }))]}
      />
      <div className="container-page py-10 md:py-14">
        <ProductListing basePath="/gifts" searchParams={sp} group="GIFTS" />
      </div>
    </>
  );
}
