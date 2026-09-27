import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

type Chip = { label: string; href: string; active?: boolean };

type Props = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  image?: MediaAsset;
  crumbs: Crumb[];
  chips?: Chip[];
  chipsLabel?: string;
};

/** Editorial header for listing pages: breadcrumbs, serif title, copy, banner image, sub-category chips. */
export function ListingHeader({ eyebrow, title, description, image, crumbs, chips, chipsLabel = "Browse categories" }: Props) {
  return (
    <header className="border-b bg-sand/40">
      <div className="container-page py-6 md:py-10">
        <Breadcrumbs items={crumbs} />
        <div className={cn("mt-6 grid items-center gap-8", image && "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12")}>
          <div className="order-2 md:order-1">
            {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
            <h1 className="text-4xl leading-[1.05] font-semibold text-balance md:text-5xl lg:text-6xl">{title}</h1>
            {description ? (
              <p className="mt-4 max-w-xl text-sm leading-7 text-pretty text-muted-foreground md:text-base">{description}</p>
            ) : null}
            {chips?.length ? (
              <nav aria-label={chipsLabel} className="mt-7">
                <ul className="flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        aria-current={c.active ? "page" : undefined}
                        className={cn(
                          "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                          c.active ? "border-charcoal bg-charcoal text-ivory" : "bg-card hover:border-foreground/30",
                        )}
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
          {image ? (
            <div className="relative order-1 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-soft md:order-2 md:aspect-[5/4] lg:aspect-[16/11]">
              <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
