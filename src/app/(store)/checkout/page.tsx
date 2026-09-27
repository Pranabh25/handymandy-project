import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { estimatedDeliveryLabel } from "@/components/checkout/delivery";
import { getAvailableCoupons } from "@/server/actions/cart";
import type { SavedAddress } from "@/server/actions/addresses";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const [addresses, coupons] = await Promise.all([
    db.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        fullName: true,
        phone: true,
        line1: true,
        line2: true,
        landmark: true,
        city: true,
        state: true,
        pincode: true,
        type: true,
        isDefault: true,
      },
    }),
    getAvailableCoupons(),
  ]);

  return (
    <CheckoutFlow
      user={{ name: user.name, phone: user.phone, email: user.email }}
      addresses={addresses satisfies SavedAddress[]}
      coupons={coupons}
      deliveryLabel={estimatedDeliveryLabel()}
    />
  );
}
