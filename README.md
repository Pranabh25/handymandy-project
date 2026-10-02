<div align="center">

# ✨ LushAura

### Premium Indian Gifts & Clean Beauty — D2C Demo

<p>
  <strong>A production-minded e-commerce demo for handcrafted gifting, personalised products and Ayurveda-inspired clean beauty.</strong>
</p>

<p>
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-project-structure">Structure</a> ·
  <a href="#-documentation">Documentation</a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma 7">
  <img src="https://img.shields.io/badge/Tailwind-CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4">
</p>

</div>

> [!IMPORTANT]
> **Demo project:** OTPs, payments and order fulfilment are simulated. Do **not** use the seeded credentials or demo payment flow for a real production store.

> [!TIP]
> **Project status:** the build is tracked phase by phase in **[docs/CHECKLIST.md](docs/CHECKLIST.md)**. Start there to see what's complete, in progress, and planned for design revision and production hardening.

LushAura is a **client-ready demo** of a direct-to-consumer e-commerce store for a premium Indian brand that sells handcrafted gift hampers, personalised gifts and clean, Ayurveda-inspired cosmetics. It includes a complete storefront — catalogue → cart → checkout → order tracking → cancellations/refunds — plus an admin panel for day-to-day store operations.

Everything that would touch money or phones is **simulated**: OTPs are fixed, payments go through a demo gateway with **Simulate success / failure** controls, and no real orders are fulfilled. The rest — pricing, stock, coupons, order lifecycle, GST invoices and SEO — is designed to behave like a production system.

---

## 🧭 Contents

