import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { media } from "@/config/media";

const FEATURED = [
  { name: "Diwali", note: "Hampers, diyas & mithai boxes" },
  { name: "Birthday", note: "Little luxuries they'll love" },
  { name: "Wedding", note: "Keepsakes for the big day" },
  { name: "Self-care", note: "Because you deserve it too" },
];
const MORE = ["Rakhi", "Anniversary", "Housewarming", "Corporate", "Thank You"];

const href = (occasion: string) => `/shop?occasion=${encodeURIComponent(occasion)}`;

export function OccasionTiles() {
  return (
    <section aria-label="Gifting for every occasion" className="bg-sand/50 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Gifting for every occasion"
          title="Find the right gift, for the right moment"
          description="From Diwali to a quiet thank-you — gifts chosen, packed and delivered with a handwritten note."
        />
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {FEATURED.map((o) => {
            const img = media.occasions[o.name];
            return (
              <li key={o.name}>
                <Link
                  href={href(o.name)}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {img ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : null}
                  <div className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-card/95 p-3 shadow-soft sm:inset-x-3 sm:bottom-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-xl font-semibold sm:text-2xl">{o.name}</span>
                      <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </div>
                    <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{o.note}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="text-sm font-medium">More occasions</p>
          <ul className="flex flex-wrap gap-2">
            {MORE.map((o) => (
              <li key={o}>
                <Link href={href(o)} className="inline-flex h-9 items-center rounded-full border bg-card px-4 text-sm transition-colors hover:border-foreground/30">
                  {o}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
