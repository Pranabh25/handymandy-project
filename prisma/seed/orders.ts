import type { OrderStatus, PaymentMethod } from "../../src/generated/prisma/enums";
import { DEMO_CUSTOMER_KEY } from "./customers";

export type OrderSpec = {
  customer: string;
  /** Index into the customer's addresses, or a one-off gift address. */
  address?: number | GiftAddress;
  hoursAgo: number;
  status: OrderStatus;
  method: PaymentMethod;
  items: [slug: string, qty: number][];
  coupon?: string;
  giftWrap?: boolean;
  giftMessage?: string;
  courier?: string;
  /** A declined payment attempt before the successful one (or before the order was abandoned). */
  failedAttempt?: string;
  /** Pending cancellation request on a CONFIRMED/PACKED order. */
  cancellationRequest?: { reason: string; comment?: string };
  /** For CANCELLED orders: how it got cancelled. */
  cancel?: {
    at: "CONFIRMED" | "PACKED";
    by: "customer" | "admin";
    reason: string;
    comment?: string;
    refund?: "PENDING" | "PROCESSED";
  };
};

export type GiftAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: "HOME" | "WORK" | "OTHER";
};

const D = 24;
const A = DEMO_CUSTOMER_KEY;

export const orderSpecs: OrderSpec[] = [
  // ─── Ananya (demo customer) ──────────────────────────────────────────────
  {
    customer: A, hoursAgo: 52 * D + 5, status: "DELIVERED", method: "COD", address: 1,
    items: [["saffron-sandalwood-soy-candle", 2]], courier: "Delhivery",
  },
  {
    customer: A, hoursAgo: 38 * D + 3, status: "DELIVERED", method: "UPI", coupon: "WELCOME10",
    items: [["kumkumadi-radiance-face-oil", 1], ["rose-water-hydrating-toner", 1]], courier: "Blue Dart",
  },
  {
    customer: A, hoursAgo: 21 * D + 7, status: "CANCELLED", method: "CARD",
    items: [["vetiver-oud-eau-de-parfum", 1]],
    cancel: { at: "CONFIRMED", by: "customer", reason: "Ordered by mistake", comment: "Meant to order the Mogra Musk instead.", refund: "PROCESSED" },
  },
  {
    customer: A, hoursAgo: 46, status: "SHIPPED", method: "CARD", coupon: "FESTIVE500", courier: "Blue Dart",
    giftWrap: true, giftMessage: "Happy Diwali, Amma and Papa! Light these on the first evening. Love, Ananya",
    address: {
      fullName: "Rajesh Sharma", phone: "9876543210", line1: "New No. 21, Old No. 9, 4th Main Road",
      line2: "Kasturba Nagar, Adyar", landmark: "Near Adyar Ananda Bhavan", city: "Chennai",
      state: "Tamil Nadu", pincode: "600020", type: "OTHER",
    },
    items: [["diwali-diya-dry-fruit-hamper", 1], ["personalised-brass-name-diya", 1]],
  },
  {
    customer: A, hoursAgo: 30, status: "PACKED", method: "NETBANKING", coupon: "GIFTING15", giftWrap: true,
    giftMessage: "For Meenal — for all the mehendi nights ahead. So happy for you!",
    items: [["wedding-trousseau-beauty-box", 1]],
    cancellationRequest: { reason: "Delivery date is too late", comment: "The mehendi is on the 29th and the estimate shows the 1st. Please cancel if it can't come sooner." },
  },
  {
    customer: A, hoursAgo: 5, status: "CONFIRMED", method: "UPI",
    items: [["ubtan-brightening-face-pack", 1], ["smudge-proof-kajal-midnight-black", 2], ["matte-lipstick-terracotta-nude", 1]],
  },

  // ─── Other customers ─────────────────────────────────────────────────────
  { customer: "rahul", hoursAgo: 58 * D + 2, status: "DELIVERED", method: "UPI", courier: "Delhivery", items: [["corporate-thank-you-hamper", 3]] },
  { customer: "priya", hoursAgo: 55 * D + 6, status: "DELIVERED", method: "CARD", courier: "Blue Dart", items: [["mogra-jasmine-reed-diffuser", 1], ["rose-water-hydrating-toner", 1]] },
  { customer: "aditya", hoursAgo: 50 * D + 1, status: "DELIVERED", method: "COD", courier: "DTDC", items: [["smudge-proof-kajal-midnight-black", 1], ["matte-lipstick-gulmohar-red", 1]] },
  {
    customer: "fatima", hoursAgo: 47 * D + 4, status: "DELIVERED", method: "UPI", courier: "Delhivery", giftWrap: true,
    giftMessage: "Mubarak ho on the new home, Zara and Imran!", items: [["housewarming-brass-bloom-hamper", 1]],
  },
  { customer: "arjun", hoursAgo: 44 * D + 8, status: "DELIVERED", method: "NETBANKING", courier: "Blue Dart", items: [["rose-hibiscus-hair-oil", 2], ["kokum-butter-body-balm", 1]] },
  {
    customer: "sneha", hoursAgo: 41 * D + 3, status: "CANCELLED", method: "COD", items: [["monsoon-mitti-eau-de-toilette", 1]],
    cancel: { at: "CONFIRMED", by: "admin", reason: "Customer unreachable for COD confirmation" },
  },
  { customer: "vikram", hoursAgo: 36 * D + 2, status: "DELIVERED", method: "CARD", coupon: "WELCOME10", courier: "Blue Dart", items: [["vetiver-oud-eau-de-parfum", 1], ["sandalwood-attar-roll-on", 1]] },
  {
    customer: "kavya", hoursAgo: 33 * D + 5, status: "DELIVERED", method: "UPI", courier: "Delhivery", failedAttempt: "UPI request expired",
    items: [["kumkumadi-radiance-face-oil", 1], ["bakuchiol-night-renewal-cream", 1], ["saffron-under-eye-gel", 1]],
  },
  { customer: "mehul", hoursAgo: 30 * D + 4, status: "DELIVERED", method: "COD", courier: "DTDC", items: [["hand-painted-terracotta-diya-set", 3], ["temple-dhoop-cone-gift-box", 2]] },
  {
    customer: "ishita", hoursAgo: 27 * D + 6, status: "DELIVERED", method: "UPI", courier: "Delhivery", giftWrap: true,
    giftMessage: "Happy Rakhi, Bhaiya! Take care of your skin for once :)", items: [["rakhi-self-care-hamper", 1]],
  },
  { customer: "rohit", hoursAgo: 24 * D + 3, status: "DELIVERED", method: "CARD", courier: "Blue Dart", items: [["coffee-coconut-body-scrub", 1], ["sandalwood-haldi-bathing-bars", 1], ["kokum-butter-body-balm", 1]] },
  { customer: "sanjana", hoursAgo: 19 * D + 2, status: "DELIVERED", method: "UPI", coupon: "WELCOME10", courier: "Delhivery", items: [["mogra-musk-eau-de-parfum", 1]] },
  {
    customer: "karan", hoursAgo: 16 * D + 5, status: "DELIVERED", method: "CARD", coupon: "GIFTING15", courier: "Blue Dart", giftWrap: true,
    giftMessage: "Thank you for a brilliant quarter, team!", items: [["monogrammed-vegan-leather-travel-pouch", 2], ["vetiver-khus-room-mist", 1]],
  },
  { customer: "lakshmi", hoursAgo: 13 * D + 4, status: "DELIVERED", method: "UPI", courier: "DTDC", items: [["ubtan-brightening-face-pack", 2], ["rose-water-hydrating-toner", 2]] },
  {
    customer: "sneha", hoursAgo: 9 * D + 3, status: "DELIVERED", method: "UPI", courier: "Delhivery", giftWrap: true,
    giftMessage: "Welcome to motherhood, Rimi! This one is just for you.", items: [["new-mom-pamper-hamper", 1]],
  },
  { customer: "priya", hoursAgo: 8 * D + 1, status: "DELIVERED", method: "NETBANKING", courier: "Blue Dart", items: [["niacinamide-rice-water-serum", 1], ["vitamin-c-amla-day-cream", 1]] },
  {
    customer: "rohit", hoursAgo: 6 * D + 2, status: "CANCELLED", method: "UPI", items: [["festive-mithai-tin-box", 2], ["rakhi-thali-gift-set", 1]],
    cancel: { at: "PACKED", by: "customer", reason: "Gift occasion has passed" },
    // refund left PENDING for the refund-processing demo
  },
  { customer: "rahul", hoursAgo: 90, status: "OUT_FOR_DELIVERY", method: "CARD", courier: "Delhivery", items: [["brass-urli-floating-candle-set", 1], ["saffron-sandalwood-soy-candle", 1]] },
  { customer: "lakshmi", hoursAgo: 75, status: "SHIPPED", method: "NETBANKING", courier: "Blue Dart", giftWrap: true, items: [["saffron-sandalwood-soy-candle", 1], ["mogra-jasmine-reed-diffuser", 1]] },
  {
    customer: "fatima", hoursAgo: 70, status: "SHIPPED", method: "COD", courier: "DTDC",
    giftMessage: "For Ammi and Abbu — with love.", items: [["personalised-brass-name-diya", 2]],
  },
  { customer: "arjun", hoursAgo: 55, status: "SHIPPED", method: "UPI", coupon: "FESTIVE500", courier: "Delhivery", items: [["diwali-diya-dry-fruit-hamper", 2]] },
  {
    customer: "mehul", hoursAgo: 26, status: "CONFIRMED", method: "CARD", coupon: "FESTIVE500", items: [["corporate-thank-you-hamper", 5]],
    cancellationRequest: { reason: "Want to change address or items", comment: "We need 8 hampers instead of 5, shipped to our office. Will place a fresh order." },
  },
  { customer: "kavya", hoursAgo: 20, status: "PACKED", method: "UPI", items: [["dewy-skin-tint-warm-honey", 1], ["lip-cheek-tint-pomegranate", 1]] },
  { customer: "vikram", hoursAgo: 12, status: "CONFIRMED", method: "UPI", coupon: "FREESHIP", items: [["kokum-butter-body-balm", 1]] },
  { customer: "ishita", hoursAgo: 8, status: "CONFIRMED", method: "COD", items: [["custom-couple-name-candle", 1], ["engraved-sheesham-keepsake-box", 1]] },
  { customer: "sanjana", hoursAgo: 3, status: "PENDING_PAYMENT", method: "CARD", failedAttempt: "Card declined by issuing bank", items: [["bakuchiol-night-renewal-cream", 1]] },
  { customer: "karan", hoursAgo: 1.5, status: "PENDING_PAYMENT", method: "UPI", items: [["vetiver-oud-eau-de-parfum", 1]] },
];

/** Transit hop(s) between the Bengaluru hub and the destination city. */
export const transitHops: Record<string, string[]> = {
  Bengaluru: [],
  Chennai: ["Hosur"],
  Coimbatore: ["Hosur", "Salem"],
  Kochi: ["Hosur", "Coimbatore"],
  Hyderabad: ["Anantapur"],
  Mumbai: ["Hubballi", "Pune"],
  Pune: ["Hubballi"],
  Ahmedabad: ["Mumbai Air Hub"],
  Jaipur: ["Delhi Air Hub"],
  Chandigarh: ["Delhi Air Hub"],
  Gurugram: ["Delhi Air Hub"],
  Lucknow: ["Delhi Air Hub"],
  Indore: ["Mumbai Air Hub"],
  Kolkata: ["Kolkata Air Hub"],
  Bhubaneswar: ["Kolkata Air Hub"],
};
