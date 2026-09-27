# Routes

All routes use the Next.js App Router under `src/app`. "Auth" describes who can open the route; protected routes are
checked twice — optimistically in `src/proxy.ts` and authoritatively with `requireUser()` / `requireAdmin()` in the
page, layout or handler (see [ARCHITECTURE.md](ARCHITECTURE.md#4-authentication--authorisation)).

Legend: **Public** — anyone · **Customer** — signed-in customer (redirects to `/login?next=…`) · **Owner** — the
customer who placed the order (or an admin) · **Admin** — `role = ADMIN` (redirects to `/admin/login`).

## Storefront — `src/app/(store)/`

Rendered inside the store layout (announcement bar, header with search, footer).

| Route | Purpose | Auth |
| --- | --- | --- |
| `/` | Home: hero, category tiles, bestsellers, occasions, festive banner, clean beauty, new arrivals, testimonials, story | Public |
| `/shop` | All products with filters, sort and pagination | Public |
| `/gifts` | Gifts group (hampers, personalised, home fragrance, festive) | Public |
| `/cosmetics` | Cosmetics group (skincare, makeup, fragrance, bath & body) | Public |
| `/category/[slug]` | Category listing, e.g. `/category/gift-hampers`, `/category/skincare` | Public |
| `/product/[slug]` | Product detail: gallery, price, stock, PIN code check, details, reviews, related, JSON-LD | Public |
| `/search?q=` | Search results | Public |
| `/wishlist` | Saved products (browser storage) | Public |
| `/cart` | Bag: quantities, coupon, gift wrap + message, free-shipping progress, summary | Public |
| `/login?next=` | Mobile number → OTP sign-in (demo OTP `123456`) | Public |
| `/checkout` | Multi-step checkout: contact → address → review → payment (demo gateway / COD) | Customer |
| `/checkout/success/[orderNumber]` | Order confirmation: order number, delivery estimate, items, totals, track / invoice links | Customer (order owner) |
| `/track` | Track an order with order number + mobile number | Public |
| `/about` | Our Story | Public |
| `/contact` | Contact form (saves `ContactMessage`) and support details | Public |
| `/faq` | FAQs with FAQPage JSON-LD | Public |
| `/shipping-policy` | Shipping policy | Public |
| `/returns` | Returns, Cancellations & Refunds | Public |
| `/privacy` | Privacy Policy (DPDP Act 2023-aware) | Public |
| `/terms` | Terms of Service | Public |

## Account — `src/app/(store)/account/`

| Route | Purpose | Auth |
| --- | --- | --- |
| `/account` | Overview: profile, recent orders, quick links | Customer |
| `/account/orders` | Order history with status filters | Customer |
| `/account/orders/[orderNumber]` | Order detail: timeline, courier/AWB, payment, refunds, cancel request | Owner |
| `/account/orders/[orderNumber]/invoice` | GST tax invoice within the account layout | Owner |
| `/account/addresses` | Address book (add, edit, delete, set default) | Customer |
| `/invoice/[orderNumber]` | Printable GST tax invoice without store chrome (print / save as PDF) | Owner or Admin |

## Admin — `src/app/admin/`

`/admin/login` has no panel chrome; everything else is inside `admin/(panel)/` whose layout calls `requireAdmin()`.

| Route | Purpose | Auth |
| --- | --- | --- |
| `/admin/login` | Email + password sign-in | Public |
| `/admin` | Dashboard: KPIs, 30-day revenue, status summary, recent orders, low stock, pending actions, top sellers | Admin |
| `/admin/orders` | Orders: search, status tabs, filters, pagination, CSV export | Admin |
| `/admin/orders/[id]` | Order detail: update status, courier + AWB, tracking updates, timeline, payment, cancellation/refund | Admin |
| `/admin/cancellations` | Cancellation requests queue: approve / reject with note | Admin |
| `/admin/refunds` | Refunds queue: mark processed / failed | Admin |
| `/admin/payments` | Payments ledger (all attempts) | Admin |
| `/admin/products` | Product list: search, filters, status | Admin |
| `/admin/products/new` | Create product with image upload | Admin |
| `/admin/products/[id]` | Edit product, manage images, archive | Admin |
| `/admin/inventory` | Stock levels with inline adjustments and low-stock highlighting | Admin |
| `/admin/customers` | Customer list | Admin |
| `/admin/customers/[id]` | Customer detail: orders, addresses, lifetime value | Admin |
| `/admin/coupons` | Coupons: create, edit, activate / deactivate, delete | Admin |
| `/admin/reviews` | Review moderation (approve / reject; recalculates product rating) | Admin |
| `/admin/settings` | Store settings: fees, free-shipping threshold, COD toggle, gift wrap, announcement, support contacts | Admin |

## API & file routes

| Route | Method | Purpose | Auth |
| --- | --- | --- | --- |
| `/api/search?q=` | GET | Autocomplete suggestions for the header search (JSON) | Public |
| `/api/admin/upload` | POST | Upload a product image (multipart field `file`, ≤ 5 MB, JPG/PNG/WebP/AVIF) → `{ url }` | Admin |
| `/api/admin/orders/export` | GET | Download filtered orders as CSV (same filters as `/admin/orders`) | Admin |
| `/uploads/[...path]` | GET | Serves uploaded files from `UPLOAD_DIR` with immutable caching | Public |

Mutations that aren't file uploads are **Server Actions** (not URL routes) in `src/server/actions/`:
`auth.ts`, `cart.ts`, `checkout.ts`, `addresses.ts`, `account.ts`, `reviews.ts`, `contact.ts`, `newsletter.ts`,
`admin-catalog.ts`, `admin-orders.ts`, `admin-coupons.ts`, `admin-reviews.ts`, `admin-settings.ts`.

## Metadata & special files

| Route / file | Purpose |
| --- | --- |
| `/sitemap.xml` (`src/app/sitemap.ts`) | Static routes + every ACTIVE product and every category |
| `/robots.txt` (`src/app/robots.ts`) | Allow all; disallow `/admin`, `/account`, `/checkout`, `/cart`, `/api`, `/invoice`, `/login` |
| `/opengraph-image` (`src/app/opengraph-image.tsx`) | Default 1200×630 social share image |
| `/icon.svg` (`src/app/icon.svg`), `/favicon.ico` | "LA" monogram favicon |
| `src/app/not-found.tsx` | Branded 404 for unmatched URLs (minimal header) |
| `src/app/(store)/not-found.tsx` | Branded 404 inside the store layout when a page calls `notFound()` |
| `src/app/error.tsx` / `src/app/global-error.tsx` | Error boundary with "Try again" / last-resort error page |
| `loading.tsx` files | Skeletons for store, listings, product, cart, account and admin segments |
