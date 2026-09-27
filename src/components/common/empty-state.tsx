import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
  children?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action, className, children }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-sand">
        <Icon className="size-7 text-terracotta" strokeWidth={1.5} aria-hidden />
      </div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p> : null}
      {action ? (
        <Link href={action.href} className={cn(buttonVariants(), "mt-6")}>
          {action.label}
        </Link>
      ) : null}
      {children}
    </div>
  );
}
