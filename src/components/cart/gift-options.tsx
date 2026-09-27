"use client";

import { useId } from "react";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cartActions } from "@/hooks/use-cart";
import { useStoreSettings } from "@/components/providers/store-provider";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const GIFT_MESSAGE_MAX = 200;

type Props = { giftWrap: boolean; giftMessage: string; className?: string };

export function GiftOptions({ giftWrap, giftMessage, className }: Props) {
  const id = useId();
  const settings = useStoreSettings();
  return (
    <section aria-labelledby={`${id}-title`} className={cn("rounded-xl border bg-card p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-terracotta-soft">
            <Gift className="size-4 text-terracotta" aria-hidden />
          </span>
          <div>
            <h2 id={`${id}-title`} className="font-sans text-sm font-semibold">
              <label htmlFor={`${id}-wrap`}>Make it a gift</label>
            </h2>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Hand-tied kraft wrap with a dried-flower sprig and a handwritten note card
              {settings.giftWrapFee > 0 ? ` · ${formatINR(settings.giftWrapFee)}` : " · complimentary"}.
            </p>
          </div>
        </div>
        <Switch
          id={`${id}-wrap`}
          checked={giftWrap}
          onCheckedChange={(checked) => {
            cartActions.setGiftWrap(checked);
            toast(checked ? "Gift wrap added" : "Gift wrap removed");
          }}
          className="mt-1"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <label htmlFor={`${id}-msg`} className="text-xs font-medium">
            Gift message <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <span
            id={`${id}-count`}
            className={cn(
              "text-[0.7rem] tabular-nums",
              giftMessage.length >= GIFT_MESSAGE_MAX ? "text-terracotta" : "text-muted-foreground",
            )}
            aria-live="polite"
          >
            {giftMessage.length}/{GIFT_MESSAGE_MAX}
          </span>
        </div>
        <Textarea
          id={`${id}-msg`}
          value={giftMessage}
          maxLength={GIFT_MESSAGE_MAX}
          rows={3}
          onChange={(e) => cartActions.setGiftMessage(e.target.value)}
          placeholder="Happy Diwali, Maa! Thank you for always lighting up our home."
          aria-describedby={`${id}-count`}
          className="mt-1.5 min-h-20 bg-card"
        />
      </div>
    </section>
  );
}

