import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
};

/** Standard heading row for every admin page. */
export function AdminPageHeader({ title, description, back, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {back ? (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ChevronLeft className="size-3.5" aria-hidden /> {back.label}
          </Link>
        ) : null}
        <h1 className="font-sans text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** White card container used for admin tables and panels. */
export function AdminCard({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border bg-card shadow-soft ${className ?? ""}`}>
      {title ? (
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
          <h2 className="font-sans text-sm font-semibold">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
