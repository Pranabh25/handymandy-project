import { Breadcrumbs, type Crumb } from "@/components/common/breadcrumbs";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  className?: string;
  children?: React.ReactNode;
};

/** Quiet page header used by content pages (Contact, FAQ, legal). */
export function PageHero({ eyebrow, title, description, crumbs, className, children }: Props) {
  return (
    <section className={cn("border-b bg-sand/40", className)}>
      <div className="container-page py-10 md:py-14">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        <div className="mt-6 max-w-3xl">
          {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
          <h1 className="text-4xl leading-[1.1] font-semibold text-balance md:text-5xl">{title}</h1>
          {description ? <div className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{description}</div> : null}
          {children}
        </div>
      </div>
    </section>
  );
}
