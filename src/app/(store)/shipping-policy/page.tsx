import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_LAST_UPDATED, LegalPage, type LegalSection } from "@/components/content/legal-page";
import { getStoreSettings } from "@/server/settings";
import { formatINR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Free shipping across India on orders above ₹999. Dispatch in 1–2 working days and delivery in 3–7 days. Read LushAura's full shipping policy.",
  alternates: { canonical: "/shipping-policy" },
};

export default async function ShippingPolicyPage() {
  const s = await getStoreSettings();
  const free = formatINR(s.freeShippingThreshold);

  const sections: LegalSection[] = [
    {
      id: "coverage",
      title: "Where we deliver",
      content: (
        <>
          <p>
            We deliver to more than 19,000 serviceable PIN codes across all states and union territories of India through
            our courier partners (Blue Dart, Delhivery, DTDC, Ecom Express and India Post for remote locations). You can check
            whether your PIN code is serviceable on any product page or at checkout.
          </p>
          <p>We do not currently ship outside India or to APO/FPO addresses.</p>
        </>
      ),
    },
    {
      id: "charges",
      title: "Shipping charges",
      content: (
        <>
          <ul>
            <li>
              <strong>Orders of {free} and above:</strong> free standard shipping.
            </li>
            <li>
              <strong>Orders below {free}:</strong> a flat shipping fee of {formatINR(s.shippingFee)}.
            </li>
            <li>
              <strong>Cash on Delivery:</strong> an additional convenience fee of {formatINR(s.codFee)} per order.
            </li>
            <li>
              <strong>Gift wrap:</strong> {formatINR(s.giftWrapFee)} per order, including a handwritten note.
            </li>
          </ul>
          <p>
            The free-shipping threshold is calculated on the order value after any coupon discount. All charges are shown
            clearly at checkout before you pay and are inclusive of GST.
          </p>
        </>
      ),
    },
    {
      id: "dispatch",
      title: "Dispatch timelines",
      content: (
        <>
          <p>
            In-stock orders are packed by hand at our Bengaluru studio and dispatched within <strong>1–2 working days</strong>{" "}
            of order confirmation. Working days are Monday to Saturday, excluding national and Karnataka state holidays.
          </p>
          <p>
            Personalised items (engraving, monograms or name printing) need an additional 2–3 working days. Pre-order and
            festive-edition products show their expected dispatch date on the product page.
          </p>
        </>
      ),
    },
    {
      id: "delivery",
      title: "Delivery timelines",
      content: (
        <>
          <p>
            Once dispatched, orders are usually delivered within <strong>3–7 days</strong>:
          </p>
          <ul>
            <li>Bengaluru and other metro cities: 2–4 days</li>
            <li>Tier 2 and Tier 3 cities: 4–6 days</li>
            <li>North-eastern states, Jammu &amp; Kashmir, Ladakh, Andaman &amp; Nicobar and Lakshadweep: 5–7 days or more</li>
          </ul>
          <p>
            The estimated delivery date shown at checkout is indicative. Delays can occur during festive peaks (such as the
            weeks before Diwali and Raksha Bandhan), due to weather, local restrictions or other events beyond our control.
            We&apos;ll keep you informed by SMS and email if your parcel is delayed.
          </p>
        </>
      ),
    },
    {
      id: "tracking",
      title: "Order tracking",
      content: (
        <p>
          When your order ships, we send you the courier name and tracking (AWB) number by SMS and email. You can follow your
          parcel from <Link href="/account/orders">My Orders</Link> or on the <Link href="/track">Track Order</Link> page
          using your order number and mobile number.
        </p>
      ),
    },
    {
      id: "gifts",
      title: "Gift orders",
      content: (
        <p>
          You may ship an order to any address in India. For gift-wrapped orders we never include the invoice or prices in
          the parcel — the invoice is emailed to you and available in My Orders. Please share the recipient&apos;s correct
          mobile number so our courier partner can coordinate delivery.
        </p>
      ),
    },
    {
      id: "failed-delivery",
      title: "Failed or refused deliveries",
      content: (
        <>
          <p>
            Our courier partners make up to three delivery attempts. If a parcel cannot be delivered because the address is
            incomplete, the recipient is unreachable or the delivery is refused, it is returned to us.
          </p>
          <ul>
            <li>For prepaid orders, we refund the product value to your original payment method once the parcel reaches us, less the original shipping fee (if any).</li>
            <li>We may disable Cash on Delivery for accounts with repeated refused COD deliveries.</li>
          </ul>
        </>
      ),
    },
    {
      id: "damaged",
      title: "Damaged or tampered parcels",
      content: (
        <p>
          Please do not accept a parcel if the outer packaging is visibly damaged or tampered with. If you notice damage after
          opening, write to us within 7 days of delivery with photos (and an unboxing video if possible) — see our{" "}
          <Link href="/returns">Returns, Cancellations &amp; Refunds</Link> policy for next steps.
        </p>
      ),
    },
    {
      id: "packaging",
      title: "Packaging",
      content: (
        <p>
          We ship in recycled kraft cartons with paper tape and honeycomb paper instead of bubble wrap. Glass products are
          protected with moulded pulp inserts. Around 92% of our packaging by weight is recyclable or compostable.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Shipping Policy"
      summary={`How and when your LushAura order reaches you. Free shipping on orders of ${free} and above, dispatch within 1–2 working days and delivery across India in 3–7 days.`}
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={sections}
    />
  );
}
