/**
 * Marketing imagery (hero, banners, category tiles, editorial blocks).
 *
 * These are temporary, unbranded Unsplash photos for the demo. To use brand
 * photography, drop files into /public/brand and change the `src` values here
 * (e.g. src: "/brand/hero.jpg"). Nothing else needs to change.
 *
 * Product images are NOT configured here — they are uploaded per product from
 * Admin → Products and stored in the database.
 */

const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type MediaAsset = { src: string; alt: string };

export const media = {
  hero: {
    src: unsplash("1608571423902-eed4a5ad8108", 1800),
    alt: "Amber glass serum bottle on a wooden stand in soft afternoon light",
  },
  heroSecondary: {
    src: unsplash("1512909006721-3d6018887383", 1200),
    alt: "Hands holding a kraft-paper wrapped gift tied with twine",
  },
  festive: {
    src: unsplash("1607344645866-009c320b63e0", 1800),
    alt: "Rows of black gift boxes tied with gold satin bows",
  },
  story: {
    src: unsplash("1599305090598-fe179d501227", 1400),
    alt: "An open jar of body butter on a sunlit wooden table",
  },
  craft: {
    src: unsplash("1605651202774-7d573fd3f12d", 1400),
    alt: "A lit soy candle on a rustic wooden surface",
  },
  categories: {
    gifts: { src: unsplash("1512909006721-3d6018887383", 900), alt: "Wrapped gift held in hands" },
    cosmetics: { src: unsplash("1596462502278-27bfdc403348", 900), alt: "Makeup brushes and cosmetics on a beige backdrop" },
    "gift-hampers": { src: unsplash("1607344645866-009c320b63e0", 900), alt: "Gift boxes with gold ribbons" },
    "personalised-gifts": { src: unsplash("1602874801007-bd458bb1b8b6", 900), alt: "A glowing candle in a cosy setting" },
    "home-fragrance": { src: unsplash("1605651202774-7d573fd3f12d", 900), alt: "Soy candle on wood" },
    skincare: { src: unsplash("1600428877878-1a0fd85beda8", 900), alt: "Face serum with a rose quartz roller" },
    makeup: { src: unsplash("1617897903246-719242758050", 900), alt: "Portrait with a classic red lip" },
    fragrance: { src: unsplash("1629198688000-71f23e745b6e", 900), alt: "Perfume oil with eucalyptus leaves" },
    "bath-body": { src: unsplash("1607006344380-b6775a0824a7", 900), alt: "A stack of handmade soaps" },
    "festive-gifts": { src: unsplash("1607344645866-009c320b63e0", 900), alt: "Festive gift boxes with gold bows" },
  } as Record<string, MediaAsset>,
  occasions: {
    Diwali: { src: unsplash("1607344645866-009c320b63e0", 700), alt: "Festive gift boxes" },
    Birthday: { src: unsplash("1577998474517-7eeeed4e448a", 700), alt: "Birthday cake with a sparkler" },
    Wedding: { src: unsplash("1602874801007-bd458bb1b8b6", 700), alt: "Candlelight" },
    "Self-care": { src: unsplash("1599305090598-fe179d501227", 700), alt: "Body butter jar in sunlight" },
  } as Record<string, MediaAsset>,
} as const;

/** Hostnames next/image may load marketing media from (mirrored in next.config.ts). */
export const REMOTE_IMAGE_HOSTS = ["images.unsplash.com"];
