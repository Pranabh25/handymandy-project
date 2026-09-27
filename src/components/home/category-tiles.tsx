import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { media } from "@/config/media";

type Category = { slug: string; name: string; tagline: string | null; _count: { products: number } };

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  return (
    <section aria-label="Shop by category" className="container-page py-16 md:py-24">
      <SectionHeading eyebrow="Shop by category" title="Something for every ritual" link={{ label: "Shop all", href: "/shop" }} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-6">
        {categories.map((c) => {
          const img = media.categories[c.slug];
          return (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`} className="group block rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand">
                  {img ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="font-display text-xl font-semibold md:text-2xl">{c.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{c._count.products}</span>
                </div>
                {c.tagline ? <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.tagline}</p> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