- [✨ Features](#-features)
- [🔐 Demo Credentials](#-demo-credentials)
- [🧱 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📜 npm Scripts](#-npm-scripts)
- [📁 Project Structure](#-project-structure)
- [🖼️ Replacing Images](#️-replacing-images)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [📚 Documentation](#-documentation)
- [⚠️ Demo & Production Notes](#️-demo--production-notes)

---

## ✨ Features

<details open>
<summary><strong>🛍️ Storefront</strong></summary>

- **Home** with hero, category tiles, bestsellers, occasions, festive banner and brand story
- **Catalogue**: Shop All, Gifts, Cosmetics and category pages with filters (price, rating, skin type, occasion, recipient, in stock), sorting, pagination and mobile filter drawer
- **Search** with debounced autocomplete in the header and a full results page
- **Product detail** with gallery, MRP vs price, stock status, PIN code check, offers, ingredients, how-to-use, what's-inside, reviews, related products, Product + Breadcrumb JSON-LD
- **Wishlist & cart** stored in the browser, free-shipping progress, coupon, gift wrap and gift message
- **Checkout** with mobile OTP login, saved addresses, coupon, payment method, demo payment modal and confirmation
- **My Account** with profile, orders/timeline, courier tracking, cancellation requests, refund status, printable GST invoice and address book
- **Public order tracking** at `/track`
- **Content & policies**: Our Story, Contact, FAQs, Shipping, Returns & Refunds, Privacy and Terms
- **SEO**: per-page metadata, canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph image, favicon and JSON-LD
- Branded 404/error/loading states, mobile-first layout and accessibility

</details>

<details>
<summary><strong>⚙️ Admin Panel</strong></summary>

- **Dashboard** with KPIs, 30-day revenue chart, orders by status, recent orders, low-stock items, pending actions and top sellers
- **Orders** with search, status tabs, filters, CSV export, courier/AWB and tracking updates
- **Cancellations, refunds & payments** workflows
- **Products** with create/edit, image upload and archive
- **Inventory** with inline stock adjustments
- **Customers** list and detail views
- **Coupons** CRUD
- **Reviews** moderation
- **Store settings** for fees, thresholds, COD, announcement bar and support contacts

</details>

---

## 🔐 Demo Credentials

> [!WARNING]
> These credentials are included only for the demo/seed environment. Change or remove them before any real deployment.

| Area | Demo access |
|---|---|
| **Customer** (`/login`) | Mobile `9876543210`, OTP `123456` |
| **Admin** (`/admin/login`) | `admin@lushaura.in` / `Admin@123` |
| **Coupons** | `WELCOME10` · `FESTIVE500` · `FREESHIP` · `GIFTING15` |
| **Payments** | UPI / card / net banking / wallet → **Simulate success/failure** |
| **Test card** | `4111 1111 1111 1111` — future expiry, any CVV |

<details>
<summary><strong>💰 Seeded store rules</strong></summary>

- Free shipping on orders of **₹999+**
- Shipping below ₹999: **₹79**
- COD fee: **₹49**
- Gift wrap: **₹59**
- Gift wrap supports a handwritten note
- Admin-configurable under **Admin → Settings**

</details>

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) App Router |
| UI Runtime | React 19, Server Components, Server Actions, Turbopack |
| Language | TypeScript — strict |
| Styling | Tailwind CSS v4 |
| UI primitives | shadcn/ui (`base-nova`) + Base UI |
| Icons & notifications | `lucide-react` + `sonner` |
| Database | PostgreSQL 16 |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Validation | Zod 4 |
| Authentication | Mock OTP + bcrypt admin password + signed JWT cookie via `jose` |
| Fonts | Cormorant Garamond + Manrope |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 20.9+** — Node 22 LTS recommended
- **npm**
- **PostgreSQL 16** running locally, via Postgres.app, Homebrew or Docker

### 1. Clone & install

```bash
git clone <repo-url> lushaura
cd lushaura
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then edit `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lushaura?schema=public"
SESSION_SECRET="replace-with-a-secure-secret"
```

Generate a secure session secret with:

```bash
openssl rand -hex 32
```

### 3. Create the database & seed demo data

```bash
createdb lushaura
npx prisma migrate dev
npx prisma db seed
```

### 4. Start the development server

```bash
npm run dev
```

Then open:

- 🛍️ Store: `http://localhost:3000`
- 🔐 Admin: `http://localhost:3000/admin/login`
- 📦 Public tracking: `http://localhost:3000/track`

<details>
<summary><strong>🔧 Environment variables</strong></summary>

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret used to sign session cookies; required in production |
| `NEXT_PUBLIC_SITE_URL` | Public base URL for canonical URLs, sitemap and Open Graph |
| `UPLOAD_DIR` | Directory for admin-uploaded product images; defaults to `./uploads` |

</details>

> 💡 To start over with fresh demo data, run `npm run db:reset`.

---

## 📜 npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with Turbopack |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run db:migrate` | Apply/create Prisma migrations |
| `npm run db:seed` | Seed demo categories, products, customers, orders and coupons |
| `npm run db:reset` | Drop, migrate and re-seed the database |
| `npm run db:studio` | Open Prisma Studio |

---

## 📁 Project Structure

```text
prisma/
├── schema.prisma          # Data model
├── migrations/            # SQL migrations
└── seed.ts, seed/         # Demo data

src/
├── app/
│   ├── (store)/           # Storefront routes
│   ├── admin/login/       # Admin sign-in
│   ├── admin/(panel)/     # Admin routes
│   ├── api/               # API route handlers
│   ├── invoice/           # Printable GST invoice
│   ├── uploads/           # Uploaded image serving
│   └── sitemap.ts, robots.ts, opengraph-image.tsx, ...
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   ├── admin/
│   ├── content/
│   └── common/
├── config/
│   ├── site.ts            # Brand, navigation and demo credentials
│   └── media.ts           # Marketing/banner images
├── hooks/
│   └── use-cart.ts        # Cart + wishlist localStorage state
├── lib/                   # DB, auth, pricing, formatting, validation
├── server/
│   ├── actions/           # Server Actions by domain
│   └── ...                # Catalog, orders, settings, storage, admin
└── proxy.ts               # Route guard for /account and /admin

docs/
├── CHECKLIST.md
├── ARCHITECTURE.md
├── DATA-MODEL.md
├── USER-FLOWS.md
├── ROUTES.md
├── DESIGN-SYSTEM.md
└── CONVENTIONS.md
```

> 📖 See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for system/data flow and **[docs/CONVENTIONS.md](docs/CONVENTIONS.md)** for coding rules.

---

## 🖼️ Replacing Images

<details open>
<summary><strong>Marketing & banner images</strong></summary>

All hero, banner, category-tile and editorial photos are defined in `src/config/media.ts`.

1. Add brand photography under `public/brand/`.
2. Update the matching `src` in `src/config/media.ts`, for example:
   ```ts
   src: "/brand/hero.jpg"
   ```
3. Update the corresponding `alt` text.
4. For a CDN/remote host, add the domain to `images.remotePatterns` in `next.config.ts` and `REMOTE_IMAGE_HOSTS` in `media.ts`.

No component changes are required.

</details>

<details>
<summary><strong>Product images</strong></summary>

Product photos are intentionally not stored in the codebase.

Upload them through:

**Admin → Products → Product → Images**

Uploads are validated for JPG, PNG, WebP or AVIF, up to 5 MB, checked by magic bytes, stored under `UPLOAD_DIR` and served from `/uploads/...`.

For hosts without persistent local storage (such as Vercel), switch `src/server/storage.ts` to S3, Cloudinary or R2.

</details>

---

## 🛠️ Troubleshooting

<details>
<summary><strong>Can't reach database server at localhost:5432</strong></summary>

PostgreSQL isn't running. Start it and verify that `DATABASE_URL` matches the database name, user and password.

</details>

<details>
<summary><strong>Postgres won't start on macOS after a crash</strong></summary>

If the log reports a stale `postmaster.pid`, first confirm no PostgreSQL process is running:

```bash
ps aux | grep postgres
```

Then remove the stale lock file and restart PostgreSQL:

```bash
# Apple Silicon
rm /opt/homebrew/var/postgresql@16/postmaster.pid
brew services restart postgresql@16

# Intel
# /usr/local/var/postgresql@16/postmaster.pid

# Postgres.app
# ~/Library/Application Support/Postgres/var-16/postmaster.pid
```

</details>

<details>
<summary><strong>DATABASE_URL / Prisma client errors</strong></summary>

Make sure `.env` exists:

```bash
cp .env.example .env
npx prisma generate
```

Run `npx prisma generate` after pulling schema changes.

</details>

<details>
<summary><strong>Re-seeding</strong></summary>

`npm run db:seed` clears existing rows before inserting demo data, so it can be repeated during development.

It also removes product images from the database while the files remain in `UPLOAD_DIR`.

> [!CAUTION]
> Never run the seed process against a production database.

</details>

<details>
<summary><strong>brew services fails with a Ruby error</strong></summary>

Start PostgreSQL directly:

```bash
/opt/homebrew/opt/postgresql@16/bin/pg_ctl   -D /opt/homebrew/var/postgresql@16   -l /opt/homebrew/var/postgresql@16/server.log start
```

</details>

<details>
<summary><strong>Operation not permitted on macOS</strong></summary>

macOS privacy protection can block terminals/editors from `~/Documents`, `~/Desktop` or `~/Downloads`.

Either grant access under **System Settings → Privacy & Security → Files & Folders**, or keep the project outside protected folders.

</details>

<details>
<summary><strong>Admin redirects back to /admin/login</strong></summary>

You are either not signed in or are signed in as a customer.

Customer and admin sessions share one cookie, so logging in as one signs you out of the other.

</details>

<details>
<summary><strong>Uploaded product images don't show</strong></summary>

Check that `UPLOAD_DIR` exists, is writable and that the server process is running from the project root.

</details>

---

## 📚 Documentation

| Document | Purpose |
|---|---|
| [docs/CHECKLIST.md](docs/CHECKLIST.md) | Phased build checklist and progress tracker |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Rendering model, data flow, auth, order state machine, SEO, security and production checklist |
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | Prisma models, enums, ER diagram and money conventions |
| [docs/USER-FLOWS.md](docs/USER-FLOWS.md) | Click-through demo scripts for customer and admin flows |
| [docs/ROUTES.md](docs/ROUTES.md) | Storefront, account, admin and API routes with auth requirements |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Brand tokens, typography, components, accessibility and breakpoints |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Code conventions for human and AI contributors |

---

## ⚠️ Demo & Production Notes

- 💳 **Payments are simulated.** No real payment is captured.
- 📱 **OTP is simulated.** Do not treat the demo OTP flow as production authentication.
- 📦 **Orders are not fulfilled.**
- 🔑 **Demo admin credentials must be rotated/removed before deployment.**
- 🗄️ **Local uploads require persistent storage.** Use object storage such as S3/Cloudinary/R2 for ephemeral hosting.
- 🔒 Review secrets, session handling, rate limits, logging, CSRF protections and authorization before production use.
- 🌐 Configure `NEXT_PUBLIC_SITE_URL` correctly before deploying.
- 🧪 Run `npm run lint`, `npm run typecheck` and `npm run build` before release.

---

<div align="center">

### Built as a production-minded D2C e-commerce demonstration

**LushAura Lifestyle Private Limited** · Fictional brand · No real orders are fulfilled

</div>

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
