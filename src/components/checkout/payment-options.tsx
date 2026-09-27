"use client";

import { Banknote, CreditCard, Landmark, Smartphone, Wallet, type LucideIcon } from "lucide-react";
import type { PaymentMethod } from "@/generated/prisma/enums";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export type PrepaidMethod = Exclude<PaymentMethod, "COD">;

export const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "UPI", label: "UPI", hint: "Google Pay, PhonePe, Paytm or any UPI app", icon: Smartphone },
  { value: "CARD", label: "Credit / Debit card", hint: "Visa, Mastercard, RuPay & Amex", icon: CreditCard },
  { value: "NETBANKING", label: "Net Banking", hint: "All major Indian banks", icon: Landmark },
  { value: "WALLET", label: "Wallets", hint: "Paytm, PhonePe & Amazon Pay wallets", icon: Wallet },
  { value: "COD", label: "Cash on Delivery", hint: "Pay in cash or UPI when your order arrives", icon: Banknote },
];

type Props = {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  codEnabled: boolean;
  codFee: number;
  disabled?: boolean;
};

export function PaymentOptions({ value, onChange, codEnabled, codFee, disabled }: Props) {
  const options = PAYMENT_OPTIONS.filter((o) => o.value !== "COD" || codEnabled);
  return (
    <fieldset disabled={disabled}>
      <legend className="sr-only">Choose a payment method</legend>
      <div className="divide-y overflow-hidden rounded-xl border">
        {options.map(({ value: v, label, hint, icon: Icon }) => {
          const checked = v === value;
          return (
            <label
              key={v}
              className={cn(
                "flex cursor-pointer items-center gap-3.5 px-4 py-3.5 transition-colors has-[:focus-visible]:bg-muted/60",
                checked ? "bg-ivory" : "hover:bg-muted/40",
              )}
            >
              <input
                type="radio"
                name="payment-method"
                value={v}
                checked={checked}
                onChange={() => onChange(v)}
                className="size-4 shrink-0 accent-charcoal"
              />
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  checked ? "bg-charcoal text-ivory" : "bg-muted text-charcoal",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-xs text-muted-foreground">
                  {hint}
                  {v === "COD" && codFee > 0 ? ` · ${formatINR(codFee)} handling fee` : ""}
                </span>
              </span>
              {v === "UPI" ? (
                <span className="hidden rounded-full bg-sage-soft px-2 py-0.5 text-[0.65rem] font-semibold text-sage sm:inline">
                  Fastest
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
