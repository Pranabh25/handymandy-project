import Image from "next/image";
import Link from "next/link";
import { Gift, PenLine, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { media } from "@/config/media";

const POINTS = [
  { icon: PenLine, title: "Names & monograms", text: "Engraved, embossed or hand-lettered on candles, journals and keepsakes." },
  { icon: Gift, title: "Build-your-own hamper", text: "Pick their favourites — we'll pack it beautifully." },
  { icon: Sparkles, title: "A note in your words", text: "Every order can carry a handwritten message, free." },
];

export function PersonalisedCallout() {
  const img = media.categories["personalised-gifts"];
  return (
    <section aria-labelledby="personalised-title" className="bg-terracotta-soft/50 py-16 md:py-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-muted shadow-soft md:aspect-[4/5]">
          {img ? <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /> : null}
        </div>
        <div>
          <p className="eyebrow">Personalised gifts</p>
          <h2 id="personalised-title" className="mt-3 text-4xl leading-[1.05] font-semibold text-balance md:text-5xl">
            Made just for them — down to the <em className="font-medium text-terracotta">last letter</em>.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
            Add a name, a date or a little inside joke. Our studio in Jaipur personalises every piece by hand and confirms the details with
            you on WhatsApp before it ships.
          </p>
          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-soft">
                  <Icon className="size-4 text-terracotta" strokeWidth={1.7} aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-sm leading-6 text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/category/personalised-gifts" className={buttonVariants({ size: "lg", className: "mt-9" })}>
            Personalise a gift
          </Link>
        </div>
      </div>
    </section>
  );
}
