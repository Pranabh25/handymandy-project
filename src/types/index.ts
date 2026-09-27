/** Shared, client-safe types. */

export type ShippingAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  type?: "HOME" | "WORK" | "OTHER";
};

/** Minimal product shape used by cards, cart and wishlist (serialisable). */
export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string | null;
  imageAlt?: string | null;
  categoryName: string;
  categorySlug: string;
  group: "GIFTS" | "COSMETICS";
  isBestseller: boolean;
  isNew: boolean;
  size?: string | null;
  shortDescription?: string;
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  image: string | null;
  quantity: number;
  stock: number;
  size?: string | null;
};

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? { data?: undefined } : { data: T }))
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
