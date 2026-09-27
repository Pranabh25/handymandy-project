"use client";

import Link from "next/link";
import { ArrowRight, Lock, ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { useCurrentUser, useStoreSettings } from "@/components/providers/store-provider";
import { useCartState } from "@/hooks/use-cart";
import { calculateTotals } from "@/lib/pricing";
import { formatINR, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AvailableCoupon } from "@/server/actions/cart";
import { CartLineItem } from "./cart-line-item";
import { CouponBox } from "./coupon-box";
import { FreeShippingProgress } from "./free-shipping-progress";
import { GiftOptions } from "./gift-options";
import { PriceSummary } from "./price-summary";
import { TrustNotes } from "./trust-notes";
import { useAppliedCoupon } from "./use-applied-coupon";
import { useCartRefresh } from "./use-cart-refresh";
import { CartSkeleton } from "./cart-skeleton";

export function CartView({ coupons }: { coupons: AvailableCoupon[] }) {
  const cart = useCartState();
  const settings = useStoreSettings();
  const user = useCurrentUser();
  const { hydrated, refreshed, products } = useCartRefresh();

  const baseSubtotal = cart.lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const applied = useAppliedCoupon(cart.couponCode, baseSubtotal);
  const totals = calculateTotals(cart.lines, settings, { coupon: applied.coupon, giftWrap: cart.giftWrap });

  if (!hydrated) return <CartSkeleton />;

  if (!cart.lines.length) {
    return (
      <div className="container-page py-10 md:py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Hampers for every celebration and clean beauty for everyday rituals — find something you'll love to give, or keep."
        >
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/gifts" className={buttonVariants()}>
              Shop gifts
            </Link>
            <Link href="/cosmetics" className={buttonVariants({ variant: "outline" })}>
              Shop cosmetics
            </Link>
          </div>
          {cart.wishlist.length ? (
            <Link href="/wishlist" className="mt-5 text-sm font-medium underline underline-offset-4">
              View your wishlist ({cart.wishlist.length})
            </Link>
          ) : null}
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-page pt-8 pb-32 md:pt-12 lg:pb-20">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="eyebrow">Shopping bag</p>
          <h1 className="mt-1.5 text-3xl font-semibold md:text-4xl">Your bag</h1>
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {pluralize(totals.itemCount, "item")}
          {!refreshed ? <span className="ml-2 text-xs">· Checking latest prices…</span> : null}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="space-y-6">
          <FreeShippingProgress remaining={totals.freeShippingRemaining} threshold={settings.freeShippingThreshold} />

          <section aria-label="Items in your bag">
            <ul className="divide-y border-y">
              {cart.lines.map((line) => (
                <CartLineItem key={line.productId} line={line} product={products[line.productId]} allLines={cart.lines} />
              ))}
            </ul>
          </section>

          <GiftOptions giftWrap={cart.giftWrap} giftMessage={cart.giftMessage} />

          <Link href="/shop" className="inline-flex text-sm font-medium underline-offset-4 hover:underline">
            ← Continue shopping
          </Link>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start" aria-label="Order summary">
          <CouponBox appliedCode={cart.couponCode} applied={applied} subtotal={baseSubtotal} available={coupons} />

          <div className="rounded-xl border bg-card p-5 shadow-soft">
            <h2 className="mb-4 text-xl font-semibold">Order summary</h2>
            <PriceSummary totals={totals} couponCode={applied.coupon ? cart.couponCode : null} />
            <Link
              href="/checkout"
              className={cn(buttonVariants({ size: "lg" }), "mt-5 hidden w-full lg:inline-flex")}
            >
              <Lock className="size-4" aria-hidden />
              Proceed to checkout
            </Link>
            <p className="mt-3 hidden text-center text-xs text-muted-foreground lg:block">
              {user ? "Delivery charges and COD fee (if any) are confirmed at checkout." : "You'll sign in with a one-time password on the next step."}
            </p>
          </div>

          <div className="rounded-xl border border-dashed p-4">
            <TrustNotes />
          </div>
        </aside>
      </div>

      {/* Sticky mobile summary + CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lift backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-lg leading-tight font-semibold tabular-nums">{formatINR(totals.total)}</p>
            <p className="truncate text-xs text-sage">
              {totals.productSavings + totals.couponDiscount > 0
                ? `You save ${formatINR(totals.productSavings + totals.couponDiscount)}`
                : totals.shippingFee === 0
                  ? "Free shipping"
                  : `${pluralize(totals.itemCount, "item")}`}
            </p>
          </div>
          <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "flex-1 px-4")}>
            Checkout
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
