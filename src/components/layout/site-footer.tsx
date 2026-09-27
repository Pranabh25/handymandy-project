import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { NewsletterForm } from "./newsletter-form";

const PAYMENT_BADGES = ["UPI", "Visa", "Mastercard", "RuPay", "Net Banking", "COD"];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-charcoal text-ivory">
      <div className="container-page grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-16">
        <div>
          <p className="font-display text-3xl">
            Lush<span className="text-rose italic">Aura</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ivory/70">
            Thoughtful gifts and clean, Ayurveda-inspired beauty — handcrafted with small-batch makers across India.
          </p>
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Join the LushAura circle</p>
            <NewsletterForm />
          </div>
        </div>
        {(
          [
            ["Shop", footerNav.shop],
            ["Help", footerNav.help],
            ["Company", footerNav.company],
          ] as const
        ).map(([title, links]) => (
          <div key={title}>
            <p className="mb-4 text-[0.7rem] font-semibold tracking-[0.18em] text-ivory/60 uppercase">{title}</p>
            <ul className="space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ivory/80 transition-colors hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {title === "Company" ? (
              <div className="mt-6 space-y-1 text-sm text-ivory/70">
                <p>{siteConfig.supportEmail}</p>
                <p>{siteConfig.supportPhone}</p>
                <p className="text-xs text-ivory/50">{siteConfig.supportHours}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. GSTIN {siteConfig.gstin}. Demo storefront — no real orders are
            fulfilled.
          </p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Accepted payment methods">
            {PAYMENT_BADGES.map((b) => (
              <li key={b} className="rounded border border-ivory/15 px-2 py-0.5 text-[0.65rem] text-ivory/70">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
