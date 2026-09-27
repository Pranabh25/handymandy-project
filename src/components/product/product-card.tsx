import Link from "next/link";
import type { ProductSummary } from "@/types";
import { cn } from "@/lib/utils";
import { discountPercent } from "@/lib/format";
import { ProductImage } from "./product-image";
import { Price } from "./price";
import { RatingStars } from "./rating-stars";
import { WishlistButton } from "./wishlist-button";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product, priority, className }: { product: ProductSummary; priority?: boolean; className?: string }) {
  const off = discountPercent(product.price, product.mrp);
  const lowStock = product.stock > 0 && product.stock <= 5;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ProductImage
          src={product.image}
          alt={product.imageAlt ?? product.name}
          group={product.group}
          label={product.categoryName}
          priority={priority}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {product.isBestseller ? (
            <span className="rounded-full bg-charcoal px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-ivory uppercase">
              Bestseller
            </span>
          ) : product.isNew ? (
            <span className="rounded-full bg-card px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-charcoal uppercase shadow-soft">
              New
            </span>
          ) : null}
          {off >= 20 ? (
            <span className="rounded-full bg-terracotta px-2.5 py-1 text-[0.65rem] font-semibold text-white">{off}% off</span>
          ) : null}
        </div>
        {product.stock <= 0 ? (
          <div className="absolute inset-x-0 bottom-0 bg-card/90 py-2 text-center text-xs font-medium text-muted-foreground">
            Out of stock
          </div>
        ) : null}
      </Link>
      <WishlistButton product={product} className="absolute top-2.5 right-2.5" />

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">{product.categoryName}</p>
        <h3 className="mt-1 line-clamp-2 font-sans text-sm leading-snug font-medium text-foreground">
          <Link href={`/product/${product.slug}`} className="hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        {product.reviewCount > 0 ? <RatingStars rating={product.rating} count={product.reviewCount} className="mt-1.5" /> : null}
        <Price price={product.price} mrp={product.mrp} size="sm" className="mt-2" />
        {lowStock ? <p className="mt-1 text-xs font-medium text-terracotta">Only {product.stock} left</p> : null}
        <div className="mt-auto pt-3">
          <AddToCartButton product={product} size="sm" className="rounded-lg" />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, className }: { products: ProductSummary[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6", className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6" aria-busy>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
