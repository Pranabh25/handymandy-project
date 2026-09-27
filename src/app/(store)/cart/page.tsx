import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { getAvailableCoupons } from "@/server/actions/cart";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review the gifts and beauty essentials in your LushAura bag.",
  robots: { index: false },
};

export default async function CartPage() {
  const coupons = await getAvailableCoupons();
  return <CartView coupons={coupons} />;
}
