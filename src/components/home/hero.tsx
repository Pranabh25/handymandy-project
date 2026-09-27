import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { media } from "@/config/media";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-10 pt-8 pb-14 md:pt-12 md:pb-20 lg:grid-cols-12 lg:gap-12 lg:pt-16 lg:pb-24">
        <div className="lg:col-span-5">
          <p className="eyebrow">Handcrafted in India · Since 2019</p>
          <h1 id="hero-title" className="mt-5 text-[2.75rem] leading-[1.02] font-semibold text-balance sm:text-6xl lg:text-[4.25rem]">
            Thoughtful <em className="font-medium text-terracotta">gifts</em>, beauty rooted in{" "}
            <em className="font-medium text-terracotta">ritual</em>.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-pretty text-muted-foreground md:text-lg md:leading-8">
            Curated hampers, personalised keepsakes and clean, Ayurveda-inspired skincare — made in small batches and wrapped with care.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/gifts" className={buttonVariants({ size: "lg" })}>
              Shop Gifts
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/cosmetics" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Shop Beauty
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t pt-6">
            {[
              ["4.8★", "Average rating"],
              ["1.2 lakh+", "Happy gifters"],
              ["19,000+", "PIN codes served"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-semibold tabular-nums md:text-[1.7rem]">{value}</dd>
                <dd className="mt-0.5 text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-muted shadow-lift sm:aspect-[5/4] lg:aspect-[6/7] xl:aspect-[5/5]">
            <Image src={media.hero.src} alt={media.hero.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 left-4 hidden w-44 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-lift sm:block md:w-56 lg:-left-10">
            <div className="relative aspect-square">
              <Image src={media.heroSecondary.src} alt={media.heroSecondary.alt} fill sizes="224px" className="object-cover" />
            </div>
          </div>
          <Link
            href="/category/festive-gifts"
            className="absolute top-4 right-4 max-w-[15rem] rounded-xl bg-card/95 p-4 shadow-soft transition-shadow hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <p className="eyebrow">Now live</p>
            <p className="mt-1 font-display text-lg leading-snug font-semibold">The Festive Edit</p>
            <p className="mt-1 text-xs text-muted-foreground">Diwali hampers, diyas & more</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
