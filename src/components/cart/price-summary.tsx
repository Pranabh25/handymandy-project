import { formatINR, pluralize } from "@/lib/format";
import type { PriceBreakdown } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Props = {
  totals: PriceBreakdown;
  couponCode?: string | null;
  /** Show the COD fee row (checkout payment step). */
  showCod?: boolean;
  className?: string;
};

function Row({ label, value, tone, sub }: { label: React.ReactNode; value: string; tone?: "save" | "muted"; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">
        {label}
        {sub ? <span className="block text-[0.7rem]">{sub}</span> : null}
      </dt>
      <dd className={cn("font-medium tabular-nums", tone === "save" && "text-sage")}>{value}</dd>
    </div>
  );
}

/** Itemised price breakdown used by the bag, checkout sidebar and confirmation page. */
export function PriceSummary({ totals, couponCode, showCod, className }: Props) {
  const savings = totals.productSavings + totals.couponDiscount;
  return (
    <div className={cn("text-sm", className)}>
      <dl className="space-y-2.5">
        <Row label={`MRP total (${pluralize(totals.itemCount, "item")})`} value={formatINR(totals.mrpTotal)} />
        {totals.productSavings > 0 ? (
          <Row label="Discount on MRP" value={`− ${formatINR(totals.productSavings)}`} tone="save" />
        ) : null}
        {totals.couponDiscount > 0 ? (
          <Row label={`Coupon${couponCode ? ` (${couponCode})` : ""}`} value={`− ${formatINR(totals.couponDiscount)}`} tone="save" />
        ) : null}
        <Row
          label="Shipping"
          value={totals.shippingFee > 0 ? formatINR(totals.shippingFee) : "Free"}
          tone={totals.shippingFee > 0 ? undefined : "save"}
        />
        {totals.giftWrapFee > 0 ? <Row label="Gift wrap" value={formatINR(totals.giftWrapFee)} /> : null}
        {showCod && totals.codFee > 0 ? <Row label="Cash on Delivery fee" value={formatINR(totals.codFee)} /> : null}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t pt-4">
        <span className="font-semibold">
          Total <span className="text-xs font-normal text-muted-foreground">(incl. GST)</span>
        </span>
        <span className="text-lg font-semibold tabular-nums">{formatINR(totals.total)}</span>
      </div>
      {savings > 0 ? (
        <p className="mt-3 rounded-lg bg-sage-soft px-3 py-2 text-center text-xs font-semibold text-sage">
          You save {formatINR(savings)} on this order
        </p>
      ) : null}
    </div>
  );
}
