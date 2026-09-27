import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { ContactForm } from "@/components/content/contact-form";
import { getStoreSettings } from "@/server/settings";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about an order, a hamper for your team or an ingredient? Write to the LushAura care team in Bengaluru — we reply within one working day.",
  alternates: { canonical: "/contact" },
};

const digits = (v: string) => v.replace(/\D/g, "");

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [settings, sp] = await Promise.all([getStoreSettings(), searchParams]);
  const subject = typeof sp.subject === "string" ? sp.subject : undefined;
  const whatsapp = settings.whatsappNumber ?? siteConfig.whatsapp;

  const cards = [
    {
      icon: Mail,
      label: "Email",
      value: settings.supportEmail,
      href: `mailto:${settings.supportEmail}`,
      note: "Replies within one working day",
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings.supportPhone,
      href: `tel:+${digits(settings.supportPhone)}`,
      note: "Order help & returns",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/${digits(whatsapp)}`,
      note: "Quickest for order updates",
    },
    { icon: Clock, label: "Hours", value: siteConfig.supportHours, note: "Closed on Sundays & national holidays" },
  ];

  return (
    <>
      <PageHero
        eyebrow="We're here to help"
        title="Contact us"
        description="Whether it's a delayed parcel, a question about an ingredient or a hamper for 200 colleagues, a real person from our Bengaluru studio will get back to you."
        crumbs={[{ label: "Contact Us" }]}
      />

      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <section aria-labelledby="contact-form-heading" className="rounded-xl border bg-card p-5 shadow-soft sm:p-8">
          <h2 id="contact-form-heading" className="text-2xl font-semibold md:text-3xl">
            Send us a message
          </h2>
          <p className="mt-2 mb-7 text-sm leading-6 text-muted-foreground">
            For order questions, keep your order number handy — you&apos;ll find it in your confirmation email or under{" "}
            <Link href="/account/orders" className="underline underline-offset-3 hover:text-foreground">
              My Orders
            </Link>
            .
          </p>
          <ContactForm defaultSubject={subject} />
        </section>

        <aside className="space-y-6" aria-label="Other ways to reach us">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {cards.map(({ icon: Icon, label, value, href, note }) => (
              <li key={label} className="flex gap-4 rounded-xl border bg-card p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-terracotta-soft">
                  <Icon className="size-4.5 text-terracotta" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-0.5 block text-sm font-medium break-words hover:text-terracotta"
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm font-medium">{value}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-terracotta" aria-hidden />
              <h2 className="font-sans text-sm font-semibold">Registered office</h2>
            </div>
            <address className="mt-2 text-sm leading-6 text-muted-foreground not-italic">
              {siteConfig.legalName}
              <br />
              {settings.registeredAddress}
            </address>
            {settings.gstin ? <p className="mt-2 text-xs text-muted-foreground">GSTIN {settings.gstin}</p> : null}
          </div>

          <div className="rounded-xl bg-charcoal p-6 text-ivory">
            <Building2 className="size-5 text-rose" aria-hidden />
            <h2 className="mt-3 text-2xl font-semibold">Corporate gifting</h2>
            <p className="mt-2 text-sm leading-6 text-ivory/75">
              Diwali hampers, onboarding kits and client gifts from 25 to 2,500 boxes — with your logo on the sleeve, GST
              invoices and delivery to multiple addresses across India. Choose <em>Corporate gifting</em> in the form and
              we&apos;ll share a curated catalogue within 48 hours.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
