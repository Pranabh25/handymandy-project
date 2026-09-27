import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { media } from "@/config/media";

export function FestiveBanner() {
  return (
    <section aria-labelledby="festive-title" className="container-page py-16 md:py-24">
      <div className="grid overflow-hidden rounded-[1.75rem] bg-charcoal text-ivory md:grid-cols-2">
        <div className="relative aspect-[4/3] md:order-2 md:aspect-auto md:min-h-[28rem]">
          <Image src={media.festive.src} alt={media.festive.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-16">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-rose uppercase">The Festive Hamper Edit</p>
          <h2 id="festive-title" className="mt-4 text-4xl leading-[1.05] font-semibold text-balance md:text-5xl">
            Light up Diwali with gifts that <em className="font-medium text-rose">glow</em>.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-ivory/75 md:text-base">
            Hand-packed hampers with kaju katli, brass diyas, soy candles and our Kumkumadi glow oil — gift-wrapped and ready to give.
            Bulk and corporate orders welcome.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ivory/85">
            <li>· Complimentary handwritten note</li>
            <li>· Pan-India delivery in 3–5 days</li>
            <li>· Custom branding on orders of 25+</li>
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/category/gift-hampers" className={buttonVariants({ size: "lg", className: "bg-ivory text-charcoal hover:bg-ivory/90" })}>
              Explore hampers
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/shop?occasion=Corporate"
              className={buttonVariants({ size: "lg", variant: "outline", className: "border-ivory/30 bg-transparent text-ivory hover:bg-ivory/10 hover:text-ivory" })}
            >
              Corporate gifting
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
