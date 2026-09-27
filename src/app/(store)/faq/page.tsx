import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { FaqAccordion } from "@/components/content/faq-accordion";
import { FAQ_GROUPS } from "@/components/content/faq-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers on payment, COD, shipping across India, gift wrapping, personalisation, cancellations, returns, refunds and our clean ingredients.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="Frequently asked questions"
        description="Everything you need to know about ordering, gifting and caring for your LushAura products."
        crumbs={[{ label: "FAQs" }]}
      />

      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-3">Topics</p>
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
            {FAQ_GROUPS.map((g) => (
              <li key={g.id} className="shrink-0">
                <a
                  href={`#${g.id}`}
                  className="block rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:border-charcoal/30 hover:text-foreground lg:rounded-lg lg:border-transparent lg:px-3 lg:py-2"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {FAQ_GROUPS.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-28">
              <h2 id={`${g.id}-title`} className="mb-4 text-2xl font-semibold md:text-3xl">
                {g.title}
              </h2>
              <FaqAccordion items={g.items} groupId={g.id} />
            </section>
          ))}

          <section className="flex flex-col items-start gap-5 rounded-xl bg-terracotta-soft/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-2xl font-semibold">Still have a question?</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Our care team replies within one working day, Monday to Saturday.
              </p>
            </div>
            <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
              <MessageCircle aria-hidden />
              Contact us
            </Link>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
