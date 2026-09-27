import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { CategoryTiles } from "@/components/home/category-tiles";
import { ProductRail } from "@/components/home/product-rail";
import { OccasionTiles } from "@/components/home/occasion-tiles";
import { FestiveBanner } from "@/components/home/festive-banner";
import { CleanBeauty } from "@/components/home/clean-beauty";
import { PersonalisedCallout } from "@/components/home/personalised-callout";
import { Testimonials } from "@/components/home/testimonials";
import { BrandStory } from "@/components/home/brand-story";
import { siteConfig } from "@/config/site";
import { getCategories, getHomepageCollections } from "@/server/catalog";
import { getStoreSettings } from "@/server/settings";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const CATEGORY_ORDER = ["gift-hampers", "personalised-gifts", "festive-gifts", "home-fragrance", "skincare", "makeup", "fragrance", "bath-body"];

function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/favicon.ico`,
      email: siteConfig.supportEmail,
      telephone: siteConfig.supportPhone,
      address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressLocality: "Bengaluru", addressRegion: "Karnataka", postalCode: "560038", addressCountry: "IN" },
      sameAs: Object.values(siteConfig.social),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export default async function HomePage() {
  const [collections, categories, settings] = await Promise.all([getHomepageCollections(), getCategories(), getStoreSettings()]);
  const orderedCategories = [...categories].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a.slug);
    const ib = CATEGORY_ORDER.indexOf(b.slug);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <>
      <Hero />
      <TrustStrip freeShippingThreshold={settings.freeShippingThreshold} />
      <CategoryTiles categories={orderedCategories.slice(0, 8)} />
      <ProductRail
        eyebrow="Bestsellers"
        title="Most loved, most gifted"
        description="The pieces our customers come back for — and send to everyone they love."
        link={{ label: "Shop bestsellers", href: "/shop?sort=bestsellers" }}
        products={collections.bestsellers}
        className="container-page pb-16 md:pb-24"
      />
      <OccasionTiles />
      <FestiveBanner />
      <ProductRail
        eyebrow="The gift edit"
        title="Ready-to-give, beautifully wrapped"
        link={{ label: "All gifts", href: "/gifts" }}
        products={collections.gifts}
        className="container-page pb-16 md:pb-24"
      />
      <div className="border-t">
        <CleanBeauty products={collections.cosmetics} />
      </div>
      <PersonalisedCallout />
      <ProductRail
        eyebrow="Just in"
        title="New arrivals"
        description="Fresh from our makers — small batches, so they don't last long."
        link={{ label: "Shop new", href: "/shop?sort=newest" }}
        products={collections.newArrivals}
      />
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
      <BrandStory />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()).replace(/</g, "\\u003c") }} />
    </>
  );
}
