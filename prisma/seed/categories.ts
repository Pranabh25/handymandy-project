import type { CategoryGroup } from "../../src/generated/prisma/enums";

export type SeedCategory = {
  slug: string;
  name: string;
  group: CategoryGroup;
  tagline: string;
  description: string;
  sortOrder: number;
};

/** Category slugs are referenced by nav, footer and landing pages — do not rename. */
export const categories: SeedCategory[] = [
  {
    slug: "gift-hampers",
    name: "Gift Hampers",
    group: "GIFTS",
    tagline: "Curated boxes, packed by hand",
    description:
      "Thoughtfully assembled hampers for festivals, milestones and everyday thank-yous. Every box is packed by hand in Bengaluru and finished with a handwritten note.",
    sortOrder: 1,
  },
  {
    slug: "personalised-gifts",
    name: "Personalised Gifts",
    group: "GIFTS",
    tagline: "Made with their name on it",
    description:
      "Engraved, embossed and hand-lettered keepsakes crafted to order. Add a name, a date or a short message and we'll make it theirs.",
    sortOrder: 2,
  },
  {
    slug: "festive-gifts",
    name: "Festive Gifts",
    group: "GIFTS",
    tagline: "For Diwali, Rakhi and every celebration in between",
    description:
      "Diyas, thalis, urlis and festive tins made with artisan partners across India. Easy to gift, lovely to keep.",
    sortOrder: 3,
  },
  {
    slug: "home-fragrance",
    name: "Home Fragrance",
    group: "GIFTS",
    tagline: "Scents that feel like home",
    description:
      "Soy candles, reed diffusers and room mists inspired by Indian gardens and temple mornings. Clean-burning and hand-poured in small batches.",
    sortOrder: 4,
  },
  {
    slug: "skincare",
    name: "Skincare",
    group: "COSMETICS",
    tagline: "Ayurveda-inspired, science-backed",
    description:
      "Face oils, serums and packs that pair heritage ingredients like kumkumadi and saffron with proven actives. Dermatologically tested and made for Indian skin and weather.",
    sortOrder: 5,
  },
  {
    slug: "makeup",
    name: "Makeup",
    group: "COSMETICS",
    tagline: "Shades made for Indian skin tones",
    description:
      "Lipsticks, kajal and skin tints designed around warm and deep undertones. Long-wearing, comfortable and free from parabens.",
    sortOrder: 6,
  },
  {
    slug: "fragrance",
    name: "Fragrance",
    group: "COSMETICS",
    tagline: "Modern perfumes with an Indian soul",
    description:
      "Eau de parfums and attars built around vetiver, mogra, sandalwood and oud. Blended in small batches with IFRA-compliant oils.",
    sortOrder: 7,
  },
  {
    slug: "bath-body",
    name: "Bath & Body",
    group: "COSMETICS",
    tagline: "Everyday rituals, done slowly",
    description:
      "Body balms, hair oils, scrubs and bathing bars made with kokum, coconut and cold-pressed oils. Gentle enough for the whole family.",
    sortOrder: 8,
  },
];
