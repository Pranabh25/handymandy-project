/**
 * Pure pricing logic shared by the cart UI (client) and order creation (server).
 * The server always recomputes totals from database prices; the client version is
 * only for display.
 */

export type PricingSettings = {
  freeShippingThreshold: number;
  shippingFee: number;
  codFee: number;
  giftWrapFee: number;
};

export type PricingCoupon = {
  code: string;
  type: "PERCENT" | "FLAT" | "FREE_SHIPPING";
  value: number;
  minOrder: number;
  maxDiscount: number | null;
};

export type PricingLine = { price: number; mrp: number; quantity: number };

export type PriceBreakdown = {
  itemCount: number;
  mrpTotal: number;
  subtotal: number;
  productSavings: number;
  couponDiscount: number;
  shippingFee: number;
  giftWrapFee: number;
  codFee: number;
  total: number;
  /** Amount still needed to unlock free shipping (0 once unlocked). */
  freeShippingRemaining: number;
  /** GST included in the total, assuming 18% for display on the invoice. */
  gstIncluded: number;
};

export const GST_RATE = 0.18;

export function couponDiscountFor(coupon: PricingCoupon | null | undefined, subtotal: number) {
  if (!coupon || subtotal < coupon.minOrder) return 0;
  if (coupon.type === "FLAT") return Math.min(coupon.value, subtotal);
  if (coupon.type === "PERCENT") {
    const raw = Math.round((subtotal * coupon.value) / 100);
    return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  }
  return 0;
}

export function calculateTotals(
  lines: PricingLine[],
  settings: PricingSettings,
  opts: { coupon?: PricingCoupon | null; giftWrap?: boolean; cod?: boolean } = {},
): PriceBreakdown {
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const mrpTotal = lines.reduce((n, l) => n + Math.max(l.mrp, l.price) * l.quantity, 0);
  const couponDiscount = couponDiscountFor(opts.coupon, subtotal);
  const afterDiscount = subtotal - couponDiscount;

  const freeShipByCoupon = opts.coupon?.type === "FREE_SHIPPING" && subtotal >= opts.coupon.minOrder;
  const qualifiesFree = afterDiscount >= settings.freeShippingThreshold || freeShipByCoupon;
  const shippingFee = itemCount === 0 || qualifiesFree ? 0 : settings.shippingFee;
  const giftWrapFee = opts.giftWrap && itemCount > 0 ? settings.giftWrapFee : 0;
  const codFee = opts.cod && itemCount > 0 ? settings.codFee : 0;
  const total = afterDiscount + shippingFee + giftWrapFee + codFee;

  return {
    itemCount,
    mrpTotal,
    subtotal,
    productSavings: mrpTotal - subtotal,
    couponDiscount,
    shippingFee,
    giftWrapFee,
    codFee,
    total,
    freeShippingRemaining: qualifiesFree ? 0 : Math.max(0, settings.freeShippingThreshold - afterDiscount),
    gstIncluded: Math.round(total - total / (1 + GST_RATE)),
  };
}

/** Explains why a coupon cannot be applied, or null if it can. */
export function couponIneligibility(coupon: PricingCoupon, subtotal: number) {
  if (subtotal < coupon.minOrder) {
    return `Add items worth ₹${(coupon.minOrder - subtotal).toLocaleString("en-IN")} more to use ${coupon.code}`;
  }
  return null;
}
