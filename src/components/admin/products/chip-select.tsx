"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Multi-select chips from a preset list, with an optional "add your own". */
export function ChipSelect({ label, options, value, onChange, allowCustom = true }: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  allowCustom?: boolean;
}) {
  const [custom, setCustom] = useState("");
  const all = Array.from(new Set([...options, ...value]));
  const toggle = (opt: string) => onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  const add = () => {
    const v = custom.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setCustom("");
  };
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {all.map((opt) => {
          const on = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(opt)}
              className={cn(
                "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                on ? "border-charcoal bg-charcoal text-ivory" : "bg-background hover:bg-muted",
              )}
            >
              {on ? <Check className="size-3" aria-hidden /> : null}
              {opt}
            </button>
          );
        })}
        {allowCustom ? (
          <span className="inline-flex h-8 items-center rounded-full border border-dashed bg-background pr-1 pl-3 focus-within:ring-3 focus-within:ring-ring/50">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              placeholder="Add other"
              aria-label={`Add another option to ${label}`}
              className="w-24 bg-transparent text-xs outline-none"
            />
            <button type="button" onClick={add} className="rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label={`Add to ${label}`}>
              <Plus className="size-3.5" />
            </button>
          </span>
        ) : null}
      </div>
    </fieldset>
  );
}
