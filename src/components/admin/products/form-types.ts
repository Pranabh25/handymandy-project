import type { ProductInput } from "@/server/admin/schemas";

export type ImageItem = { url: string; alt: string };
export type ProductStatusValue = "ACTIVE" | "DRAFT" | "ARCHIVED";

/** Client-side form state. Numbers are kept as strings so inputs can be empty while typing. */
export type ProductFormValues = {
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: string;
  mrp: string;
  stock: string;
  lowStockAt: string;
  status: ProductStatusValue;
  tags: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  giftWrapAvailable: boolean;
  isPersonalizable: boolean;
  images: ImageItem[];
  size: string;
  shade: string;
  skinTypes: string[];
  concerns: string[];
  keyIngredients: string[];
  ingredients: string;
  howToUse: string;
  benefits: string; // one per line
  isVegan: boolean;
  isCrueltyFree: boolean;
  isParabenFree: boolean;
  shelfLifeMonths: string;
  occasions: string[];
  recipients: string[];
  whatsInside: string; // one per line
  hsnCode: string;
  countryOfOrigin: string;
  manufacturer: string;
  weightGrams: string;
  metaTitle: string;
  metaDescription: string;
};

export type SetValues = (patch: Partial<ProductFormValues>) => void;
export type FieldErrors = Record<string, string>;

export const EMPTY_PRODUCT: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  price: "",
  mrp: "",
  stock: "0",
  lowStockAt: "5",
  status: "DRAFT",
  tags: [],
  isFeatured: false,
  isBestseller: false,
  isNew: true,
  giftWrapAvailable: true,
  isPersonalizable: false,
  images: [],
  size: "",
  shade: "",
  skinTypes: [],
  concerns: [],
  keyIngredients: [],
  ingredients: "",
  howToUse: "",
  benefits: "",
  isVegan: false,
  isCrueltyFree: false,
  isParabenFree: false,
  shelfLifeMonths: "",
  occasions: [],
  recipients: [],
  whatsInside: "",
  hsnCode: "",
  countryOfOrigin: "India",
  manufacturer: "",
  weightGrams: "",
  metaTitle: "",
  metaDescription: "",
};

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const req = (s: string) => (s.trim() === "" ? Number.NaN : Number(s));
const opt = (s: string) => (s.trim() === "" ? null : Number(s));

export function toProductInput(v: ProductFormValues): ProductInput {
  return {
    ...v,
    price: req(v.price),
    mrp: req(v.mrp),
    stock: req(v.stock),
    lowStockAt: req(v.lowStockAt),
    shelfLifeMonths: opt(v.shelfLifeMonths),
    weightGrams: opt(v.weightGrams),
    benefits: lines(v.benefits),
    whatsInside: lines(v.whatsInside),
    images: v.images.map((i) => ({ url: i.url, alt: i.alt })),
  };
}

type ProductLike = {
  [K in Exclude<keyof ProductFormValues, "images" | "price" | "mrp" | "stock" | "lowStockAt" | "shelfLifeMonths" | "weightGrams" | "benefits" | "whatsInside">]: ProductFormValues[K] | null;
} & {
  price: number;
  mrp: number;
  stock: number;
  lowStockAt: number;
  shelfLifeMonths: number | null;
  weightGrams: number | null;
  benefits: string[];
  whatsInside: string[];
  images: { url: string; alt: string | null }[];
};

export function toFormValues(p: ProductLike): ProductFormValues {
  const s = (x: string | null) => x ?? "";
  return {
    ...EMPTY_PRODUCT,
    name: p.name ?? "",
    slug: p.slug ?? "",
    sku: p.sku ?? "",
    categoryId: p.categoryId ?? "",
    shortDescription: p.shortDescription ?? "",
    description: p.description ?? "",
    price: String(p.price),
    mrp: String(p.mrp),
    stock: String(p.stock),
    lowStockAt: String(p.lowStockAt),
    status: p.status ?? "ACTIVE",
    tags: p.tags ?? [],
    isFeatured: !!p.isFeatured,
    isBestseller: !!p.isBestseller,
    isNew: !!p.isNew,
    giftWrapAvailable: !!p.giftWrapAvailable,
    isPersonalizable: !!p.isPersonalizable,
    images: p.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })),
    size: s(p.size),
    shade: s(p.shade),
    skinTypes: p.skinTypes ?? [],
    concerns: p.concerns ?? [],
    keyIngredients: p.keyIngredients ?? [],
    ingredients: s(p.ingredients),
    howToUse: s(p.howToUse),
    benefits: p.benefits.join("\n"),
    isVegan: !!p.isVegan,
    isCrueltyFree: !!p.isCrueltyFree,
    isParabenFree: !!p.isParabenFree,
    shelfLifeMonths: p.shelfLifeMonths == null ? "" : String(p.shelfLifeMonths),
    occasions: p.occasions ?? [],
    recipients: p.recipients ?? [],
    whatsInside: p.whatsInside.join("\n"),
    hsnCode: s(p.hsnCode),
    countryOfOrigin: s(p.countryOfOrigin) || "India",
    manufacturer: s(p.manufacturer),
    weightGrams: p.weightGrams == null ? "" : String(p.weightGrams),
    metaTitle: s(p.metaTitle),
    metaDescription: s(p.metaDescription),
  };
}
