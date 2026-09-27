"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cartActions, useIsWishlisted } from "@/hooks/use-cart";
import type { ProductSummary } from "@/types";
import { cn } from "@/lib/utils";

export function WishlistButton({ product, className, withLabel }: { product: ProductSummary; className?: string; withLabel?: boolean }) {
  const router = useRouter();
  const active = useIsWishlisted(product.id);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = cartActions.toggleWishlist(product);
        toast(added ? "Saved to your wishlist" : "Removed from wishlist", {
          description: product.name,
          action: added ? { label: "View", onClick: () => router.push("/wishlist") } : undefined,
        });
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        withLabel ? "h-12 border border-input bg-card px-5 text-sm font-medium hover:bg-muted" : "size-9 bg-card/90 shadow-soft hover:bg-card",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-colors", active ? "fill-terracotta text-terracotta" : "text-charcoal")}
        strokeWidth={1.75}
        aria-hidden
      />
      {withLabel ? (active ? "Wishlisted" : "Wishlist") : null}
    </button>
  );
}
