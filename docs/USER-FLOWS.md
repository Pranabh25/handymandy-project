# User flows — client demo script

A click-through script for presenting LushAura to a client. Part 1 walks the customer journey end to end; Part 2
shows the same order from the admin side. Allow about **15 minutes** for Part 1 and **10 minutes** for Part 2.

## Before you start

- [ ] Database seeded (`npm run db:reset` gives a clean, predictable dataset) and `npm run dev` running.
- [ ] Two browser windows side by side: a normal window for the **customer** and a private/incognito window for the
      **admin** (they share one session cookie, so they must be separate browser profiles).
- [ ] Optional: upload photos for 3–4 hero products in Admin → Products first, so the storefront shows real imagery.
- [ ] Credentials to hand:

| Role | Where | Login |
| --- | --- | --- |
| Customer | `/login` | Mobile `9876543210` → OTP `123456` |
| Admin | `/admin/login` | `admin@lushaura.in` / `Admin@123` |
| Coupons | Cart / checkout | `WELCOME10`, `FESTIVE500`, `FREESHIP`, `GIFTING15` |
| Payment | Demo gateway | "Simulate success" / "Simulate failure"; test card `4111 1111 1111 1111` |

---

## Part 1 — Customer journey

### 1. Home — `/`
1. Point out the announcement bar ("Free shipping on orders above ₹999…"), the brand typography and the ivory /
   charcoal / terracotta palette.
2. Scroll: hero → category tiles → bestsellers → shop by occasion → festive banner → clean beauty → new arrivals →
   testimonials → brand story. Hover a product card to show the quick "Add to bag" and wishlist heart.
3. Type **"kumkumadi"** in the header search — show instant suggestions with price; press Enter for `/search`.

### 2. Shop & filter — `/shop` → `/gifts` or `/cosmetics`
1. Open **Shop All**. Show sorting (Bestsellers, Price, Biggest savings) and filters (price, rating, in stock).
2. Switch to **Cosmetics** and filter by skin type; switch to **Gifts** and filter by occasion "Diwali".
3. On mobile width (390px), open the filter drawer to show the responsive layout.

### 3. Category — `/category/gift-hampers`
1. Show the category header, breadcrumbs and product count; paginate if there are enough products.

### 4. Product — `/product/<slug>`
1. Open a hamper: gallery, MRP struck through with % off, stock status ("Only 3 left"), quantity selector.
2. Enter PIN code **560038** in the delivery check to show an estimated delivery date.
3. Expand "What's inside"; on a skincare product show key ingredients, full INCI list, how to use, and the
   cruelty-free / vegan badges.
4. Scroll to reviews (rating breakdown, verified buyer badges) and related products.
5. Tap the **heart** to add to wishlist, then **Add to bag**.

### 5. Wishlist & cart — `/wishlist` → `/cart`
1. Open **Wishlist**, move one item to the bag.
2. In the **Cart**: change quantity, show the free-shipping progress bar ("Add ₹X more for free shipping").
3. Apply **`WELCOME10`** — discount appears in the summary. Try **`FESTIVE500`** on a smaller cart to show the
   minimum-order message.
4. Tick **Gift wrap (₹59)** and type a gift message.
5. Click **Checkout**.

### 6. Login with OTP — `/login?next=/checkout`
1. Enter **9876543210** → **Send OTP**. Point out the demo notice explaining the fixed OTP.
2. Enter **123456** → signed in and returned to checkout.

### 7. Checkout — `/checkout`
1. **Address**: pick the saved default address, or add a new one (show PIN code / mobile validation).
2. **Review**: items, gift wrap and message, coupon, and the full price breakdown (MRP savings, coupon, shipping,
   gift wrap, total, GST included).
3. **Payment**: choose **UPI** or **Card** (card number `4111 1111 1111 1111`). The demo gateway opens.
4. Click **Simulate failure** first — show the friendly failure message and that the order can be retried.
5. Click **Simulate success**.
6. Optional: place a second order with **Cash on Delivery** to show the ₹49 COD fee and instant confirmation.

### 8. Confirmation — `/checkout/success/<orderNumber>`
1. Show the order number (e.g. `LA2609264821`), the estimated delivery date and the next-step links.

### 9. My orders — `/account/orders` → `/account/orders/<orderNumber>`
1. Open **My Account** → **Orders**. Filter by status.
2. Open the new order: timeline (Order placed → Payment received → Confirmed), items, address, payment summary.

