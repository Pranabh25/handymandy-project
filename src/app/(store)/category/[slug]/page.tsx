import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingHeader } from "@/components/catalog/listing-header";
import { ProductListing } from "@/components/catalog/product-listing";
import { media } from "@/config/media";
import { getCategories, getCategoryBySlug } from "@/server/catalog";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found", robots: { index: false } };
  const description =
    category.description ??
    `Shop ${category.name.toLowerCase()} at LushAura — handcrafted in India, delivered across the country with COD available.`;
  const image = media.categories[category.slug];
  return {
    title: category.name,
    description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { title: `${category.name} | LushAura`, description, images: image ? [{ url: image.src, alt: image.alt }] : undefined },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [sp, siblings] = await Promise.all([searchParams, getCategories(category.group)]);
  const isGifts = category.group === "GIFTS";
  const parent = isGifts ? { label: "Gifts", href: "/gifts" } : { label: "Cosmetics", href: "/cosmetics" };

  return (
    <>
      <ListingHeader
        eyebrow={category.tagline ?? (isGifts ? "Gifting" : "Clean beauty")}
        title={category.name}
        description={category.description}
        image={media.categories[category.slug] ?? (category.image?.startsWith("/") ? { src: category.image, alt: category.name } : undefined)}
        crumbs={[parent, { label: category.name }]}
        chipsLabel={isGifts ? "Gift categories" : "Beauty categories"}
        chips={[
          { label: isGifts ? "All gifts" : "All beauty", href: parent.href },
          ...siblings.map((c) => ({ label: c.name, href: `/category/${c.slug}`, active: c.slug === category.slug })),
        ]}
      />
      <div className="container-page py-10 md:py-14">
        <ProductListing basePath={`/category/${category.slug}`} searchParams={sp} group={category.group} categorySlug={category.slug} />
      </div>
    </>
  );
}
