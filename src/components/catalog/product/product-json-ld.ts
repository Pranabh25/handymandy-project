import { siteConfig } from "@/config/site";
import type { ProductDetail } from "@/server/catalog";

/** schema.org Product structured data for the PDP. */
export function productJsonLd(product: ProductDetail) {
  const url = `${siteConfig.url}/product/${product.slug}`;
  const images = product.images.map((i) => (i.url.startsWith("http") ? i.url : `${siteConfig.url}${i.url}`));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    url,
    ...(images.length ? { image: images } : {}),
    category: product.category.name,
    brand: { "@type": "Brand", name: siteConfig.name },
    countryOfOrigin: product.countryOfOrigin,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.rating.toFixed(1)),
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}
