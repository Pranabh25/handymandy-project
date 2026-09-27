import { z } from "zod";

/** Zod schemas for admin forms. Client components import only the inferred types. */

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters`)
    .optional()
    .transform((v) => (v ? v : null));

const stringList = (maxItems = 30, maxLen = 120) =>
  z
    .array(z.string().trim().max(maxLen))
    .max(maxItems)
    .transform((list) => Array.from(new Set(list.filter(Boolean))));

const optionalInt = (label: string, max = 1_000_000) =>
  z
    .union([z.number(), z.nan(), z.null()])
    .optional()
    .transform((v) => (v == null || Number.isNaN(v) ? null : v))
    .pipe(z.number().int(`${label} must be a whole number`).min(0).max(max).nullable());

export const productImageSchema = z.object({
  url: z
    .string()
    .trim()
    .refine((u) => u.startsWith("/uploads/") || u.startsWith("https://"), "Invalid image URL"),
  alt: z.string().trim().max(160).optional().transform((v) => v || null),
});

export const productSchema = z
  .object({
    name: z.string().trim().min(3, "Enter a product name").max(120),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Enter a URL slug")
      .max(140)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
    sku: z
      .string()
      .trim()
      .toUpperCase()
      .min(3, "Enter a SKU")
      .max(40)
      .regex(/^[A-Z0-9-]+$/, "Use letters, numbers and hyphens only"),
    categoryId: z.string().min(1, "Choose a category"),
    shortDescription: z.string().trim().min(10, "Add a one-line summary (at least 10 characters)").max(200),
    description: z.string().trim().min(20, "Add a fuller description (at least 20 characters)").max(5000),
    price: z.number({ error: "Enter the selling price" }).int("Use whole rupees").min(1, "Price must be at least ₹1").max(1_000_000),
    mrp: z.number({ error: "Enter the MRP" }).int("Use whole rupees").min(1, "MRP must be at least ₹1").max(1_000_000),
    stock: z.number({ error: "Enter stock on hand" }).int("Stock must be a whole number").min(0, "Stock can't be negative").max(100_000),
    lowStockAt: z.number({ error: "Enter a threshold" }).int().min(0).max(10_000),
    status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
    tags: stringList(20, 40),
    isFeatured: z.boolean(),
    isBestseller: z.boolean(),
    isNew: z.boolean(),
    giftWrapAvailable: z.boolean(),
    isPersonalizable: z.boolean(),
    images: z.array(productImageSchema).max(12, "Up to 12 images per product"),
    // Cosmetic
    size: optionalText(40),
    shade: optionalText(60),
    skinTypes: stringList(10, 40),
    concerns: stringList(15, 60),
    keyIngredients: stringList(20, 80),
    ingredients: optionalText(4000),
    howToUse: optionalText(2000),
    benefits: stringList(12, 200),
    isVegan: z.boolean(),
    isCrueltyFree: z.boolean(),
    isParabenFree: z.boolean(),
    shelfLifeMonths: optionalInt("Shelf life", 120),
    // Gift
    occasions: stringList(15, 40),
    recipients: stringList(15, 40),
    whatsInside: stringList(25, 160),
    // Compliance
    hsnCode: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || null)
      .pipe(z.string().regex(/^\d{4,8}$/, "HSN code is 4–8 digits").nullable()),
    countryOfOrigin: z.string().trim().min(2, "Enter the country of origin").max(60),
    manufacturer: optionalText(300),
    weightGrams: optionalInt("Weight", 100_000),
    // SEO
    metaTitle: optionalText(70),
    metaDescription: optionalText(170),
  })
  .refine((p) => p.mrp >= p.price, { path: ["mrp"], message: "MRP can't be lower than the selling price" });

export type ProductInput = z.input<typeof productSchema>;
export type ProductData = z.output<typeof productSchema>;

const dateString = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || null)
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date").nullable());

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .min(3, "Codes are at least 3 characters")
      .max(24)
      .regex(/^[A-Z0-9]+$/, "Use letters and numbers only"),
    description: z.string().trim().min(5, "Describe the offer for customers").max(160),
    type: z.enum(["PERCENT", "FLAT", "FREE_SHIPPING"]),
    value: z.number().int("Use a whole number").min(0).max(100_000),
    minOrder: z.number().int().min(0, "Minimum order can't be negative").max(1_000_000),
    maxDiscount: optionalInt("Max discount"),
    usageLimit: optionalInt("Usage limit"),
    startsAt: dateString,
    endsAt: dateString,
    isActive: z.boolean(),
  })
  .superRefine((c, ctx) => {
    if (c.type === "PERCENT" && (c.value < 1 || c.value > 90))
      ctx.addIssue({ code: "custom", path: ["value"], message: "Percent off must be between 1 and 90" });
    if (c.type === "FLAT" && c.value < 1) ctx.addIssue({ code: "custom", path: ["value"], message: "Enter the rupee amount off" });
    if (c.startsAt && c.endsAt && c.endsAt < c.startsAt)
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "End date must be after the start date" });
  });

export type CouponInput = z.input<typeof couponSchema>;

const indianPhone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[^\d+]/g, ""))
  .pipe(z.string().regex(/^(\+?91)?[6-9]\d{9}$|^1800\d{6,7}$/, "Enter a valid Indian phone number"));

export const settingsSchema = z.object({
  storeName: z.string().trim().min(2, "Enter the store name").max(60),
  supportEmail: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  supportPhone: indianPhone,
  whatsappNumber: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.replace(/[^\d+]/g, "") : null))
    .pipe(z.string().regex(/^(\+?91)?[6-9]\d{9}$/, "Enter a valid WhatsApp number").nullable()),
  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .transform((v) => v || null)
    .pipe(z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, "Enter a valid 15-character GSTIN").nullable()),
  registeredAddress: z.string().trim().min(10, "Enter the full registered address").max(400),
  freeShippingThreshold: z.number().int().min(0).max(100_000),
  shippingFee: z.number().int().min(0).max(5_000),
  codFee: z.number().int().min(0).max(5_000),
  codEnabled: z.boolean(),
  giftWrapFee: z.number().int().min(0).max(5_000),
  announcement: optionalText(160),
});

export type SettingsInput = z.input<typeof settingsSchema>;
