import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { media } from "@/config/media";

export function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="border-t bg-card py-16 md:py-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-12 lg:gap-16">
        <div className="grid grid-cols-5 gap-4 md:col-span-7">
          <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
            <Image src={media.story.src} alt={media.story.alt} fill sizes="(min-width: 768px) 35vw, 60vw" className="object-cover" />
          </div>
          <div className="relative col-span-2 mt-12 aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
            <Image src={media.craft.src} alt={media.craft.alt} fill sizes="(min-width: 768px) 25vw, 40vw" className="object-cover" />
          </div>
        </div>
        <div className="md:col-span-5">
          <p className="eyebrow">Our story</p>
          <h2 id="story-title" className="mt-3 text-4xl leading-[1.05] font-semibold text-balance md:text-5xl">
            Rooted in craft, made with intention.
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
            LushAura began in a Bengaluru kitchen with a single batch of Kumkumadi oil and a basket of hand-poured candles for Diwali. Today we
            work with over 60 artisans and small-batch makers across India — from Kannauj attar distillers to Channapatna woodworkers.
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
            Everything we make is cruelty-free, thoughtfully packaged in recyclable materials, and priced fairly for the hands that make it.
          </p>
          <Link href="/about" className={buttonVariants({ variant: "outline", size: "lg", className: "mt-8" })}>
            Read our story
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
