"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPhone } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SavedAddress } from "@/server/actions/addresses";
import { AddressForm } from "./address-form";

type Props = {
  addresses: SavedAddress[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSaved: (address: SavedAddress) => void;
  onContinue: () => void;
  defaults: { fullName?: string; phone?: string };
};

const TYPE_LABEL = { HOME: "Home", WORK: "Work", OTHER: "Other" } as const;

export function formatAddressLines(a: Pick<SavedAddress, "line1" | "line2" | "landmark" | "city" | "state" | "pincode">) {
  return [a.line1, a.line2, a.landmark ? `Near ${a.landmark.replace(/^near\s+/i, "")}` : null, `${a.city}, ${a.state} ${a.pincode}`]
    .filter(Boolean)
    .join(", ");
}

export function AddressStep({ addresses, selectedId, onSelect, onSaved, onContinue, defaults }: Props) {
  const [mode, setMode] = useState<{ kind: "list" } | { kind: "new" } | { kind: "edit"; address: SavedAddress }>(
    addresses.length ? { kind: "list" } : { kind: "new" },
  );

  if (mode.kind !== "list") {
    return (
      <div>
        <h3 className="mb-4 font-sans text-sm font-semibold">
          {mode.kind === "edit" ? "Edit address" : addresses.length ? "Add a new address" : "Where should we deliver?"}
        </h3>
        <AddressForm
          initial={mode.kind === "edit" ? mode.address : null}
          defaults={defaults}
          submitLabel={mode.kind === "edit" ? "Update & deliver here" : "Save & deliver here"}
          onCancel={addresses.length ? () => setMode({ kind: "list" }) : undefined}
          onSaved={(a) => {
            onSaved(a);
            setMode({ kind: "list" });
            onContinue();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <fieldset>
        <legend className="sr-only">Choose a delivery address</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {addresses.map((a) => {
            const checked = a.id === selectedId;
            return (
              <label
                key={a.id}
                className={cn(
                  "relative flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                  checked ? "border-charcoal bg-ivory" : "border-border hover:border-input hover:bg-muted/40",
                )}
              >
                <input
                  type="radio"
                  name="checkout-address"
                  value={a.id}
                  checked={checked}
                  onChange={() => onSelect(a.id)}
                  className="mt-1 size-4 shrink-0 accent-charcoal"
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {a.fullName}
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
                      {TYPE_LABEL[a.type]}
                    </span>
                    {a.isDefault ? <span className="text-[0.7rem] font-medium text-sage">Default</span> : null}
                  </p>
                  <p className="mt-1.5 leading-5 text-muted-foreground">{formatAddressLines(a)}</p>
                  <p className="mt-1 text-muted-foreground">{formatPhone(a.phone)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode({ kind: "edit", address: a });
                  }}
                  className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  aria-label={`Edit address for ${a.fullName}`}
                >
                  <Pencil className="size-3.5" aria-hidden />
                </button>
              </label>
            );
          })}
          <button
            type="button"
            onClick={() => setMode({ kind: "new" })}
            className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-charcoal hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Plus className="size-5" aria-hidden />
            Add a new address
          </button>
        </div>
      </fieldset>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="button" size="lg" onClick={onContinue} disabled={!selectedId} className="w-full sm:w-auto">
          <MapPin className="size-4" aria-hidden />
          Deliver to this address
        </Button>
        {!selectedId ? <p className="text-xs text-muted-foreground">Select an address to continue</p> : null}
      </div>
    </div>
  );
}
