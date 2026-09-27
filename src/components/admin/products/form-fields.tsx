"use client";

import { cloneElement, isValidElement, useId } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/** Titled card grouping related fields in admin forms. */
export function FormSection({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border bg-card shadow-soft", className)} aria-labelledby={`sec-${title.replace(/\W+/g, "-")}`}>
      <div className="border-b px-5 py-3.5">
        <h2 id={`sec-${title.replace(/\W+/g, "-")}`} className="font-sans text-sm font-semibold">
          {title}
        </h2>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  hint?: React.ReactNode;
  className?: string;
  /** A single input-like element; receives id / aria-invalid / aria-describedby. */
  children: React.ReactElement<Record<string, unknown>>;
  optional?: boolean;
};

export function Field({ label, error, hint, className, children, optional }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;
  const describedBy = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(" ") || undefined;
  const control = isValidElement(children)
    ? cloneElement(children, { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })
    : children;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-sm font-medium">
        <span>{label}</span>
        {optional ? <span className="text-xs font-normal text-muted-foreground">Optional</span> : null}
      </label>
      {control}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Labelled on/off switch row. */
export function ToggleRow({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-1">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description ? <span className="block text-xs text-muted-foreground">{description}</span> : null}
      </span>
      <Switch checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} className="mt-0.5" />
    </label>
  );
}

export const textareaClass = "min-h-24";
