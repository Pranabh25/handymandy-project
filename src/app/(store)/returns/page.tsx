import type { Metadata } from "next";
import Link from "next/link";
import { GrievanceOfficer, LEGAL_LAST_UPDATED, LegalPage, type LegalSection } from "@/components/content/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Returns, Cancellations & Refunds",
  description:
    "Cancel any LushAura order before dispatch. Returns within 7 days for damaged or incorrect items, and refunds to your original payment method in 5–7 working days.",
  alternates: { canonical: "/returns" },
};

const sections: LegalSection[] = [
  {
    id: "overview",
    title: "At a glance",
    content: (
      <ul>
        <li>Cancel any order free of charge before it is dispatched.</li>
        <li>Report damaged, defective or incorrect items within 7 days of delivery.</li>
        <li>Cosmetics and skincare can be returned only if unopened with the seal intact.</li>
        <li>Personalised items are non-returnable unless they arrive damaged or with an error on our part.</li>
        <li>Refunds are credited to your original payment method within 5–7 working days.</li>
      </ul>
    ),
  },
  {
    id: "cancellations",
    title: "Cancelling an order",
    content: (
      <>
        <p>
          You can request a cancellation from <Link href="/account/orders">My Orders</Link> at any time before your order is
          dispatched — that is, while its status is <em>Confirmed</em> or <em>Packed</em>. Choose a reason, and our team will
          review and approve the request, usually within a few working hours.
        </p>
        <p>
          Once an order has been shipped it can no longer be cancelled. For a Cash on Delivery order, you may refuse the
          parcel at the door. Personalised items that have already gone into production cannot be cancelled.
        </p>
        <p>
          We may cancel an order ourselves if an item goes out of stock, the delivery PIN code is not serviceable, or we
          suspect fraudulent activity. In that case we&apos;ll notify you and issue a full refund.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Return eligibility",
    content: (
      <>
        <p>
          We accept returns or replacements within <strong>7 days of delivery</strong> when:
        </p>
        <ul>
          <li>the product or its packaging arrived damaged or broken;</li>
          <li>the product is defective, leaking or past its expiry date;</li>
          <li>you received a different product, shade or size from what you ordered; or</li>
          <li>items are missing from your order or hamper.</li>
        </ul>
        <h3>Items we cannot accept back</h3>
        <ul>
          <li>Cosmetics, skincare, fragrance and bath products that have been opened, swatched or used, or whose seal is broken — for hygiene reasons.</li>
          <li>Personalised, engraved or made-to-order items (unless damaged or incorrect due to our error).</li>
          <li>Products returned without their original packaging, tags or freebies.</li>
          <li>Change-of-mind returns on hampers, candles and food items.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-to-return",
    title: "How to request a return",
    content: (
      <>
        <ul>
          <li>
            Email <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> or WhatsApp us on{" "}
            {siteConfig.whatsapp} within 7 days of delivery with your order number.
          </li>
          <li>Attach clear photos of the product, the outer box and the shipping label. An unboxing video helps us resolve claims faster.</li>
          <li>We&apos;ll confirm eligibility within 2 working days and arrange a free reverse pickup from your address.</li>
          <li>If reverse pickup isn&apos;t available at your PIN code, we&apos;ll ask you to self-ship and reimburse up to ₹100 of courier charges.</li>
        </ul>
        <p>
          Once the returned item passes our quality check (usually within 2 working days of receipt), we&apos;ll send a
          replacement or initiate a refund, as you prefer.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    content: (
      <>
        <p>
          Approved refunds are processed to your <strong>original payment method within 5–7 working days</strong> — from
          the approval of your cancellation, or from the returned item passing quality check. Your bank or card issuer may
          take a few additional days to reflect the credit.
        </p>
        <ul>
          <li>UPI, cards, net banking and wallets: refunded to the same account or instrument.</li>
          <li>Cash on Delivery: refunded to a bank account or UPI ID you share with us. We never ask for your card PIN, OTP or UPI PIN.</li>
          <li>The refund includes the product value, and shipping, gift wrap and COD fees paid on a fully cancelled order or on an item that was damaged or incorrect.</li>
        </ul>
        <p>You&apos;ll receive an email with the refund reference once it has been initiated, and the status is visible in My Orders.</p>
      </>
    ),
  },
  {
    id: "exchanges",
    title: "Exchanges",
    content: (
      <p>
        We don&apos;t offer exchanges for a different product or shade on change of mind. If an item was damaged or
        incorrect, we&apos;ll gladly send the same product as a replacement, subject to availability; otherwise we&apos;ll
        issue a full refund.
      </p>
    ),
  },
  {
    id: "grievances",
    title: "Grievance redressal",
    content: (
      <>
        <p>
          If you are not satisfied with how your request was handled, you may write to our Grievance Officer, appointed
          under the Consumer Protection (E-Commerce) Rules, 2020. We acknowledge every complaint within 48 hours and aim to
          resolve it within one month of receipt.
        </p>
        <GrievanceOfficer />
      </>
    ),
  },
];

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Returns, Cancellations & Refunds"
      summary="We want every LushAura parcel to be a joy to open. If something isn't right, here's exactly how we'll make it right."
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={sections}
    />
  );
}
