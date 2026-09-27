import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { siteConfig } from "@/config/site";

export type LegalSection = { id: string; title: string; content: React.ReactNode };

type Props = {
  title: string;
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
};

/** Shared layout for policy pages: title, last-updated date, sticky table of contents, .prose-legal body. */
export function LegalPage({ title, summary, lastUpdated, sections }: Props) {
  const toc = (
    <ol className="space-y-1 text-sm">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-2 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-sand/60 hover:text-foreground"
          >
            <span className="w-5 shrink-0 text-right tabular-nums opacity-60">{i + 1}.</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ label: title }]} />
      <header className="mt-6 max-w-3xl border-b pb-8">
        <p className="eyebrow mb-3">Policies</p>
        <h1 className="text-4xl leading-[1.1] font-semibold text-balance md:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{summary}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Last updated: <time>{lastUpdated}</time>
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <details className="group rounded-xl border bg-card lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
              On this page
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <nav aria-label="On this page (mobile)" className="border-t px-2 py-2">
              {toc}
            </nav>
          </details>
          <nav aria-label="On this page" className="hidden lg:block">
            <p className="eyebrow mb-3 px-2">On this page</p>
            {toc}
          </nav>
        </aside>

        <article className="prose-legal max-w-3xl min-w-0 [&_a]:text-terracotta [&_a]:underline [&_a]:underline-offset-3 [&_a:hover]:text-accent-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 first:[&>h2]:mt-0">
              <h2 id={`${s.id}-h`}>
                {i + 1}. {s.title}
              </h2>
              {s.content}
            </section>
          ))}

          <div className="mt-12 rounded-xl border bg-card p-5 text-sm">
            <p className="font-medium text-foreground!">Questions about this policy?</p>
            <p className="mt-1">
              Write to{" "}
              <a href={`mailto:${siteConfig.supportEmail}`} className="text-terracotta underline underline-offset-3">
                {siteConfig.supportEmail}
              </a>{" "}
              or reach us through our{" "}
              <Link href="/contact" className="text-terracotta underline underline-offset-3">
                Contact page
              </Link>
              . {siteConfig.legalName}, {siteConfig.address}.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

/** Grievance officer block, required under the IT Rules 2021, Consumer Protection (E-Commerce) Rules 2020 and DPDP Act 2023. */
export const GRIEVANCE_OFFICER = {
  name: "Ms. Kavya Raghunathan",
  designation: "Grievance Officer & Data Protection Contact",
  email: "grievance@lushaura.in",
  phone: "+91 80 4718 2291",
  hours: "Monday to Friday, 10 am – 6 pm IST",
} as const;

export function GrievanceOfficer() {
  const g = GRIEVANCE_OFFICER;
  return (
    <div className="my-4 rounded-xl border bg-card p-5 text-sm leading-7">
      <p className="font-semibold text-foreground!">{g.name}</p>
      <p>{g.designation}</p>
      <p>{siteConfig.legalName}</p>
      <p>{siteConfig.address}</p>
      <p>
        Email:{" "}
        <a href={`mailto:${g.email}`} className="text-terracotta underline underline-offset-3">
          {g.email}
        </a>
      </p>
      <p>Phone: {g.phone}</p>
      <p>Available: {g.hours}</p>
    </div>
  );
}

export const LEGAL_LAST_UPDATED = "1 September 2026";
