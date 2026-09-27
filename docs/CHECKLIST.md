# LushAura — Build Checklist

Status legend: ✅ done · 🔄 in progress · ⬜ not started

The project is delivered in phases. Each phase ends with a verification pass
before moving on.

---

## Phase 1 — Foundation ✅

| # | Item | Status |
|---|------|--------|
| 1.1 | Next.js 16 (App Router, TypeScript, Turbopack) project scaffold | ✅ |
| 1.2 | Tailwind v4 + shadcn/ui (Base UI) primitives installed | ✅ |
| 1.3 | LushAura design tokens: ivory / charcoal / terracotta / sage, Cormorant Garamond + Manrope | ✅ |
| 1.4 | Local PostgreSQL 16 running, `lushaura` database created | ✅ |
| 1.5 | Prisma 7 schema — users, OTP, addresses, categories, products (cosmetic + gift metadata), images, reviews, coupons, orders, items, events, payments, cancellations, refunds, store settings, contact, newsletter | ✅ |
| 1.6 | Initial migration applied | ✅ |
| 1.7 | `.env` / `.env.example`, npm scripts (`db:migrate`, `db:seed`, `db:reset`, `typecheck`) | ✅ |
| 1.8 | Signed-cookie sessions (jose), `requireUser` / `requireAdmin`, `proxy.ts` route guard | ✅ |
| 1.9 | Mock OTP login + admin password login server actions | ✅ |
| 1.10 | Pricing engine (MRP, coupon, free-shipping threshold, gift wrap, COD fee, GST) | ✅ |
| 1.11 | Order service: create order, demo payment, status changes, tracking, cancellation, refunds | ✅ |
| 1.12 | Catalogue queries: filters, sort, search, facets, related products | ✅ |
| 1.13 | Client cart + wishlist store (localStorage, re-checked at checkout) | ✅ |
| 1.14 | Shared components: ProductCard, ProductImage (branded placeholder), Price, RatingStars, StatusBadge, EmptyState, Breadcrumbs, DemoNotice | ✅ |
| 1.15 | Store layout: announcement bar, header, search autocomplete, mobile menu, footer + newsletter | ✅ |
| 1.16 | Admin shell: sidebar, mobile menu, login page, page header/card | ✅ |
| 1.17 | Banner images config (`src/config/media.ts`) — unbranded placeholders, swappable | ✅ |
| 1.18 | Code conventions doc (`docs/CONVENTIONS.md`) | ✅ |

## Phase 2 — Feature build ✅

### 2A. Seed data ✅
- [x] Store settings, 8 categories
- [x] 38 products (INR price/MRP, SKU, stock, cosmetic + gift metadata)
- [x] Reviews (approved, pending, rejected)
- [x] Coupons: WELCOME10, FESTIVE500, FREESHIP, GIFTING15 (+ one expired, one inactive)
- [x] Admin and demo customer + ~14 customers with addresses
- [x] 33 orders in every status, with timelines, payments, cancellation requests, refunds

### 2B. Storefront catalogue ✅
- [x] Homepage (hero, trust strip, categories, bestsellers, occasions, festive banner, clean beauty, new arrivals, testimonials, story)
- [x] Shop, Gifts and Cosmetics pages, plus category pages, with filters, sort, chips, pagination and mobile filter drawer
- [x] Product detail (gallery, price, stock, qty, add to bag / buy now, pincode check, offers, cosmetic/gift details, accordions, reviews + write review, related, JSON-LD)
- [x] Search results page
- [x] Wishlist page

### 2C. Cart, checkout, login ✅
- [x] Cart (qty, remove, move to wishlist, free-shipping progress, coupon, gift wrap + message, summary)
- [x] Mock OTP login (phone → OTP 123456, resend timer, demo prefill)
- [x] Multi-step checkout (contact → address → review → payment)
- [x] Saved address management actions
- [x] Demo Razorpay-style payment modal (UPI / card / netbanking / wallet, simulate success/failure) + COD
- [x] Order confirmation page

