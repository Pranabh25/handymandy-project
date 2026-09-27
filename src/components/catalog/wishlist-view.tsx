"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { ProductImage } from "@/components/product/product-image";
import { Price } from "@/components/product/price";
import { RatingStars } from "@/components/product/rating-stars";
import { ProductGridSkeleton } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { cartActions, useCartHydrated, useCartState } from "@/hooks/use-cart";
import { pluralize } from "@/lib/format";
import type { ProductSummary } from "@/types";

function WishlistCard({ product }: { product: ProductSummary }) {
  const router = useRouter();
  const outOfStock = product.stock <= 0;
  return (
    <li className="flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ProductImage src={product.image} alt={product.imageAlt ?? product.name} group={product.group} label={product.categoryName} />
      </Link>
      <div className="flex flex-1 flex-col pt-3.5">
        <p className="text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">{product.categoryName}</p>
        <h2 className="mt-1 line-clamp-2 font-sans text-sm leading-snug font-medium">
          <Link href={`/product/${product.slug}`} className="hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h2>
        {product.reviewCount > 0 ? <RatingStars rating={product.rating} count={product.reviewCount} className="mt-1.5" /> : null}
        <Price price={product.price} mrp={product.mrp} size="sm" className="mt-2" />
        <div className="mt-auto flex gap-2 pt-3">
          <Button
            size="sm"
            className="flex-1"
            disabled={outOfStock}
            onClick={() => {
              cartActions.add(product, 1);
              cartActions.removeFromWishlist(product.id);
              toast.success("Moved to your bag", {
                description: product.name,
                action: { label: "View bag", onClick: () => router.push("/cart") },
              });
            }}
          >
            {outOfStock ? "Out of stock" : (
              <>
                <ShoppingBag className="size-3.5" aria-hidden /> Move to bag
              </>
            )}
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            className="size-9"
            aria-label={`Remove ${product.name} from wishlist`}
            onClick={() => {
              cartActions.removeFromWishlist(product.id);
              toast("Removed from wishlist", { description: product.name });
            }}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </li>
  );
}

export function WishlistView() {
  const hydrated = useCartHydrated();
  const { wishlist } = useCartState();

  if (!hydrated) return <ProductGridSkeleton count={4} />;

  if (!wishlist.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here — perfect for shortlisting gifts or planning your next beauty haul."
        action={{ label: "Start exploring", href: "/shop" }}
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
        {pluralize(wishlist.length, "item")} saved
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {wishlist.map((p) => (
          <WishlistCard key={p.id} product={p} />
        ))}
      </ul>
    </>
  );
}
