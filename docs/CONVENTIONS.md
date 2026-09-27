# Code conventions

Rules every contributor (human or AI) follows in this codebase.

## Stack & versions

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 16** App Router (Turbopack). Read `node_modules/next/dist/docs/` for APIs — this is newer than most training data. |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (tokens in `src/app/globals.css`) |
| UI primitives | shadcn/ui **`base-nova` style, built on Base UI (`@base-ui/react`) — not Radix** |
| Database | PostgreSQL 16 via **Prisma 7** (`prisma-client` generator, `@prisma/adapter-pg`) |
| Validation | Zod 4 |
| Toasts | `sonner` (`import { toast } from "sonner"`) |
| Icons | `lucide-react` |

## Next.js 16 gotchas

- `params` and `searchParams` are **Promises**: `const { slug } = await params`.
- `cookies()` / `headers()` are async.
- `middleware.ts` is now **`src/proxy.ts`** (already exists — do not add middleware).
- Page prop types: write them inline, e.g. `{ params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }`.
  Avoid the generated `PageProps<...>`/`LayoutProps<...>` helpers (they only exist after `next build`/`next dev` type generation).
- After a mutation in a server action, call `revalidatePath(...)` (from `next/cache`) for affected pages, or `router.refresh()` client-side.
- `revalidateTag` requires a second argument in v16 — prefer `revalidatePath`.
- Pages that read the DB are dynamic by default in this project (we do **not** enable `cacheComponents`).

## Base UI (not Radix) differences

- No `asChild`. To render a trigger as another element use the `render` prop:
  `<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>`.
- Components live in `src/components/ui/*` — read the file before using it to see exported parts.
- `Select` is Base UI's select (`onValueChange(value)`); for simple forms a native `<select>` styled like `Input` is fine and often simpler.
- `Checkbox` uses `checked` + `onCheckedChange`.
- `Button` sizes: `sm` (h-9), `default` (h-10), `lg` (h-12), `icon`, `icon-sm`. Variants: `default` (charcoal), `accent` (terracotta), `outline`, `secondary`, `ghost`, `destructive`, `link`.
- For links styled as buttons: `<Link className={buttonVariants({ variant: "outline" })} …>`.

## Folder structure

```
src/
  app/
    (store)/            storefront routes (header + footer layout)
    admin/login/        admin login (no panel chrome)
    admin/(panel)/      authenticated admin routes (sidebar layout, requireAdmin)
    api/                route handlers (search autocomplete, uploads)
  components/
    ui/                 shadcn/Base UI primitives (generated — edit sparingly)
    common/             brand-agnostic building blocks (EmptyState, StatusBadge, Breadcrumbs, DemoNotice…)
    layout/             header, footer, logo, search
    product/            ProductCard, ProductImage, Price, RatingStars, buttons
    cart/ checkout/ account/ admin/   feature components
    providers/          React context providers
  config/               site.ts (brand, nav, demo credentials), media.ts (banner images)
  hooks/                client hooks (use-cart.ts = cart + wishlist store)
  lib/                  framework-agnostic helpers (db, auth, format, pricing, validators, order-status)
  server/               server-only domain logic (catalog.ts, orders.ts, settings.ts)
    actions/            "use server" actions, one file per domain
  types/                shared TS types
prisma/                 schema, migrations, seed
```

## Data & domain rules

- Money is **whole rupees (Int)**. Always display with `formatINR()` from `@/lib/format`. Prices are GST-inclusive.
- Totals are computed only with `calculateTotals()` in `@/lib/pricing` (client for display, server for truth).
- All order state changes go through `src/server/orders.ts` (`createOrder`, `completeDemoPayment`, `updateOrderStatus`, `setTracking`, `addTrackingEvent`, `requestCancellation`, `resolveCancellation`, `processRefund`). Never update `Order.status` directly elsewhere.
- Enum labels/tones: `@/lib/order-status` (`ORDER_STATUS_META`, `PAYMENT_STATUS_META`, …) + `<StatusBadge tone=…>`.
- Catalogue reads: `src/server/catalog.ts` (`getProducts`, `getProductBySlug`, `toSummary`, …). Map products to `ProductSummary` before passing to client components.
- Cart & wishlist live client-side in `@/hooks/use-cart` (localStorage). The server re-validates at checkout.
- Store settings (fees, thresholds, COD toggle): `getStoreSettings()` on the server; `useStoreSettings()` on the client.
- Current user: `getCurrentUser()` / `requireUser(returnTo)` / `requireAdmin()` from `@/lib/auth` (server); `useCurrentUser()` (client).
- **Every admin server action must call `await requireAdmin()` first.** Every customer action must check ownership (`userId`).
- Server actions return `ActionResult` (`{ ok: true, data? } | { ok: false, error, fieldErrors? }`) from `@/types`; validate input with Zod.
- Product images: `<ProductImage src={…} alt group label />` — renders a branded placeholder when `src` is null (seeded products have no photos until uploaded in admin).

## UI & copy rules

- Brand: **LushAura** — warm ivory background, charcoal text, terracotta accent (`text-terracotta`, `bg-terracotta-soft`), sage for success/savings. No heavy pink, gradients, glassmorphism or dark mode.
- Headings use the display serif automatically (`h1–h3`). Admin headings use `font-sans` for a denser, tool-like feel.
- Use `container-page` for page width; `eyebrow` class for small uppercase labels.
- Shadows: `shadow-soft`, `shadow-lift`. Radius: `rounded-xl` cards, `rounded-lg` controls.
- Mobile-first; verify at 390px, 768px, 1024px and 1440px. No horizontal scroll.
- Every list has an empty state (`EmptyState`), every async action a pending state, every mutation a toast.
- Accessibility: labels on all inputs, `aria-live`/`role="alert"` for errors, focus-visible rings, alt text, semantic landmarks.
- Copy: Indian English, INR, Indian cities/pincodes, warm and concise. **No lorem ipsum, no placeholder text.**
- Label demo-only behaviour with `<DemoNotice>`.
- Keep files focused (< ~300 lines); split into components.