### 2D. Account, tracking, invoice ✅
- [x] Account layout + overview + profile edit
- [x] Orders list with filters
- [x] Order detail: timeline, events, courier/AWB, payment, refunds, cancel request dialog
- [x] GST tax invoice (printable / save as PDF)
- [x] Addresses page
- [x] Public order tracking (`/track`)

### 2E. Admin — catalogue & store ✅
- [x] Dashboard (KPIs, 30-day revenue chart, status summary, recent orders, low stock, pending actions, top sellers)
- [x] Products list, create and edit — **with image upload** (stored in `UPLOAD_DIR`, served from `/uploads`)
- [x] Inventory (inline stock adjust)
- [x] Customers list + detail
- [x] Coupons CRUD
- [x] Reviews moderation (recalculates product rating)
- [x] Store settings (fees, thresholds, COD toggle, announcement)

### 2F. Admin — orders & money ✅
- [x] Orders list (search, status tabs, filters, pagination)
- [x] Order detail: update status, add tracking, tracking updates, timeline
- [x] Cancellation approval queue
- [x] Refund processing UI
- [x] Payments ledger

### 2G. Content, SEO, docs ✅
- [x] About, Contact (saves messages), FAQ (+ JSON-LD)
- [x] Shipping, Returns & Refunds, Privacy (DPDP-aware), Terms
- [x] sitemap.xml, robots.txt, favicon, Open Graph image
- [x] Branded 404, error and loading states
- [x] README.md + docs: ARCHITECTURE, DATA-MODEL, USER-FLOWS (demo script), ROUTES, DESIGN-SYSTEM

## Phase 3 — Integration & QA ⬜ (awaiting go-ahead)

- [ ] Resolve cross-module integration points (address actions, invoice links, admin ↔ account links)
- [x] `tsc` and `eslint` clean across the whole repo (done at end of Phase 2)
- [ ] `next build` succeeds
- [ ] Reset and re-seed the database from scratch
- [ ] End-to-end customer flow: Home → Shop → category → product → wishlist/cart → checkout → OTP → address → coupon → payment → confirmation → orders → tracking → cancel → invoice
- [ ] End-to-end admin flow: login → dashboard → create product + upload image → order status → tracking → approve cancellation → process refund
- [ ] Broken-link sweep (every nav/footer link returns 200)
- [ ] Responsive check at 390px, 768px, 1024px, 1440px
- [ ] Accessibility pass (labels, focus, contrast, keyboard)
- [ ] Remove any placeholder copy; final polish

## Phase 4 — Design revision ⬜ (after client feedback)

- [ ] Apply client design changes (tokens in `src/app/globals.css`, banners in `src/config/media.ts`)
- [ ] Upload real product photography via Admin → Products
- [ ] Replace demo brand details (`src/config/site.ts`, Admin → Settings)

## Later / production readiness ⬜ (not in demo scope)

- Real SMS OTP provider (MSG91 / Twilio), Razorpay live integration with webhook verification
- Cloud image storage (S3 / Cloudinary), transactional email/SMS notifications
- Hosting (Vercel + Neon/Supabase), backups, rate limiting, monitoring

---

## Notes

- 2026-09-26: the project was moved from `~/Documents/pranav` to `~/pranav` after macOS revoked this session's
  access to the Documents folder mid-build. Staged files were copied in afterwards; nothing was lost.
- Homepage/About use illustrative brand figures (4.8★, 1.2 lakh+ gifters, since 2019, 60 artisans, Jaipur studio) —
  confirm or replace before the client demo.
- FAQ states fees as text (₹999 / ₹79 / ₹49 / ₹59); the shipping policy page reads them live from Settings.

## Demo credentials

| Role | Login |
|------|-------|
| Customer | Phone `9876543210`, OTP `123456` (any valid mobile number works) |
| Admin | `admin@lushaura.in` / `Admin@123` at `/admin/login` |
| Coupons | `WELCOME10`, `FESTIVE500`, `FREESHIP`, `GIFTING15` |
| Payment | Demo gateway — "Simulate success / failure" buttons |
