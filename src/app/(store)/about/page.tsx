import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { HamperProcess, NumbersStrip, ValuesGrid } from "@/components/content/about-sections";
import { buttonVariants } from "@/components/ui/button";
import { media } from "@/config/media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "LushAura began in a Bengaluru kitchen in 2021. Meet the founders, the 40+ Indian artisans we work with, and the clean, Ayurveda-inspired beauty and gifts we make together.",
  alternates: { canonical: "/about" },
  openGraph: { title: "Our Story | LushAura", images: [{ url: media.story.src, alt: media.story.alt }] },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="container-page pt-8 pb-16 md:pt-10 md:pb-24">
        <Breadcrumbs items={[{ label: "Our Story" }]} />
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-4">Our story</p>
            <h1 className="text-4xl leading-[1.05] font-semibold text-balance md:text-6xl">
              Gifts with a story, <em className="font-medium text-terracotta">beauty with a conscience.</em>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              LushAura is a Bengaluru-based gifting and clean-beauty house. We bring together India&apos;s small-batch
              makers and time-honoured Ayurvedic rituals, and package them into gifts that feel personal — whether
              they&apos;re for Diwali, a wedding or simply for you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className={buttonVariants({ size: "lg" })}>
                Explore the collection
              </Link>
              <Link href="/category/gift-hampers" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Shop hampers
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={media.story.src}
              alt={media.story.alt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Founders */}
      <section aria-labelledby="founders-heading" className="border-y bg-card">
        <div className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-3">How it began</p>
            <h2 id="founders-heading" className="text-3xl leading-tight font-semibold md:text-4xl">
              A kitchen table in Indiranagar, and a very long list of aunties to gift.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-muted-foreground">
            <p>
              In the winter of 2021, <strong className="font-semibold text-foreground">Meera Iyer</strong>, a former
              cosmetic chemist, and <strong className="font-semibold text-foreground">Rohan Kapoor</strong>, who had spent
              a decade sourcing textiles from artisan clusters, set out to find a Diwali gift that wasn&apos;t a box of dry
              fruits or a plastic-wrapped hamper. They couldn&apos;t find one — so they made forty by hand.
            </p>
            <p>
              Meera brewed a kumkumadi face oil from her grandmother&apos;s recipe in Mysuru. Rohan paired it with
              block-printed pouches from Bagru and hand-thrown clay diyas from Khurja. Friends asked for more, and then their
              friends did too.
            </p>
            <p>
              Today, LushAura works with more than 40 artisan partners and two licensed skincare labs in Karnataka and
              Kerala. Our team of 22 still hand-packs every order in Bengaluru, and still believes a gift should say
              something about both the giver and the maker.
            </p>
            <figure className="mt-8 border-l-2 border-terracotta pl-5">
              <blockquote className="font-display text-2xl leading-snug text-foreground italic">
                &ldquo;We want every box to feel like it was packed by someone who knows you — because it was.&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-sm">— Meera Iyer &amp; Rohan Kapoor, co-founders</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section aria-labelledby="mission-heading" className="container-page py-16 text-center md:py-24">
        <p className="eyebrow mb-4">Our mission</p>
        <h2 id="mission-heading" className="mx-auto max-w-3xl text-3xl leading-tight font-semibold text-balance md:text-5xl">
          To make thoughtful, sustainable gifting the easy choice — and to keep India&apos;s crafts in daily use.
        </h2>
      </section>

      <NumbersStrip />
      <ValuesGrid />
      <HamperProcess image={media.craft} />

      {/* CTA */}
      <section className="container-page py-16 md:py-24">
        <div className="relative overflow-hidden rounded-xl bg-charcoal text-ivory">
          <Image
            src={media.festive.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="relative px-6 py-14 text-center md:px-12 md:py-20">
            <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-rose uppercase">Made in India, made to be given</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl leading-tight font-semibold md:text-5xl">
              Find something they&apos;ll remember.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-ivory/75 md:text-base">
              Handcrafted hampers, personalised keepsakes and clean skincare — gift-wrapped with a handwritten note.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/gifts" className={cn(buttonVariants({ size: "lg" }), "bg-ivory text-charcoal hover:bg-ivory/90")}>
                Shop gifts
                <ArrowRight aria-hidden />
              </Link>
              <Link
                href="/cosmetics"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-ivory/40 bg-transparent text-ivory hover:bg-ivory/10 hover:text-ivory")}
              >
                Shop beauty
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
