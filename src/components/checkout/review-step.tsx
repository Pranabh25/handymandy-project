"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
import { CouponBox } from "@/components/cart/coupon-box";
import { GiftOptions } from "@/components/cart/gift-options";
import type { CartState } from "@/hooks/use-cart";
import { formatINR } from "@/lib/format";
import type { PricingCoupon } from "@/lib/pricing";
import type { SavedAddress } from "@/server/actions/addresses";
import type { AvailableCoupon } from "@/server/actions/cart";

type Props = {
  cart: CartState;
  applied: { coupon: PricingCoupon | null; description?: string; error?: string; checking: boolean };
  baseSubtotal: number;
  coupons: AvailableCoupon[];
  deliveryLabel: string;
  address: SavedAddress | null;
  onContinue: () => void;
};

export function ReviewStep({ cart, applied, baseSubtotal, coupons, deliveryLabel, address, onContinue }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-lg bg-sage-soft px-4 py-3 text-sm">
        <CalendarDays className="size-4 shrink-0 text-sage" aria-hidden />
        <p>
          Estimated delivery by <span className="font-semibold">{deliveryLabel}</span>
          {address ? (
            <span className="text-muted-foreground">
              {" "}
              to {address.city} {address.pincode}
            </span>
          ) : null}
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="font-sans text-sm font-semibold">Items</h3>
          <Link href="/cart" className="text-xs font-medium text-terracotta underline-offset-4 hover:underline">
            Edit bag
          </Link>
        </div>
        <ul className="divide-y rounded-xl border">
          {cart.lines.map((l) => (
            <li key={l.productId} className="flex items-center gap-3 px-3 py-3 sm:px-4">
              <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <ProductImage src={l.image} alt={l.name} sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  Qty {l.quantity}
                  {l.size ? ` · ${l.size}` : ""} · {formatINR(l.price)} each
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums">{formatINR(l.price * l.quantity)}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GiftOptions giftWrap={cart.giftWrap} giftMessage={cart.giftMessage} />
        <CouponBox appliedCode={cart.couponCode} applied={applied} subtotal={baseSubtotal} available={coupons} />
      </div>

      <Button type="button" size="lg" onClick={onContinue} className="w-full sm:w-auto">
        Continue to payment
      </Button>
    </div>
  );
}
