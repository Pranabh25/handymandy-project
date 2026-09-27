import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WishlistView } from "@/components/catalog/wishlist-view";

export const metadata: Metadata = {
  title: "Your Wishlist",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <header className="mt-6 mb-8 border-b pb-6">
        <p className="eyebrow mb-2">Saved for later</p>
        <h1 className="text-4xl font-semibold md:text-5xl">Your wishlist</h1>
      </header>
      <WishlistView />
    </div>
  );
}
