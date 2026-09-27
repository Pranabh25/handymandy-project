import Image from "next/image";
import { HandHeart, Leaf, PackageOpen, Rabbit, Sprout, Users } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import type { MediaAsset } from "@/config/media";

export const VALUES = [
  {
    icon: Users,
    title: "Small-batch Indian makers",
    body: "Every candle, block-printed pouch and brass diya comes from a workshop we have visited ourselves — from Jaipur and Khurja to Channapatna and Kutch.",
  },
  {
    icon: Sprout,
    title: "Clean ingredients",
    body: "Ayurveda-inspired formulas with kumkumadi, saffron, turmeric and cold-pressed oils. No parabens, sulphates, mineral oil or synthetic dyes — ever.",
  },
  {
    icon: Rabbit,
    title: "Cruelty-free, always",
    body: "Nothing we make or sell is tested on animals, at any stage. Most of our range is vegan, and anything that isn't is clearly labelled.",
  },
  {
    icon: PackageOpen,
    title: "Plastic-conscious packaging",
    body: "Recycled kraft cartons, paper tape, honeycomb paper and reusable keepsake boxes. Around 92% of our packaging by weight is recyclable or compostable.",
  },
  {
    icon: HandHeart,
    title: "Fair pay to artisans",
    body: "We agree prices with makers before we design a product, pay 50% upfront and settle the rest within 15 days — so no one waits on our sales to be paid.",
  },
  {
    icon: Leaf,
    title: "Gifts that get used",
    body: "We curate for the person, not the shelf. Every hamper is built around things people actually finish, refill or keep for years.",
  },
] as const;

export const PROCESS = [
  {
    step: "01",
    title: "Sourced from the makers",
    body: "We work with 40+ artisan partners and two licensed skincare labs in Karnataka and Kerala, placing small orders often so stock is always fresh.",
  },
  {
    step: "02",
    title: "Curated around a person",
    body: "Our team pairs textures, scents and colours so each hamper feels considered — a calming evening ritual, a festive table, a new-mum care kit.",
  },
  {
    step: "03",
    title: "Hand-packed in Bengaluru",
    body: "Each box is packed by hand at our Indiranagar studio with honeycomb paper, dried flowers and a cotton ribbon. No plastic fillers.",
  },
  {
    step: "04",
    title: "A note, written by hand",
    body: "Add a message at checkout and one of our team writes it out on seed paper — which your recipient can plant once the gift is opened.",
  },
] as const;

export const NUMBERS = [
  { value: "40+", label: "Artisan partners" },
  { value: "18,000+", label: "Gifts delivered" },
  { value: "26", label: "States reached" },
  { value: "4.8★", label: "Average rating" },
] as const;

export function ValuesGrid() {
  return (
    <section aria-label="Our values" className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="What we stand for"
        title="Six promises we keep"
        description="They shape every product we develop and every maker we work with."
        align="center"
      />
      <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, body }) => (
          <li key={title} className="bg-card p-6 md:p-8">
            <Icon className="size-6 text-terracotta" strokeWidth={1.5} aria-hidden />
            <h3 className="mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HamperProcess({ image }: { image: MediaAsset }) {
  return (
    <section aria-labelledby="process-heading" className="bg-sand/50">
      <div className="container-page grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-soft">
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow mb-3">From workshop to doorstep</p>
          <h2 id="process-heading" className="text-3xl leading-tight font-semibold md:text-4xl">
            How a LushAura hamper is made
          </h2>
          <ol className="mt-8 space-y-7">
            {PROCESS.map((p) => (
              <li key={p.step} className="flex gap-5">
                <span className="font-display text-3xl leading-none text-terracotta/80 italic" aria-hidden>
                  {p.step}
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function NumbersStrip() {
  return (
    <section aria-label="LushAura in numbers" className="bg-charcoal text-ivory">
      <dl className="container-page grid grid-cols-2 gap-y-10 py-14 text-center md:grid-cols-4">
        {NUMBERS.map((n) => (
          <div key={n.label} className="flex flex-col-reverse gap-1">
            <dt className="text-xs tracking-[0.18em] text-ivory/60 uppercase">{n.label}</dt>
            <dd className="font-display text-4xl font-medium md:text-5xl">{n.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
