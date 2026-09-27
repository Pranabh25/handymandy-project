import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";
import type { PricingSettings } from "@/lib/pricing";

const DEFAULTS = {
  id: "store",
  storeName: siteConfig.name,
  supportEmail: siteConfig.supportEmail,
  supportPhone: siteConfig.supportPhone,
  whatsappNumber: siteConfig.whatsapp,
  gstin: siteConfig.gstin,
  registeredAddress: siteConfig.address,
  freeShippingThreshold: 999,
  shippingFee: 79,
  codFee: 49,
  codEnabled: true,
  giftWrapFee: 59,
  announcement: "Free shipping on orders above ₹999 · Complimentary gift note on every order",
};

/** Store settings row (falls back to defaults if the seed hasn't run). */
export const getStoreSettings = cache(async () => {
  const row = await db.storeSetting.findUnique({ where: { id: "store" } });
  return row ?? { ...DEFAULTS, updatedAt: new Date() };
});

export type StoreSettings = Awaited<ReturnType<typeof getStoreSettings>>;

export function toPricingSettings(s: StoreSettings): PricingSettings {
  return {
    freeShippingThreshold: s.freeShippingThreshold,
    shippingFee: s.shippingFee,
    codFee: s.codFee,
    giftWrapFee: s.giftWrapFee,
  };
}
