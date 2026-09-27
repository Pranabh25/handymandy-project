import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchBox } from "@/components/layout/search-box";
import { buttonVariants } from "@/components/ui/button";

const SUGGESTED = [
  { label: "Gift hampers", href: "/category/gift-hampers" },
  { label: "Personalised gifts", href: "/category/personalised-gifts" },
  { label: "Skincare", href: "/category/skincare" },
  { label: "Makeup", href: "/category/makeup" },
  { label: "Fragrance", href: "/category/fragrance" },
];

const HELP = [
  { label: "Track an order", href: "/track" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact us", href: "/contact" },
];

/** Body of the branded 404, shared by the root and storefront not-found files. */
export function NotFoundContent() {
  return (
    <section className="container-page flex flex-col items-center py-16 text-center md:py-24">
      <p className="font-display text-[5.5rem] leading-none font-medium text-terracotta/80 italic md:text-[8rem]" aria-hidden>
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-balance md:text-5xl">This page seems to have been gifted away</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground md:text-base">
        The link may be old, or the product may no longer be available. Try a search, or start from one of our favourite
        collections.
      </p>

      <SearchBox className="mt-8 w-full max-w-md text-left" />

      <nav aria-label="Popular collections" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-2">
          {SUGGESTED.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="inline-flex rounded-full border bg-card px-4 py-1.5 text-sm transition-colors hover:border-charcoal/30 hover:bg-sand/60"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Back to home
        </Link>
        <Link href="/shop" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Shop all
          <ArrowRight aria-hidden />
        </Link>
      </div>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {HELP.map((h) => (
          <li key={h.href}>
            <Link href={h.href} className="underline-offset-4 hover:text-foreground hover:underline">
              {h.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
