import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/product/product-card";
import { Price } from "@/components/product/price";
import { RatingStars } from "@/components/product/rating-stars";
import { ProductGallery } from "@/components/catalog/product/product-gallery";
import { PurchasePanel } from "@/components/catalog/product/purchase-panel";
import { PincodeCheck } from "@/components/catalog/product/pincode-check";
import { OffersBox } from "@/components/catalog/product/offers-box";
import { ProductHighlights } from "@/components/catalog/product/product-highlights";
import { ProductDetails } from "@/components/catalog/product/product-details";
import { ReviewsSection } from "@/components/catalog/product/reviews-section";
import { StockStatus } from "@/components/catalog/product/stock-status";
import { productJsonLd } from "@/components/catalog/product/product-json-ld";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { discountPercent } from "@/lib/format";
import { getApprovedReviews, getProductBySlug, getRatingBreakdown, getRelatedProducts, toSummary } from "@/server/catalog";
import { getStoreSettings } from "@/server/settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };
  const description = product.metaDescription ?? product.shortDescription;
  const image = product.images[0];
  return {
    title: product.metaTitle ?? product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: image ? [{ url: image.url, alt: image.alt ?? product.name }] : undefined,
    },
  };
}

async function getActiveCoupons() {
  const now = new Date();
  const rows = await db.coupon.findMany({
    where: {
      isActive: true,
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: now } }] }, { OR: [{ startsAt: null }, { startsAt: { lte: now } }] }],
    },
    orderBy: { minOrder: "asc" },
    select: { code: true, description: true, usageLimit: true, usedCount: true },
    take: 5,
  });
  return rows.filter((c) => c.usageLimit == null || c.usedCount < c.usageLimit).map(({ code, description }) => ({ code, description }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, breakdown, related, coupons, user, settings] = await Promise.all([
    getApprovedReviews(product.id),
    getRatingBreakdown(product.id),
    getRelatedProducts(product.id, product.categoryId),
    getActiveCoupons(),
    getCurrentUser(),
    getStoreSettings(),
  ]);

  const summary = toSummary(product);
  const isGift = product.category.group === "GIFTS";
  const parent = isGift ? { label: "Gifts", href: "/gifts" } : { label: "Cosmetics", href: "/cosmetics" };
  const off = discountPercent(product.price, product.mrp);
  const jsonLd = productJsonLd(product);

  return (
    <>
      <div className="container-page pt-5 pb-16 md:pt-8 md:pb-24">
        <Breadcrumbs items={[parent, { label: product.category.name, href: `/category/${product.category.slug}` }, { label: product.name }]} />

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <ProductGallery
              images={product.images.map((i) => ({ url: i.url, alt: i.alt }))}
              name={product.name}
              group={product.category.group}
              categoryName={product.category.name}
              badges={
                <>
                  {product.isBestseller ? (
                    <span className="rounded-full bg-charcoal px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-ivory uppercase">
                      Bestseller
                    </span>
                  ) : product.isNew ? (
                    <span className="rounded-full bg-card px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase shadow-soft">New</span>
                  ) : null}
                  {off >= 20 ? <span className="rounded-full bg-terracotta px-2.5 py-1 text-[0.65rem] font-semibold text-white">{off}% off</span> : null}
                </>
              }
            />
          </div>

          <div className="min-w-0 space-y-6">
            <div>
              <p className="eyebrow">{product.category.name}</p>
              <h1 className="mt-2 text-3xl leading-[1.1] font-semibold text-balance md:text-4xl lg:text-[2.75rem]">{product.name}</h1>
              {product.reviewCount > 0 ? (
                <a href="#reviews" className="mt-3 inline-block rounded-md hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                  <RatingStars rating={product.rating} count={product.reviewCount} />
                </a>
              ) : null}
              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{product.shortDescription}</p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3">
              <Price price={product.price} mrp={product.mrp} size="lg" showTaxNote />
              <StockStatus stock={product.stock} lowStockAt={product.lowStockAt} />
            </div>

            <PurchasePanel product={summary} />
            <OffersBox coupons={coupons} />
            <PincodeCheck inStock={product.stock > 0} />
            <ProductHighlights product={product} />
          </div>
        </div>

        <div className="mt-16 max-w-4xl md:mt-24">
          <ProductDetails product={product} freeShippingThreshold={settings.freeShippingThreshold} />
        </div>

        <div className="mt-16 md:mt-24">
          <ReviewsSection
            productId={product.id}
            productSlug={product.slug}
            rating={product.rating}
            reviewCount={product.reviewCount}
            breakdown={breakdown}
            reviews={reviews}
            isLoggedIn={!!user}
          />
        </div>

        {related.length ? (
          <section className="mt-16 border-t pt-14 md:mt-24 md:pt-20" aria-label="You may also like">
            <SectionHeading eyebrow="Complete the ritual" title="You may also like" link={{ label: `More ${product.category.name.toLowerCase()}`, href: `/category/${product.category.slug}` }} />
            <ProductGrid products={related} />
          </section>
        ) : null}
      </div>
      {/* Keeps the footer clear of the sticky mobile add-to-bag bar. */}
      <div className="h-20 md:hidden" aria-hidden />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
