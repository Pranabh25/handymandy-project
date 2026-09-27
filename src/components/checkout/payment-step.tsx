"use client";

import Link from "next/link";
import { CircleAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoNotice } from "@/components/common/demo-notice";
import { useStoreSettings } from "@/components/providers/store-provider";
import type { PaymentMethod } from "@/generated/prisma/enums";
import { formatINR } from "@/lib/format";
import type { PayableOrder } from "./demo-payment-modal";
import { PaymentOptions } from "./payment-options";

type Props = {
  method: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  total: number;
  placing: boolean;
  ready: boolean;
  error: string | null;
  pendingOrder: PayableOrder | null;
  dismissed: boolean;
  onSubmit: () => void;
};

export function PaymentStep({ method, onMethodChange, total, placing, ready, error, pendingOrder, dismissed, onSubmit }: Props) {
  const settings = useStoreSettings();
  const isCod = method === "COD";

  let label = `Pay ${formatINR(total)}`;
  if (placing) label = "Placing your order…";
  else if (!ready) label = "Checking your bag…";
  else if (pendingOrder && !isCod) label = `Complete payment · ${formatINR(pendingOrder.total)}`;
  else if (isCod) label = `Place order · ${formatINR(total)}`;

  return (
    <div className="space-y-5">
      <PaymentOptions
        value={method}
        onChange={onMethodChange}
        codEnabled={settings.codEnabled}
        codFee={settings.codFee}
        disabled={placing}
      />

      {!settings.codEnabled ? (
        <p className="text-xs text-muted-foreground">Cash on Delivery is currently unavailable. All prepaid methods are open.</p>
      ) : null}

      {pendingOrder && dismissed ? (
        <div role="status" className="flex gap-3 rounded-lg border border-gold/50 bg-[#fbf5e9] px-4 py-3 text-sm text-[#6b5323]">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            Payment not completed — order <strong>{pendingOrder.orderNumber}</strong> is saved and awaiting payment. Retry below or
            later from{" "}
            <Link href={`/account/orders/${pendingOrder.orderNumber}`} className="font-semibold underline underline-offset-2">
              My Orders
            </Link>
            .
          </p>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="flex gap-2 rounded-lg bg-[#f6e1de] px-4 py-3 text-sm text-destructive">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      <DemoNotice>
        Payments are simulated. Prepaid methods open a test payment window where you choose success or failure — no real
        money is charged and card details never leave your browser.
      </DemoNotice>

      <Button type="button" size="lg" variant="accent" className="w-full" onClick={onSubmit} disabled={placing || !ready}>
        <Lock className="size-4" aria-hidden />
        {label}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        By placing this order you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/returns" className="underline underline-offset-2">
          Returns policy
        </Link>
        .
      </p>
    </div>
  );
}
