"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cartActions, useCartState, MAX_QTY_PER_LINE } from "@/hooks/use-cart";
import type { ProductSummary } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  product: ProductSummary;
  quantity?: number;
  size?: "sm" | "default" | "lg";
  className?: string;
  label?: string;
};

export function AddToCartButton({ product, quantity = 1, size = "default", className, label = "Add to bag" }: Props) {
  const router = useRouter();
  const { lines } = useCartState();
  const inCart = lines.find((l) => l.productId === product.id)?.quantity ?? 0;
  const outOfStock = product.stock <= 0;
  const maxed = inCart >= Math.min(MAX_QTY_PER_LINE, product.stock);

  return (
    <Button
      type="button"
      size={size}
      disabled={outOfStock}
      className={cn("w-full", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (maxed) {
          toast.info("You've added the maximum available quantity", { description: product.name });
          return;
        }
        cartActions.add(product, quantity);
        toast.success("Added to your bag", {
          description: product.name,
          action: { label: "View bag", onClick: () => router.push("/cart") },
        });
      }}
    >
      {!outOfStock ? <ShoppingBag className="size-4" aria-hidden /> : null}
      {outOfStock ? "Out of stock" : label}
    </Button>
  );
}
