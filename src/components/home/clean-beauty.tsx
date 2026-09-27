import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/product/product-card";
import type { ProductSummary } from "@/types";

const INGREDIENTS = [
  { name: "Kumkumadi", origin: "Ayurvedic elixir", benefit: "A 16-herb oil for radiance and even tone." },
  { name: "Saffron", origin: "Pampore, Kashmir", benefit: "Brightens dullness and softens pigmentation." },
  { name: "Niacinamide", origin: "Vitamin B3", benefit: "Refines pores and calms oily, stressed skin." },
  { name: "Rose", origin: "Kannauj rose water", benefit: "Hydrates, soothes and tones gently." },
  { name: "Turmeric", origin: "Lakadong, Meghalaya", benefit: "Antioxidant-rich, for a healthy glow." },
  { name: "Sandalwood", origin: "Mysuru", benefit: "Cooling and calming, with a warm scent." },
];

export function CleanBeauty({ products }: { products: ProductSummary[] }) {
  return (
    <section aria-label="Clean beauty" className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="Clean beauty, rooted in Ayurveda"
        title="Ingredients your nani would recognise"
        description="Time-honoured Indian botanicals paired with proven actives — cruelty-free, paraben-free and made for Indian skin and weather."
        link={{ label: "Shop beauty", href: "/cosmetics" }}
      />
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
        {INGREDIENTS.map((i) => (
          <li key={i.name} className="w-[70%] shrink-0 snap-start sm:w-auto">
            <Link
              href={`/search?q=${encodeURIComponent(i.name)}`}
              className="flex h-full flex-col rounded-xl border bg-card p-4 transition-shadow hover:shadow-soft focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-terracotta uppercase">{i.origin}</span>
              <span className="mt-2 font-display text-2xl font-semibold">{i.name}</span>
              <span className="mt-1.5 text-xs leading-5 text-muted-foreground">{i.benefit}</span>
            </Link>
          </li>
        ))}
      </ul>
      {products.length ? <ProductGrid products={products} className="mt-12" /> : null}
    </section>
  );
}
