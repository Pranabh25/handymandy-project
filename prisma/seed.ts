/**
 * LushAura demo seed. Idempotent: wipes all tables, then inserts a complete,
 * internally consistent demo dataset. Run with `npx prisma db seed`.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { siteConfig, demoConfig } from "../src/config/site";
import type { PricingCoupon, PricingSettings } from "../src/lib/pricing";
import { categories } from "./seed/categories";
import { giftProducts } from "./seed/products-gifts";
import { cosmeticProducts } from "./seed/products-cosmetics";
import { bodyProducts } from "./seed/products-body";
import { buildApprovedReviews, moderationReviews } from "./seed/reviews";
import { buildCoupons } from "./seed/coupons";
import { customers } from "./seed/customers";
import { orderSpecs } from "./seed/orders";
import { buildOrder, createRng } from "./seed/build-orders";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const DAY = 24 * 60 * 60 * 1000;
const now = new Date();
const daysAgo = (d: number, rng?: ReturnType<typeof createRng>) =>
  new Date(now.getTime() - d * DAY - (rng ? rng.int(0, 10 * 60) * 60 * 1000 : 0));

async function wipe() {
  await db.refund.deleteMany();
  await db.cancellationRequest.deleteMany();
  await db.payment.deleteMany();
  await db.orderEvent.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.review.deleteMany();
  await db.productImage.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.address.deleteMany();
  await db.otpCode.deleteMany();
  await db.user.deleteMany();
  await db.coupon.deleteMany();
  await db.storeSetting.deleteMany();
  await db.contactMessage.deleteMany();
  await db.newsletterSubscriber.deleteMany();
}

async function main() {
  const rng = createRng(20260926);
  await wipe();

  // ── Store settings
  const settings = await db.storeSetting.create({
    data: {
      id: "store",
      storeName: "LushAura",
      supportEmail: "care@lushaura.in",
      supportPhone: "+91 80 4718 2290",
      whatsappNumber: "+91 98450 12877",
      gstin: "29AAECL4821K1Z6",
      registeredAddress: siteConfig.address,
      freeShippingThreshold: 999,
      shippingFee: 79,
      codFee: 49,
      codEnabled: true,
      giftWrapFee: 59,
      announcement: "Free shipping on orders above ₹999 · Complimentary handwritten gift note on every order",
    },
  });
  const pricingSettings: PricingSettings = {
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingFee: settings.shippingFee,
    codFee: settings.codFee,
    giftWrapFee: settings.giftWrapFee,
  };

  // ── Categories
  const categoryIds = new Map<string, string>();
  for (const c of categories) {
    const row = await db.category.create({ data: { ...c, image: null } });
    categoryIds.set(c.slug, row.id);
  }

  // ── Products + reviews (rating/reviewCount derived from approved reviews)
  const allProducts = [...giftProducts, ...cosmeticProducts, ...bodyProducts];
  const approved = buildApprovedReviews(allProducts);
  const productRefs = new Map<string, { id: string; name: string; sku: string; price: number; mrp: number }>();
  for (const p of allProducts) {
    if (p.mrp < p.price) throw new Error(`MRP below price for ${p.slug}`);
    const reviews = approved.filter((r) => r.productSlug === p.slug);
    const avg = Math.round((reviews.reduce((n, r) => n + r.rating, 0) / reviews.length) * 10) / 10;
    if (avg < 3.9 || avg > 4.9) throw new Error(`Rating ${avg} out of range for ${p.slug}`);
    const { categorySlug, ...data } = p;
    const createdAt = p.isNew ? daysAgo(rng.int(6, 25), rng) : daysAgo(rng.int(95, 185), rng);
    const row = await db.product.create({
      data: {
        ...data,
        categoryId: categoryIds.get(categorySlug)!,
        rating: avg,
        reviewCount: reviews.length,
        metaTitle: `${p.name} | LushAura`,
        metaDescription: p.shortDescription,
        createdAt,
      },
    });
    productRefs.set(p.slug, { id: row.id, name: row.name, sku: row.sku, price: row.price, mrp: row.mrp });
  }

  const reviewRows = [...approved, ...moderationReviews].map((r) => {
    const product = productRefs.get(r.productSlug);
    if (!product) throw new Error(`Review for unknown product ${r.productSlug}`);
    return {
      productId: product.id,
      authorName: r.authorName,
      city: r.city,
      rating: r.rating,
      title: r.title,
      body: r.body,
      isVerified: r.isVerified,
      status: r.status,
      createdAt: daysAgo(r.daysAgo, rng),
    };
  });
  await db.review.createMany({ data: reviewRows });

  // ── Coupons
  const couponRows = buildCoupons(now);
  await db.coupon.createMany({ data: couponRows });
  const coupons = new Map<string, PricingCoupon>(
    couponRows.map((c) => [
      c.code,
      { code: c.code, type: c.type, value: c.value, minOrder: c.minOrder ?? 0, maxDiscount: c.maxDiscount ?? null },
    ]),
  );

  // ── Users
  const adminHash = await bcrypt.hash(demoConfig.admin.password, 10);
  await db.user.create({
    data: {
      name: "Meera Iyer (Admin)",
      email: demoConfig.admin.email,
      phone: "9845001122",
      passwordHash: adminHash,
      role: "ADMIN",
      createdAt: daysAgo(190),
    },
  });

  const customerRefs = new Map<string, { id: string; email: string; addresses: (typeof customers)[number]["addresses"] }>();
  for (const c of customers) {
    const createdAt = daysAgo(c.daysAgo, rng);
    const user = await db.user.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        role: "CUSTOMER",
        createdAt,
        addresses: { create: c.addresses.map((a) => ({ ...a, createdAt })) },
      },
    });
    customerRefs.set(c.key, { id: user.id, email: c.email, addresses: c.addresses });
  }

  // ── Orders
  const usedNumbers = new Set<string>();
  const ctx = { now, rng, usedNumbers, products: productRefs, customers: customerRefs, coupons, settings: pricingSettings };
  for (const spec of orderSpecs) {
    const built = buildOrder(spec, ctx);
    const order = await db.order.create({ data: built.order });
    const paymentIds: string[] = [];
    for (const p of built.payments) {
      const row = await db.payment.create({ data: { ...p, orderId: order.id } });
      paymentIds.push(row.id);
    }
    if (built.refund) {
      const { paymentIndex, ...refund } = built.refund;
      await db.refund.create({ data: { ...refund, orderId: order.id, paymentId: paymentIds[paymentIndex] } });
    }
    if (built.cancellation) {
      await db.cancellationRequest.create({ data: { ...built.cancellation, orderId: order.id } });
    }
  }

  // ── Summary
  const [products, reviews, orders, users] = await Promise.all([
    db.product.count(),
    db.review.count(),
    db.order.count(),
    db.user.count(),
  ]);
  console.log(`Seeded ${categories.length} categories, ${products} products, ${reviews} reviews, ${users} users, ${orders} orders.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
