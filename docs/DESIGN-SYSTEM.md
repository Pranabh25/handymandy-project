# Design system

LushAura's visual language: **premium Indian gifting meets clean, Ayurveda-inspired beauty**. Warm ivory surfaces,
deep charcoal ink, a muted terracotta accent, a classic serif for headings, generous whitespace, soft shadows and
restrained motion.

> **This is a first pass.** The design will be revised after the client's design feedback (see Phase 4 in
> [CHECKLIST.md](CHECKLIST.md)). Almost everything visual is driven by tokens, so most changes happen in two files:
> **`src/app/globals.css`** (colours, radius, shadows, base styles, component classes) and
> **`src/app/layout.tsx`** (fonts). Marketing photos live in **`src/config/media.ts`**.

- [Colour](#colour)
- [Typography](#typography)
- [Spacing & layout](#spacing--layout)
- [Radius & shadows](#radius--shadows)
- [Motion](#motion)
- [Component inventory](#component-inventory)
- [Usage guidelines](#usage-guidelines)
- [Accessibility checklist](#accessibility-checklist)
- [Responsive breakpoints](#responsive-breakpoints)
- [How to change the design](#how-to-change-the-design)

---

## Colour

Defined as CSS variables on `:root` in `src/app/globals.css` and exposed to Tailwind through `@theme inline`
(so `--terracotta` becomes `bg-terracotta`, `text-terracotta`, `border-terracotta`, …). Light theme only, by design.

### Brand palette

| Token | Hex | Tailwind | Use |
| --- | --- | --- | --- |
| `--ivory` | `#faf6f0` | `bg-ivory` / `text-ivory` | Page background, text on charcoal |
| `--sand` | `#efe6da` | `bg-sand` | Soft section backgrounds, icon circles, skeletons |
| `--charcoal` | `#2a2623` | `bg-charcoal` / `text-charcoal` | Primary text, primary buttons, footer |
| `--terracotta` | `#a85d45` | `text-terracotta` / `bg-terracotta` | Accent: eyebrows, links, highlights, `accent` button, focus ring |
| `--terracotta-soft` | `#f4e4da` | `bg-terracotta-soft` | Accent backgrounds, selected states, text selection |
| `--rose` | `#c98b7f` | `text-rose` | Accent on dark backgrounds (footer logo) |
| `--sage` | `#5f7a5c` | `text-sage` | Success, savings, "in stock" |
| `--sage-soft` | `#e5ece2` | `bg-sage-soft` | Success backgrounds |
| `--gold` | `#b08a4a` | `text-gold` / `border-gold` | Festive details, demo notices, ratings |

### Semantic (shadcn) tokens

| Token | Hex | Use |
| --- | --- | --- |
| `--background` | `#faf6f0` | `bg-background` |
| `--foreground` | `#2a2623` | `text-foreground` |
| `--card` / `--popover` | `#fffdf9` | Cards, dialogs, menus, inputs |
| `--primary` / `--primary-foreground` | `#2a2623` / `#faf6f0` | Default button |
| `--secondary` | `#efe6da` | Secondary button |
| `--muted` / `--muted-foreground` | `#f3ede4` / `#6f665e` | Subtle fills / secondary text |
| `--accent` / `--accent-foreground` | `#f4e4da` / `#7d3f2c` | Hover/selected accents, accent badges |
| `--destructive` | `#b3261e` | Errors, destructive actions |
| `--border` | `#e6ddd1` | Hairlines, card borders |
| `--input` | `#ddd2c4` | Input borders |
| `--ring` | `#a85d45` | Focus ring (terracotta) |

Charts use `--chart-1…5` = terracotta, charcoal, sage, gold, rose.

**Status tones** (`<StatusBadge tone>` in `src/components/common/status-badge.tsx`): `neutral`, `info` (blue-grey),
`success` (sage), `warning` (amber), `danger` (red), `accent` (terracotta). Order/payment enums map to tones in
`src/lib/order-status.ts`.

**Contrast**: charcoal on ivory ≈ 14:1; `#6f665e` muted text on ivory ≈ 5.4:1; terracotta `#a85d45` on ivory ≈ 4.6:1
(AA for normal text); ivory on charcoal ≈ 14:1. Avoid terracotta text on `terracotta-soft` below 14px.

## Typography

| Role | Font | Where set | Notes |
| --- | --- | --- | --- |
| Display / headings | **Cormorant Garamond** 400–700, normal + italic | `next/font` in `src/app/layout.tsx` → `--font-display` | Applied automatically to `h1–h3` and `.font-display`; `letter-spacing: -0.01em` |
| Body / UI | **Manrope** (variable) | `--font-body` → Tailwind `font-sans` | All body copy, buttons, forms, admin |

Scale (Tailwind classes used across the app):

| Element | Mobile → desktop |
| --- | --- |
| Page title (h1) | `text-4xl` → `md:text-5xl` (hero up to `md:text-6xl`), `leading-[1.05–1.1]`, `font-semibold`, `text-balance` |
| Section title (h2) | `text-3xl` → `md:text-4xl` |
| Card title (h3) | `text-xl` / `text-2xl` |
| Body | `text-sm` / `text-base`, `leading-6`–`leading-7` |
| Eyebrow | `.eyebrow` — 0.7rem, semibold, `tracking-[0.18em]`, uppercase, terracotta |
| Small print | `text-xs`, `text-muted-foreground` |

Use serif italics sparingly for emphasis (e.g. "Lush*Aura*", hero phrases, step numbers). **Admin headings use
`font-sans`** for a denser, tool-like feel.

## Spacing & layout

- **Page width**: `.container-page` = `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8` (1280px max, 16/24/32px gutters).
- **Section rhythm**: `py-12 md:py-16` for standard sections, `py-16 md:py-24` for marketing sections.
- **Grids**: product grids `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` with `gap-4 md:gap-6`; sidebars
  `lg:grid-cols-[14–16rem_1fr]`.
- **Stacks**: `space-y-2` label→input, `space-y-5` between form fields, `gap-3` between buttons.
- Use Tailwind's 4px spacing scale; avoid arbitrary pixel values.

## Radius & shadows

| Token | Value | Use |
| --- | --- | --- |
| `--radius` (`rounded-lg`) | 0.75rem (12px) | Buttons, inputs, controls |
| `rounded-xl` | 1.05rem (~17px) | Cards, panels, images |
| `rounded-full` | — | Chips, pills, avatars, icon circles |
| `shadow-soft` | `0 1px 2px rgb(42 38 35 / .04), 0 4px 16px rgb(42 38 35 / .05)` | Resting cards, forms |
| `shadow-lift` | `0 2px 4px rgb(42 38 35 / .05), 0 12px 32px rgb(42 38 35 / .08)` | Hovered cards, popovers, hero images |

Prefer borders (`border`, `#e6ddd1`) plus `shadow-soft` over heavy shadows.

## Motion

- Short, functional transitions: colour/opacity 150–200ms; image zoom on card hover; underline slide in the main nav;
  accordion height animation.
- `prefers-reduced-motion: reduce` disables animations and smooth scrolling globally (`globals.css`).
- No parallax, auto-playing carousels or bouncing elements.

## Component inventory

### Primitives — `src/components/ui/` (shadcn `base-nova` on Base UI)
`accordion`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button` (+ `buttonVariants`), `card`, `checkbox`,
`dialog`, `dropdown-menu`, `input`, `label`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`,
`separator`, `sheet`, `skeleton`, `slider`, `sonner` (Toaster), `switch`, `table`, `tabs`, `textarea`, `tooltip`.

Button variants: `default` (charcoal), `accent` (terracotta), `outline`, `secondary`, `ghost`, `destructive`, `link`.
Sizes: `xs`, `sm` (h-9), `default` (h-10), `lg` (h-12), `icon`, `icon-sm`, `icon-lg`. Base UI has **no `asChild`** — use
the `render` prop, or `buttonVariants()` on a `<Link>`.

### Common — `src/components/common/`
`Breadcrumbs` (+ BreadcrumbList JSON-LD), `DemoNotice`, `EmptyState`, `SectionHeading`, `StatusBadge`.

### Layout — `src/components/layout/`
`SiteHeader` + `AnnouncementBar`, `MobileNav`, `SearchBox` (autocomplete), `HeaderActions` (account, wishlist, bag),
`SiteFooter`, `NewsletterForm`, `Logo`.

### Product — `src/components/product/`
`ProductCard`, `ProductImage` (branded placeholder when no photo), `Price` (price, MRP, % off), `RatingStars`,
`AddToCartButton`, `WishlistButton`.

### Catalogue — `src/components/catalog/`
`ProductListing`, `ListingHeader`, `FilterPanel`, `MobileFilters`, `SortSelect`, `Pagination`, `ListingSkeleton`,
`WishlistView`; product detail: `ProductGallery`, `PurchasePanel`, `StockStatus`, `PincodeCheck`, `OffersBox`,
`ProductHighlights`, `ProductDetails`, `ReviewsSection`, `ReviewForm`, `product-json-ld`.

### Cart & checkout — `src/components/cart/`, `src/components/checkout/`
`CartView`, `CartLineItem`, `CouponBox`, `GiftOptions`, `FreeShippingProgress`, `PriceSummary`, `TrustNotes`,
`CartSkeleton`; `CheckoutSteps`, `StepSection`, `AddressStep`, `AddressForm`, `PaymentOptions`.

### Account — `src/components/account/`
`AccountNav`, `ProfileCard`, `OrderCard`, `OrderTimeline`, `OrderDetailSections`, `CancelOrderDialog`,
`AddressManager`, `AddressFormDialog`, `InvoiceTable`, `PrintButton`, `HelpBox`.

### Content — `src/components/content/`
`PageHero`, `LegalPage` (+ `GrievanceOfficer`), `ContactForm`, `FaqAccordion` (+ `faq-data`), about sections
(`ValuesGrid`, `HamperProcess`, `NumbersStrip`), `NotFoundContent`, `MinimalShell`.

### Admin — `src/components/admin/`
Shell: `AdminNav`, `AdminMobileNav`, `AdminPageHeader`. Shared: `ListToolbar`, `Pagination`, `SegmentedLinks`,
`Thumb`, native select styles. Dashboard: `KpiCard`, `RevenueChart`, `RecentOrders`, side panels. Orders: table,
filters, status form, tracking forms, timeline, customer/items/payment/resolution cards. Products: table, form
fields, `ImageManager` (upload + reorder), `TagInput`, `ChipSelect`. Cancellations, refunds and payments lists.

## Usage guidelines

- **One primary action per view** (charcoal `default` button). Use `accent` (terracotta) sparingly for promotional
  CTAs; `outline` for secondary actions.
- **Eyebrow + serif heading + muted description** is the standard section header (`SectionHeading`).
- Show money only with `formatINR()`; show MRP struck through next to price with the % off in sage/terracotta.
- **Every list has an empty state** (`EmptyState`), every async action a pending state (spinner + "…ing" label), every
  mutation a toast (`sonner`).
- Label anything simulated with `<DemoNotice>`.
- Imagery: warm, natural light, real textures (wood, kraft paper, linen, brass). Avoid stock clichés, heavy pink,
  gradients, glassmorphism and dark mode.
- Copy: Indian English, warm and concise, specific numbers (₹, days, PIN codes). No lorem ipsum.

## Accessibility checklist

- [ ] Every input has a visible `<Label>` (or `sr-only` label for icon-only search/newsletter fields).
- [ ] Errors are announced: field errors with `role="alert"`, linked with `aria-describedby`; `aria-invalid` on the field.
- [ ] Focus is always visible (`focus-visible` ring in terracotta); no `outline: none` without a replacement.
- [ ] "Skip to content" link targets `#main` on every layout.
- [ ] Semantic landmarks: one `<header>`, `<nav aria-label>`, `<main id="main">`, `<footer>`; one `<h1>` per page.
- [ ] Images have meaningful `alt` text; decorative images and icons use `alt=""` / `aria-hidden`.
- [ ] Colour is never the only signal (status badges include text; errors include messages).
- [ ] Text contrast ≥ 4.5:1 (≥ 3:1 for large text); check terracotta on tinted backgrounds.
- [ ] All interactive elements reachable and operable by keyboard; dialogs trap focus and close on Esc (Base UI).
- [ ] Touch targets ≥ 40px on mobile (buttons are h-10 / h-12; icon buttons `size-10`).
- [ ] Respect `prefers-reduced-motion`.
- [ ] Loading states use `role="status"` / `aria-live="polite"`.
- [ ] Page language `en-IN`; each page has a unique `<title>`.

## Responsive breakpoints

Tailwind v4 defaults, mobile-first:

| Prefix | Min width | Typical changes |
| --- | --- | --- |
| (none) | 0 | Single column, 2-up product grid, mobile menu and filter drawer, 16px gutters |
| `sm` | 640px | 24px gutters, 2-column forms |
| `md` | 768px | Header search appears, 3-up product grid, larger headings |
| `lg` | 1024px | Desktop nav, sidebars (filters, TOC, account nav), 4-up grid, 32px gutters |
| `xl` | 1280px | Wider search box; content capped at `max-w-7xl` |
| `2xl` | 1536px | No further changes |

Verify every page at **390px, 768px, 1024px and 1440px** with no horizontal scroll.

## How to change the design

| Change | Where |
| --- | --- |
| Colours | `:root` variables in `src/app/globals.css` (brand + semantic tokens); `themeColor` in `src/app/layout.tsx` viewport |
| Fonts | `Cormorant_Garamond` / `Manrope` imports in `src/app/layout.tsx` (keep the `--font-display` / `--font-body` variable names) |
| Radius | `--radius` in `globals.css` (all `rounded-*` sizes derive from it) |
| Shadows | `--shadow-soft`, `--shadow-lift` in `@theme inline` |
| Page width & gutters | `.container-page` in `globals.css` |
| Eyebrow, legal prose styles | `.eyebrow`, `.prose-legal` in `globals.css` |
| Logo | `src/components/layout/logo.tsx`, footer wordmark in `site-footer.tsx`, favicon `src/app/icon.svg`, OG image `src/app/opengraph-image.tsx` |
| Banner & category photos | `src/config/media.ts` |
| Brand name, contacts, navigation | `src/config/site.ts` (runtime contacts/fees also in Admin → Settings) |
| Button / input styles | `src/components/ui/button.tsx`, `input.tsx` (edit sparingly — they're generated primitives) |
