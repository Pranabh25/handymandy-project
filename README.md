**LushAura**

[Demo logins](#demo)[Features](#features)[Try pricing](#pricing)[Setup](#setup)[Scripts](#scripts)[Structure](#structure)[Troubleshooting](#help)

# LushAura

Premium Indian gifts and clean beauty — a client-ready direct-to-consumer store demo. Handcrafted hampers, personalised gifts and Ayurveda-inspired cosmetics, from catalogue to cart, checkout, order tracking, cancellations and refunds, with an admin panel to run it all.

Next.js 16TypeScriptTailwind v4Prisma 7PostgreSQL 16

**Everything involving money or phones is simulated.** OTPs are fixed, payments run through a demo gateway with Simulate success / failure buttons, and no real orders are fulfilled. Pricing, stock, coupons, order lifecycle, GST invoices and SEO work as they would in production.

Build progress is tracked phase by phase in [docs/CHECKLIST.md](docs/CHECKLIST.md).

## Demo credentials

Click any value to copy it. Demo only — change or remove these before a real deployment.

Customer login (`/login`)

Any valid Indian mobile number works and creates a new customer

Admin login (`/admin/login`)

Test card (display only — nothing is sent to the server)

Coupons

Payments: pick UPI, card, net banking or wallet, then press Simulate success or Simulate failure. Cash on Delivery confirms instantly.

Seeded rules: free shipping on ₹999+, otherwise ₹79 · COD fee ₹49 · gift wrap ₹59 with a handwritten note. Admins change these under Admin → Settings.

## Features

Switch between the storefront and the admin panel, or search for a feature.

## Try the pricing rules

A quick calculator using the seeded store rules and coupons, so you can see what a customer would pay.

Cart subtotal (₹)

[ ] Cash on Delivery\
[ ] Gift wrap + handwritten note

## Quick start

Tick each step as you go. You need Node.js 20.9+ (22 LTS recommended), npm and PostgreSQL 16 running locally (Postgres.app, Homebrew `postgresql@16` or Docker).

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Signs session cookies (16+ characters; required in production) |
| `NEXT_PUBLIC_SITE_URL` | Public base URL for canonical URLs, sitemap and Open Graph |
| `UPLOAD_DIR` | Where admin-uploaded product images live (default `./uploads`) |

Want fresh demo data? Run `npm run db:reset` to drop, re-migrate and re-seed.

## npm scripts

Filter by name, then copy the command.

## Project structure

Tap a folder to see what it holds.

Architecture notes live in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md); coding rules are in [docs/CONVENTIONS.md](docs/CONVENTIONS.md).

### Replacing images

## Troubleshooting

Type the error or a keyword to narrow the list.

## Documentation

[CHECKLIST — phased build tracker](docs/CHECKLIST.md) [ARCHITECTURE — rendering, auth, order state machine, SEO, security](docs/ARCHITECTURE.md) [DATA-MODEL — Prisma models, ER diagram, money rules](docs/DATA-MODEL.md) [USER-FLOWS — click-through demo script](docs/USER-FLOWS.md) [ROUTES — every route and its auth rule](docs/ROUTES.md) [DESIGN-SYSTEM — tokens, type, components](docs/DESIGN-SYSTEM.md) [CONVENTIONS — code rules for contributors](docs/CONVENTIONS.md)

© LushAura Lifestyle Private Limited (fictional brand for demonstration). Not a real store — no orders are fulfilled.
