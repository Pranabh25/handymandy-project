# LushAura — Premium Indian Gifts & Clean Beauty (D2C demo)

LushAura is a **client-ready demo** of a direct-to-consumer e-commerce store for a premium Indian brand that sells
handcrafted gift hampers, personalised gifts and clean, Ayurveda-inspired cosmetics. It includes a complete
storefront (catalogue → cart → checkout → order tracking → cancellations and refunds) and an admin panel for running
the store day to day.

Everything that would touch money or phones is **simulated**: OTPs are fixed, payments go through a demo gateway
with "Simulate success / failure" buttons, and no real orders are fulfilled. The rest — pricing, stock, coupons, order
lifecycle, GST invoices, SEO — works as it would in production.

> **Project status:** the build is tracked phase by phase in **[docs/CHECKLIST.md](docs/CHECKLIST.md)** — start there to
> see what's done, what's in progress, and what's planned for the design revision and production hardening.

---

## Contents

- [Demo credentials](#demo-credentials)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [npm scripts](#npm-scripts)
- [Project structure](#project-structure)
- [Replacing images](#replacing-images)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

---

## Demo credentials

> ⚠️ **Demo only.** These credentials exist in the seed data so the store can be shown end to end. Change or remove
> them before any real deployment.

| What | Value |
| --- | --- |
| **Customer login** (`/login`) | Mobile **`9876543210`**, OTP **`123456`** — any valid Indian mobile number works and creates a new customer |
| **Admin login** (`/admin/login`) | **`admin@lushaura.in`** / **`Admin@123`** |
| **Coupons** | **`WELCOME10`** (10% off above ₹499, up to ₹300) · **`FESTIVE500`** (₹500 off above ₹2,999) · **`FREESHIP`** (free shipping) · **`GIFTING15`** (15% off above ₹1,999, up to ₹750) |
| **Payments** | Demo gateway — choose UPI / card / net banking / wallet, then click **Simulate success** or **Simulate failure**. Cash on Delivery confirms instantly. |
| **Test card** | **`4111 1111 1111 1111`**, any future expiry, any CVV (display only — no card data is sent to the server) |

Seeded store rules: free shipping on orders of ₹999+, otherwise ₹79 · COD fee ₹49 · gift wrap ₹59 with a handwritten
note. Admins can change these under **Admin → Settings**.

---

## Features

### Storefront

- **Home** with hero, category tiles, bestsellers, occasions, festive banner and brand story
- **Catalogue**: Shop All, Gifts, Cosmetics and category pages with filters (price, rating, skin type, occasion,
  recipient, in stock), sort, pagination and a mobile filter drawer
- **Search** with debounced autocomplete in the header and a full results page
- **Product detail**: gallery, MRP vs price, stock status, PIN code check, offers, ingredients / how to use / what's
  inside, reviews (write a review), related products, Product + Breadcrumb JSON-LD
- **Wishlist** and **cart** (stored in the browser), free-shipping progress, coupon, gift wrap + gift message
- **Checkout**: mobile-OTP login, saved addresses, coupon, payment method, demo payment modal, confirmation
- **My Account**: overview, profile, orders with timeline and courier tracking, cancellation requests, refunds status,
  printable GST tax invoice, address book
- **Public order tracking** at `/track` (order number + mobile number)
- **Content & policies**: Our Story, Contact (saves messages), FAQs (FAQPage JSON-LD), Shipping, Returns &
  Refunds, Privacy (DPDP Act 2023-aware), Terms
- **SEO**: per-page metadata, canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph image, favicon, JSON-LD
- Branded 404, error and loading states; mobile-first and accessible

### Admin panel (`/admin`)

- **Dashboard**: KPIs, 30-day revenue chart, orders by status, recent orders, low stock, pending actions, top sellers
- **Orders**: search, status tabs, filters, CSV export; order detail with status changes, courier + AWB, tracking
  updates and full timeline
- **Cancellations** approval queue · **Refunds** processing · **Payments** ledger
- **Products**: list, create and edit with **image upload**, archive; **Inventory** with inline stock adjustments
- **Customers** list and detail · **Coupons** CRUD · **Reviews** moderation · **Store settings** (fees, thresholds,
  COD toggle, announcement bar, support contacts)

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) App Router (React 19, Server Components, Server Actions, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with brand tokens in `src/app/globals.css` |
| UI primitives | shadcn/ui (`base-nova` style) on [Base UI](https://base-ui.com) · `lucide-react` icons · `sonner` toasts |
| Database | PostgreSQL 16 via Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`) |
| Validation | Zod 4 |
| Auth | Mock OTP (customers), bcrypt password (admin), signed JWT session cookie via `jose` |
| Fonts | Cormorant Garamond (display) + Manrope (body) via `next/font` |

---

## Quick start

### Prerequisites

- **Node.js 20.9+** (Node 22 LTS recommended) and npm
- **PostgreSQL 16** running locally (Postgres.app, Homebrew `postgresql@16`, or Docker)

### Setup

```bash
# 1. Clone and install (postinstall runs `prisma generate`)
git clone <repo-url> lushaura
cd lushaura
npm install

# 2. Configure environment
cp .env.example .env
#    then edit .env and set DATABASE_URL, e.g.
#    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lushaura?schema=public"
#    and SESSION_SECRET (generate with: openssl rand -hex 32)

# 3. Create the database schema and load demo data
createdb lushaura            # if the database doesn't exist yet
npx prisma migrate dev
npx prisma db seed

# 4. Run the app
npm run dev
```

Open <http://localhost:3000> for the store and <http://localhost:3000/admin/login> for the admin panel.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret used to sign session cookies (≥ 16 characters; required in production) |
| `NEXT_PUBLIC_SITE_URL` | Public base URL — used for canonical URLs, sitemap and Open Graph |
| `UPLOAD_DIR` | Folder where admin-uploaded product images are stored (default `./uploads`) |

To start over with fresh demo data at any time: `npm run db:reset` (drops, re-migrates and re-seeds).

---

## npm scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | `prisma migrate dev` — apply / create migrations |
| `npm run db:seed` | `prisma db seed` — load demo categories, products, customers, orders and coupons |
| `npm run db:reset` | Drop the database, re-apply migrations and re-seed |
| `npm run db:studio` | Open Prisma Studio to browse data |

---

## Project structure

```
prisma/
  schema.prisma          data model (see docs/DATA-MODEL.md)
  migrations/            SQL migrations
  seed.ts, seed/         demo data
src/
  app/
    (store)/             storefront routes — header + footer layout
    admin/login/         admin sign-in
    admin/(panel)/       admin routes — sidebar layout, admin-only
    api/                 route handlers: search autocomplete, admin image upload, orders CSV export
    invoice/             printable GST invoice (no store chrome)
    uploads/             serves files from UPLOAD_DIR
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg, not-found.tsx, error.tsx
  components/            ui/ (primitives), layout/, product/, catalog/, cart/, checkout/, account/, admin/, content/, common/
  config/                site.ts (brand, nav, demo credentials) · media.ts (banner images)
  hooks/                 use-cart.ts (cart + wishlist, localStorage)
  lib/                   db, auth, pricing, format, validators, order-status
  server/                catalog, orders (order state machine), settings, storage, admin queries
    actions/             "use server" actions, one file per domain
  proxy.ts               optimistic route guard for /account and /admin
docs/                    architecture, data model, routes, user flows, design system, conventions, checklist
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how these pieces fit together and
[docs/CONVENTIONS.md](docs/CONVENTIONS.md) for coding rules.

---

## Replacing images

### Banner and marketing images

All hero, banner, category-tile and editorial photos are defined in **`src/config/media.ts`**. The demo uses
unbranded Unsplash photos. To use brand photography:

1. Put the files in `public/brand/` (e.g. `public/brand/hero.jpg`).
2. Change the matching `src` in `src/config/media.ts` to `"/brand/hero.jpg"` and update the `alt` text.
3. If you host images on another domain (a CDN), add it to `images.remotePatterns` in `next.config.ts` and to
   `REMOTE_IMAGE_HOSTS` in `media.ts`.

No component changes are needed.

### Product images

Product photos are **not** in the codebase. Upload them from **Admin → Products → (product) → Images**. Files are
validated (JPG, PNG, WebP or AVIF, up to 5 MB, checked by magic bytes), stored under `UPLOAD_DIR` and served from
`/uploads/…`. Until a product has a photo, the store shows a branded placeholder.

On a host without a persistent disk (e.g. Vercel), switch `src/server/storage.ts` to S3 / Cloudinary / R2 — see
"Going to production" in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#going-to-production).

---

## Troubleshooting

**`Can't reach database server at localhost:5432`**
PostgreSQL isn't running. Start it (`brew services start postgresql@16`, or open Postgres.app) and check that
`DATABASE_URL` in `.env` matches your user, password and database name.

**Postgres won't start on macOS after a crash or forced shutdown (stale `postmaster.pid`)**
If Postgres wasn't shut down cleanly, a stale lock file can stop it from starting (the log says
`lock file "postmaster.pid" already exists`). Make sure no `postgres` process is actually running
(`ps aux | grep postgres`), then remove the file and start again:

```bash
# Homebrew (Apple Silicon)
rm /opt/homebrew/var/postgresql@16/postmaster.pid
brew services restart postgresql@16
# Homebrew (Intel): /usr/local/var/postgresql@16/postmaster.pid
# Postgres.app:     ~/Library/Application Support/Postgres/var-16/postmaster.pid
```

**`Environment variable not found: DATABASE_URL` / Prisma client errors**
Make sure `.env` exists (copy `.env.example`) and run `npx prisma generate` after pulling schema changes.

**Re-seeding**
`npm run db:seed` clears all existing rows before inserting, so it is safe to run repeatedly on a development
database. It also removes product images added through the admin (the files stay in `UPLOAD_DIR`).
Never run it against a production database.

**`brew services start` fails with a Ruby error**
Start PostgreSQL directly instead:
`/opt/homebrew/opt/postgresql@16/bin/pg_ctl -D /opt/homebrew/var/postgresql@16 -l /opt/homebrew/var/postgresql@16/server.log start`

**`Operation not permitted` when the project is inside `~/Documents`, `~/Desktop` or `~/Downloads`**
macOS privacy protection blocks apps that haven't been granted access to these folders. Either allow your terminal /
editor under System Settings → Privacy & Security → Files & Folders, or keep the project outside those folders
(e.g. `~/pranav/lushaura`).

**Admin redirects back to `/admin/login`**
You're signed in as a customer (or not at all). Log in with the admin credentials above; customer and admin sessions
share one cookie, so logging in as one signs you out of the other.

**Uploaded product images don't show**
Check that `UPLOAD_DIR` exists and is writable, and that the server process runs from the project root.

---

## Documentation

| Document | What's inside |
| --- | --- |
| [docs/CHECKLIST.md](docs/CHECKLIST.md) | Phased build checklist and progress tracker |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Rendering model, data flow, auth, order state machine, SEO, security, production checklist |
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | Every Prisma model and enum, ER diagram, money conventions |
| [docs/USER-FLOWS.md](docs/USER-FLOWS.md) | Click-through demo script for customer and admin flows |
| [docs/ROUTES.md](docs/ROUTES.md) | All storefront, account, admin and API routes with auth requirements |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Brand tokens, typography, components, accessibility, breakpoints |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Code conventions for contributors (human or AI) |

---

© LushAura Lifestyle Private Limited (fictional brand for demonstration). Not a real store — no orders are fulfilled.
