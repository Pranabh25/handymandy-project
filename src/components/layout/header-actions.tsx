"use client";

import Link from "next/link";
import { Heart, ShoppingBag, User } from "lucide-react";
import { useCartCount, useCartState } from "@/hooks/use-cart";
import { useCurrentUser } from "@/components/providers/store-provider";

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-terracotta px-1 text-[0.625rem] leading-4.5 font-semibold text-white tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
}

const iconLink =
  "relative inline-flex size-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function HeaderActions() {
  const count = useCartCount();
  const { wishlist } = useCartState();
  const user = useCurrentUser();
  const accountHref = user ? (user.role === "ADMIN" ? "/admin" : "/account") : "/login";

  return (
    <div className="flex items-center gap-0.5">
      <Link href={accountHref} className={iconLink} aria-label={user ? "Your account" : "Log in"}>
        <User className="size-5" strokeWidth={1.6} />
      </Link>
      <Link href="/wishlist" className={`${iconLink} hidden sm:inline-flex`} aria-label={`Wishlist, ${wishlist.length} items`}>
        <Heart className="size-5" strokeWidth={1.6} />
        <CountBadge count={wishlist.length} />
      </Link>
      <Link href="/cart" className={iconLink} aria-label={`Shopping bag, ${count} items`}>
        <ShoppingBag className="size-5" strokeWidth={1.6} />
        <CountBadge count={count} />
      </Link>
    </div>
  );
}
