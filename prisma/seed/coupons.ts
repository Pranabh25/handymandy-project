import type { Prisma } from "../../src/generated/prisma/client";

const day = 24 * 60 * 60 * 1000;

export function buildCoupons(now: Date): Prisma.CouponCreateManyInput[] {
  const ago = (d: number) => new Date(now.getTime() - d * day);
  const ahead = (d: number) => new Date(now.getTime() + d * day);
  return [
    { code: "WELCOME10", description: "10% off your first order", type: "PERCENT", value: 10, minOrder: 499, maxDiscount: 300, usedCount: 186, startsAt: ago(180), createdAt: ago(180) },
    { code: "FESTIVE500", description: "₹500 off festive orders above ₹2,999", type: "FLAT", value: 500, minOrder: 2999, usageLimit: 1000, usedCount: 142, startsAt: ago(30), endsAt: ahead(45), createdAt: ago(32) },
    { code: "FREESHIP", description: "Free shipping on any order", type: "FREE_SHIPPING", value: 0, minOrder: 0, usedCount: 73, startsAt: ago(90), createdAt: ago(90) },
    { code: "GIFTING15", description: "15% off gifting orders above ₹1,999 (up to ₹750)", type: "PERCENT", value: 15, minOrder: 1999, maxDiscount: 750, usageLimit: 500, usedCount: 58, startsAt: ago(20), endsAt: ahead(60), createdAt: ago(21) },
    { code: "MONSOON20", description: "20% off during the Monsoon Self-care Sale", type: "PERCENT", value: 20, minOrder: 999, maxDiscount: 400, usedCount: 311, startsAt: ago(110), endsAt: ago(70), createdAt: ago(112) },
    { code: "STAFF25", description: "25% staff discount (internal use only)", type: "PERCENT", value: 25, minOrder: 0, maxDiscount: 1500, usedCount: 12, isActive: false, createdAt: ago(150) },
  ];
}
