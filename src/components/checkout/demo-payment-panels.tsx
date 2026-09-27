"use client";

import { QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PrepaidMethod } from "./payment-options";

/**
 * Method-specific fields for the DEMO payment modal. These values stay in
 * component state only and are never sent to the server.
 */

export type PayDetails = {
  upiMode: "id" | "qr";
  upiId: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  bank: string;
  wallet: string;
};

export const emptyDetails: PayDetails = {
  upiMode: "id",
  upiId: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  cardName: "",
  bank: "",
  wallet: "",
};

export const TEST_CARD = { number: "4111 1111 1111 1111", expiry: "12/30", cvv: "123" };
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank"];
const WALLETS = ["Paytm Wallet", "PhonePe Wallet", "Amazon Pay Balance"];

function luhn(num: string) {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

export function validateDetails(method: PrepaidMethod, d: PayDetails): string | null {
  if (method === "UPI") {
    if (d.upiMode === "qr") return null;
    return /^[a-zA-Z0-9._-]{2,64}@[a-zA-Z]{2,32}$/.test(d.upiId.trim()) ? null : "Enter a valid UPI ID, e.g. ananya@okaxis";
  }
  if (method === "CARD") {
    const num = d.cardNumber.replace(/\s/g, "");
    if (!/^\d{15,16}$/.test(num) || !luhn(num)) return "Enter a valid card number";
    const m = /^(\d{2})\/(\d{2})$/.exec(d.cardExpiry);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return "Enter expiry as MM/YY";
    const now = new Date();
    const exp = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59);
    if (exp < now) return "This card has expired";
    if (!/^\d{3,4}$/.test(d.cardCvv)) return "Enter the 3-digit CVV";
    return null;
  }
  if (method === "NETBANKING") return d.bank ? null : "Choose your bank";
  return d.wallet ? null : "Choose a wallet";
}

type PanelProps = { details: PayDetails; onChange: (d: PayDetails) => void; invalid?: boolean };

export function UpiPanel({ details, onChange, invalid }: PanelProps) {
  return (
    <div>
      <div className="flex gap-2 text-xs font-medium">
        {(["id", "qr"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={details.upiMode === m}
            onClick={() => onChange({ ...details, upiMode: m })}
            className={cn(
              "rounded-full border px-3 py-1.5 transition-colors",
              details.upiMode === m ? "border-charcoal bg-charcoal text-ivory" : "border-input hover:bg-muted",
            )}
          >
            {m === "id" ? "Pay with UPI ID" : "Scan QR code"}
          </button>
        ))}
      </div>
      {details.upiMode === "id" ? (
        <div className="mt-4 space-y-1.5">
          <label htmlFor="demo-upi" className="text-sm font-medium">
            UPI ID
          </label>
          <Input
            id="demo-upi"
            placeholder="ananya@okaxis"
            autoComplete="off"
            value={details.upiId}
            aria-invalid={invalid || undefined}
            onChange={(e) => onChange({ ...details, upiId: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">Any UPI ID in the name@bank format works in demo mode.</p>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-4 rounded-xl border border-dashed p-4">
          <div className="flex size-28 shrink-0 items-center justify-center rounded-lg bg-muted">
            <QrCode className="size-20 text-charcoal/70" strokeWidth={1} aria-hidden />
          </div>
          <div className="text-sm">
            <p className="font-semibold">Scan with any UPI app</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Sample QR for the demo — it isn&apos;t linked to a real account. Tap Pay to continue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function formatCard(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function CardPanel({ details, onChange, invalid }: PanelProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between rounded-lg bg-[#fbf5e9] px-3 py-2 text-xs text-[#6b5323]">
        <span>
          Test card <strong className="tabular-nums">{TEST_CARD.number}</strong>
        </span>
        <button
          type="button"
          className="font-semibold underline underline-offset-2"
          onClick={() =>
            onChange({ ...details, cardNumber: TEST_CARD.number, cardExpiry: TEST_CARD.expiry, cardCvv: TEST_CARD.cvv, cardName: "Ananya Sharma" })
          }
        >
          Use test card
        </button>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="demo-card-number" className="text-sm font-medium">
          Card number
        </label>
        <Input
          id="demo-card-number"
          inputMode="numeric"
          autoComplete="off"
          placeholder="1234 5678 9012 3456"
          value={details.cardNumber}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange({ ...details, cardNumber: formatCard(e.target.value) })}
          className="tabular-nums"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="demo-card-expiry" className="text-sm font-medium">
            Expiry
          </label>
          <Input
            id="demo-card-expiry"
            inputMode="numeric"
            autoComplete="off"
            placeholder="MM/YY"
            value={details.cardExpiry}
            onChange={(e) => onChange({ ...details, cardExpiry: formatExpiry(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="demo-card-cvv" className="text-sm font-medium">
            CVV
          </label>
          <Input
            id="demo-card-cvv"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder="•••"
            maxLength={4}
            value={details.cardCvv}
            onChange={(e) => onChange({ ...details, cardCvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="demo-card-name" className="text-sm font-medium">
          Name on card <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="demo-card-name"
          autoComplete="off"
          value={details.cardName}
          onChange={(e) => onChange({ ...details, cardName: e.target.value })}
        />
      </div>
    </div>
  );
}

function OptionList({
  name,
  options,
  value,
  onSelect,
  legend,
}: {
  name: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  legend: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-medium">{legend}</legend>
      <div className="grid gap-2">
        {options.map((o) => (
          <label
            key={o}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
              value === o ? "border-charcoal bg-ivory" : "hover:bg-muted/50",
            )}
          >
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onSelect(o)} className="accent-charcoal" />
            <span className="flex size-7 items-center justify-center rounded-md bg-muted text-[0.6rem] font-bold text-charcoal">
              {o
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 3)}
            </span>
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function NetbankingPanel({ details, onChange }: PanelProps) {
  return <OptionList name="demo-bank" legend="Choose your bank" options={BANKS} value={details.bank} onSelect={(bank) => onChange({ ...details, bank })} />;
}

export function WalletPanel({ details, onChange }: PanelProps) {
  return (
    <div>
      <OptionList name="demo-wallet" legend="Choose a wallet" options={WALLETS} value={details.wallet} onSelect={(wallet) => onChange({ ...details, wallet })} />
      <p className="mt-2.5 text-xs text-muted-foreground">Balance checks are skipped in demo mode.</p>
    </div>
  );
}
