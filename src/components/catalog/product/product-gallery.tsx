"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

type Props = {
  images: { url: string; alt: string | null }[];
  name: string;
  group: "GIFTS" | "COSMETICS";
  categoryName: string;
  badges?: React.ReactNode;
};

/** Main image + thumbnail strip (vertical on desktop). Shows the branded placeholder when no photos exist. */
export function ProductGallery({ images, name, group, categoryName, badges }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-muted">
        <ProductImage
          key={current?.url ?? "placeholder"}
          src={current?.url ?? null}
          alt={current?.alt ?? name}
          group={group}
          label={categoryName}
          priority
          sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
          className="animate-in fade-in duration-300"
        />
        {badges ? <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">{badges}</div> : null}
        {images.length > 1 ? (
          <span className="absolute right-3 bottom-3 rounded-full bg-card/90 px-2.5 py-1 text-[0.7rem] font-medium tabular-nums shadow-soft lg:hidden">
            {active + 1} / {images.length}
          </span>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-2.5 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img.url} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "relative block aspect-[4/5] w-16 overflow-hidden rounded-lg bg-muted ring-offset-2 ring-offset-background transition focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:w-20",
                  i === active ? "ring-2 ring-charcoal" : "opacity-75 hover:opacity-100",
                )}
              >
                <ProductImage src={img.url} alt="" group={group} sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
