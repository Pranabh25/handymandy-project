/**
 * FAQ copy. Numbers here mirror the store defaults in src/server/settings.ts
 * (free shipping ₹999, shipping ₹79, COD ₹49, gift wrap ₹59). If an admin
 * changes those in Settings, update this copy too.
 */

export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "orders-payment",
    title: "Orders & payment",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "We accept UPI (Google Pay, PhonePe, Paytm and any UPI app), all major debit and credit cards including RuPay, net banking from 50+ banks, popular wallets, and Cash on Delivery on eligible PIN codes. All online payments are processed by a PCI-DSS compliant payment gateway — we never see or store your card details.",
      },
      {
        q: "Is Cash on Delivery available? Is there a fee?",
        a: "Yes, COD is available on most serviceable PIN codes across India. A convenience fee of ₹49 applies to COD orders to cover cash handling by our courier partners. Prepaid orders have no such fee.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "You sign in with your mobile number and a one-time password (OTP) at checkout — no password to remember. This lets you track orders, save addresses and request cancellations from My Orders.",
      },
      {
        q: "Are your prices inclusive of GST?",
        a: "Yes. All prices on LushAura are in Indian Rupees and include GST. A GST invoice is available to download from My Orders once your order is confirmed. For a business invoice with your company's GSTIN, write to care@lushaura.in before dispatch.",
      },
      {
        q: "How do I apply a coupon code?",
        a: "Enter the code in the ‘Apply coupon’ box on the cart or checkout page. Only one coupon can be used per order, and the discount is shown before you pay. Coupons can't be applied to gift wrap, shipping or COD fees unless the offer says so.",
      },
      {
        q: "My payment was deducted but the order wasn't confirmed. What now?",
        a: "Don't worry — this usually resolves on its own. If the payment doesn't reflect on your order within 30 minutes, the bank or gateway automatically reverses the amount to your original payment method within 5–7 working days. You can also write to us with the transaction reference and we'll help.",
      },
    ],
  },
  {
    id: "shipping-delivery",
    title: "Shipping & delivery",
    items: [
      {
        q: "How much does shipping cost?",
        a: "Shipping is free on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹79 applies anywhere in India.",
      },
      {
        q: "When will my order be dispatched?",
        a: "In-stock orders are packed and dispatched from our Bengaluru studio within 1–2 working days. Personalised items (engraved, monogrammed or name-printed) need an additional 2–3 working days to make.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery takes 3–7 days across India after dispatch. Metro cities such as Bengaluru, Mumbai, Delhi NCR, Chennai, Hyderabad, Pune and Kolkata usually receive orders in 2–4 days; remote and north-eastern PIN codes may take up to 7 days.",
      },
      {
        q: "How can I track my order?",
        a: "As soon as your parcel is handed to our courier partner, we share the courier name and AWB number by SMS and email. You can follow every scan from My Orders, or use the Track Order page with your order number and mobile number.",
      },
      {
        q: "Can you deliver on a specific date for a birthday or anniversary?",
        a: "We can't guarantee a fixed delivery date, but if you add the occasion date in your gift note we'll prioritise dispatch. For time-sensitive gifts, we recommend ordering at least 7 days in advance.",
      },
      {
        q: "Do you ship outside India?",
        a: "Not yet. We currently deliver to 19,000+ serviceable PIN codes across India. International shipping is on our roadmap.",
      },
    ],
  },
  {
    id: "gifting-personalisation",
    title: "Gifting & personalisation",
    items: [
      {
        q: "Can I send an order as a gift?",
        a: "Absolutely. Enter the recipient's address at checkout and tick ‘Gift wrap this order’. Invoices are never placed inside gift-wrapped parcels, and prices are not printed on the packing slip.",
      },
      {
        q: "What does gift wrapping include?",
        a: "For ₹59 per order, we wrap your items in our signature handmade paper with a cotton ribbon and a pressed-flower tag, and add a handwritten note with your message (up to 200 characters). Our hampers already arrive in a keepsake box, so gift wrap is optional for them.",
      },
      {
        q: "How does personalisation work?",
        a: "Products marked ‘Personalisable’ let you add a name, initials or a short message. We'll show you exactly how it will read before you pay. Please double-check spellings — personalised items are made just for you and cannot be returned or exchanged.",
      },
      {
        q: "Do you offer corporate and wedding gifting?",
        a: "Yes. We curate hampers for Diwali, client appreciation, employee onboarding and wedding favours, from 25 to 2,500 boxes, with custom sleeves, bulk GST invoicing and multi-address delivery. Choose ‘Corporate gifting’ on our Contact page and our team will reply within 48 hours.",
      },
    ],
  },
  {
    id: "returns-refunds",
    title: "Returns & refunds",
    items: [
      {
        q: "Can I cancel my order?",
        a: "Yes, you can request a cancellation from My Orders at any time before your order is dispatched. Once it has been shipped, the order can no longer be cancelled, but you may refuse a COD delivery.",
      },
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery if an item arrives damaged, defective or different from what you ordered. For hygiene reasons, cosmetics and skincare can be returned only if unopened with the seal intact. Personalised items are non-returnable unless they arrive damaged or with an error on our part.",
      },
      {
        q: "How do I report a damaged or wrong item?",
        a: "Email care@lushaura.in or WhatsApp us within 7 days of delivery with your order number and clear photos of the item and outer packaging. An unboxing video helps us resolve it faster. We'll arrange a free pickup or send a replacement.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are processed to your original payment method within 5–7 working days of cancellation approval or of the returned item passing our quality check. For COD orders, we refund to a bank account or UPI ID you share with us. You'll receive an email once the refund has been initiated.",
      },
    ],
  },
  {
    id: "products-ingredients",
    title: "Products & ingredients",
    items: [
      {
        q: "Are your products cruelty-free and vegan?",
        a: "All LushAura beauty products are cruelty-free — neither our finished products nor our ingredients are tested on animals. Most of our range is vegan; products containing honey, beeswax or ghee are clearly marked on the product page.",
      },
      {
        q: "What does ‘clean’ mean at LushAura?",
        a: "Our formulas are free from parabens, sulphates (SLS/SLES), mineral oil, phthalates and synthetic dyes. We draw on Ayurvedic ingredients like kumkumadi, saffron, turmeric, neem and sandalwood, and list the full INCI ingredient list on every product page.",
      },
      {
        q: "Are the products suitable for sensitive skin?",
        a: "Each product page lists the skin types it suits. We still recommend a patch test on your inner arm 24 hours before first use, especially for actives such as vitamin C or AHAs. If you have a skin condition, please consult your dermatologist.",
      },
      {
        q: "What is the shelf life of your products?",
        a: "Shelf life is printed on every pack, along with the manufacturing date and batch number. Most of our skincare lasts 12–24 months unopened and 6–12 months after opening. Our small-batch approach means you'll always receive fresh stock.",
      },
      {
        q: "Where are your products made?",
        a: "Everything we sell is made in India — our skincare in licensed facilities in Karnataka and Kerala, and our gifts by more than 40 artisan partners, from block printers in Jaipur to potters in Khurja. The manufacturer's name and address are listed on each product page and pack.",
      },
    ],
  },
];