### 10. Tracking — `/track`
1. No login is needed for tracking: open **Track Order**, enter the order number and **9876543210**.
2. After the admin ships the order in Part 2, refresh to show courier, AWB and scan events.

### 11. Cancellation
1. On the order detail page click **Cancel order**, choose a reason ("Ordered by mistake") and submit.
2. The order shows **Cancellation requested** — it will be approved by the admin in Part 2.
3. Point out that shipped orders no longer show the cancel option.

### 12. Invoice — `/account/orders/<orderNumber>/invoice` or `/invoice/<orderNumber>`
1. Open the **GST tax invoice**: seller GSTIN, HSN codes, taxable value and GST split, amount in words.
2. Click **Print / Save as PDF**.

### 13. Content pages
Quick tour of the footer: **Our Story** (`/about`), **FAQs** (`/faq`), **Contact** (`/contact` — submit the form to
show the toast), **Shipping**, **Returns & Refunds**, **Privacy** (DPDP Act) and **Terms**. Visit a made-up URL to
show the branded 404.

---

## Part 2 — Admin journey

### 1. Login — `/admin/login`
Sign in with **admin@lushaura.in / Admin@123** in the private window.

### 2. Dashboard — `/admin`
Walk through the KPIs (revenue, orders, average order value, customers), the 30-day revenue chart, orders by
status, recent orders, **low stock** alerts and **pending actions** (cancellations to review, refunds to process).

### 3. Create a product — `/admin/products` → `/admin/products/new`
1. Click **New product**. Fill in name, category (e.g. Gift Hampers), price ₹2,499, MRP ₹2,999, stock 25, SKU.
2. Add tags, occasions (Diwali), recipients (For Her) and "What's inside" items.
3. **Upload 2–3 images** (drag & drop), reorder them, add alt text.
4. Save → open the product on the storefront (`/product/<slug>`) to show it live with the uploaded photos.
5. Optional: **Inventory** (`/admin/inventory`) — adjust stock inline.

### 4. Fulfil an order — `/admin/orders` → `/admin/orders/<id>`
1. Search for the customer's order (order number or phone); show status tabs and the **Export CSV** button.
2. Open the order that was paid in Part 1: customer, items, payment, gift message, timeline.
3. **Update status** → **Packed**.
4. **Add tracking**: courier **Blue Dart**, AWB **77412098351**, tick "Mark as shipped" → status becomes **Shipped**.
5. **Add tracking update**: "Arrived at hub", location **Bengaluru Hub**.
6. Switch to the customer window and refresh the order page / `/track` to show the updates.
7. Move to **Out for delivery** → **Delivered**. For a COD order, point out that payment becomes *Paid* on delivery.

### 5. Approve a cancellation — `/admin/cancellations`
1. Open the request raised in Part 1, add a note ("Approved — refund initiated") and **Approve**.
2. The order becomes **Cancelled**, stock is released, and a **refund** is queued automatically for paid orders.

### 6. Process the refund — `/admin/refunds`
1. Find the pending refund → **Mark processed**. A refund reference is generated.
2. In the customer window, the order now shows **Refunded** with the reference.
3. Show **Payments** (`/admin/payments`) — the ledger includes the failed attempt from Part 1 and the refund.

### 7. Coupons, reviews, settings
1. **Coupons** (`/admin/coupons`): create `DIWALI20` (20% off above ₹1,499, max ₹600), then deactivate it.
2. **Reviews** (`/admin/reviews`): approve a pending review; the product's star rating updates.
3. **Customers** (`/admin/customers`): open Ananya Sharma to show order history and lifetime value.
4. **Settings** (`/admin/settings`): change the announcement text or free-shipping threshold, save, and refresh the
   storefront to show it applied instantly.

---

## Talking points

- **Server-side pricing**: even if someone edits the cart in the browser, the server recalculates every rupee.
- **Real order lifecycle**: stock reservation, event timeline, cancellations and refunds are production logic; only
  the OTP and payment gateway are simulated.
- **India-first**: INR formatting, GST-inclusive prices and invoices, PIN codes, COD, UPI, DPDP-aware privacy policy,
  grievance officer details.
- **Easy to rebrand**: colours and fonts are tokens in `src/app/globals.css`; banner photos are in
  `src/config/media.ts`; product photos are uploaded in the admin.
