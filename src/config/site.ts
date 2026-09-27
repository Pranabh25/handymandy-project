/**
 * Brand + storefront configuration. Values that the admin can change at runtime
 * (fees, thresholds, support contacts) live in the StoreSetting table; these are
 * static defaults and brand copy.
 */
export const siteConfig = {
  name: "LushAura",
  legalName: "LushAura Lifestyle Private Limited",
  tagline: "Thoughtful gifts & clean beauty, made in India",
  description:
    "LushAura is a premium Indian gifting and clean-beauty brand. Discover handcrafted hampers, personalised gifts, skincare, makeup and fragrances — delivered across India.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_IN",
  currency: "INR",
  supportEmail: "care@lushaura.in",
  supportPhone: "+91 80 4718 2290",
  whatsapp: "+91 98450 12877",
  supportHours: "Mon–Sat, 10 am – 7 pm IST",
  address: "No. 14, 2nd Floor, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
  gstin: "29AAECL4821K1Z6",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    pinterest: "https://pinterest.com/",
    youtube: "https://youtube.com/",
  },
} as const;

/** Demo-only switches. Nothing here processes real money or sends real OTPs. */
export const demoConfig = {
  otp: "123456",
  otpTtlMinutes: 10,
  customer: { name: "Ananya Sharma", phone: "9876543210", email: "ananya@lushaura.in" },
  admin: { email: "admin@lushaura.in", password: "Admin@123" },
} as const;

export const mainNav = [
  { label: "Shop All", href: "/shop" },
  { label: "Gifts", href: "/gifts" },
  { label: "Cosmetics", href: "/cosmetics" },
  { label: "Hampers", href: "/category/gift-hampers" },
  { label: "Personalised", href: "/category/personalised-gifts" },
  { label: "Our Story", href: "/about" },
] as const;

export const footerNav = {
  shop: [
    { label: "Shop All", href: "/shop" },
    { label: "Gift Hampers", href: "/category/gift-hampers" },
    { label: "Personalised Gifts", href: "/category/personalised-gifts" },
    { label: "Skincare", href: "/category/skincare" },
    { label: "Makeup", href: "/category/makeup" },
    { label: "Fragrance", href: "/category/fragrance" },
  ],
  help: [
    { label: "Track Order", href: "/track" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "FAQs", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export const CANCELLATION_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery date is too late",
  "Want to change address or items",
  "Gift occasion has passed",
  "Other",
] as const;
