import type { Metadata } from "next";
import Link from "next/link";
import { GrievanceOfficer, LEGAL_LAST_UPDATED, LegalPage, type LegalSection } from "@/components/content/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of lushaura.in and purchases from LushAura Lifestyle Private Limited.",
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "About these terms",
    content: (
      <>
        <p>
          These Terms of Service govern your access to and use of lushaura.in (the &ldquo;Website&rdquo;) and any purchase
          you make from {siteConfig.legalName}, a company incorporated under the Companies Act, 2013, with its registered
          office at {siteConfig.address} (GSTIN {siteConfig.gstin}).
        </p>
        <p>
          By using the Website or placing an order, you agree to these terms, our{" "}
          <Link href="/privacy">Privacy Policy</Link>, <Link href="/shipping-policy">Shipping Policy</Link> and{" "}
          <Link href="/returns">Returns, Cancellations &amp; Refunds</Link> policy. This document is an electronic record under
          the Information Technology Act, 2000 and does not require a physical or digital signature.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility and your account",
    content: (
      <ul>
        <li>You must be at least 18 years old and competent to contract under the Indian Contract Act, 1872 to place an order.</li>
        <li>You sign in with your Indian mobile number and a one-time password. You are responsible for keeping access to that number secure.</li>
        <li>You agree to provide accurate names, addresses and contact details, including for gift recipients.</li>
        <li>We may suspend accounts involved in fraud, coupon abuse, repeated refused COD deliveries or misuse of the Website.</li>
      </ul>
    ),
  },
  {
    id: "products",
    title: "Products and descriptions",
    content: (
      <>
        <p>
          We make every effort to describe and photograph our products accurately. As many of our gifts are handmade by
          artisans, slight variations in colour, texture, pattern and size are natural and are not defects. Colours may also
          appear differently depending on your screen.
        </p>
        <p>
          Cosmetic product pages list the full ingredient list, net quantity, manufacturer and country of origin as required
          under the Legal Metrology (Packaged Commodities) Rules, 2011 and the Drugs and Cosmetics Act, 1940. Please read the
          ingredient list and do a patch test before use.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Pricing and payment",
    content: (
      <>
        <ul>
          <li>All prices are in Indian Rupees and inclusive of GST. The MRP and selling price are shown on every product page.</li>
          <li>Shipping, gift wrap and Cash on Delivery fees, where applicable, are shown at checkout before you pay.</li>
          <li>Payments are processed by an RBI-authorised payment aggregator. We do not store your card or UPI credentials.</li>
          <li>
            If a product is listed at an incorrect price due to a technical or typographical error, we may cancel the order
            and refund you in full, even after confirmation.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "orders",
    title: "Order acceptance",
    content: (
      <p>
        An order is confirmed when we send you an order confirmation by SMS or email. We reserve the right to decline or
        cancel an order for reasons including stock unavailability, a non-serviceable PIN code, pricing errors or suspected
        fraud. In such cases any amount paid will be refunded to your original payment method within 5–7 working days.
      </p>
    ),
  },
  {
    id: "coupons",
    title: "Coupons and offers",
    content: (
      <ul>
        <li>Only one coupon may be applied per order. Coupons have no cash value and cannot be exchanged or transferred.</li>
        <li>Each coupon may carry its own minimum order value, maximum discount, validity period and usage limit.</li>
        <li>If an order is partially returned, the coupon discount is adjusted proportionately in the refund.</li>
        <li>We may withdraw or modify an offer at any time, without affecting orders already placed.</li>
      </ul>
    ),
  },
  {
    id: "personalisation",
    title: "Personalised items and gift messages",
    content: (
      <p>
        You are responsible for the spelling and content of any personalisation text or gift message. We may refuse text that
        is offensive, infringes someone else&apos;s rights or violates law. Personalised items are made to order and cannot be
        cancelled once in production, or returned unless damaged or incorrect due to our error.
      </p>
    ),
  },
  {
    id: "shipping-returns",
    title: "Shipping, cancellations and returns",
    content: (
      <p>
        Delivery timelines, charges and risk of loss are governed by our <Link href="/shipping-policy">Shipping Policy</Link>.
        Cancellations, returns and refunds are governed by our{" "}
        <Link href="/returns">Returns, Cancellations &amp; Refunds</Link> policy. Title and risk in the products pass to you on
        delivery.
      </p>
    ),
  },
  {
    id: "reviews",
    title: "Reviews and user content",
    content: (
      <p>
        When you post a review, you grant us a non-exclusive, royalty-free licence to display it on the Website and in our
        marketing. Reviews must be honest and based on your own experience. We moderate reviews and may decline those that
        contain offensive language, personal data or promotional content, in line with BIS standard IS 19000:2022 on online
        consumer reviews. We do not edit the substance of reviews or suppress negative ones.
      </p>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    content: (
      <p>
        The LushAura name, logo, product designs, photographs, text and website design are owned by or licensed to{" "}
        {siteConfig.legalName}. You may not copy, reproduce or use them for commercial purposes without our prior written
        permission.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <p>
        To the fullest extent permitted by law, our total liability for any claim arising from an order is limited to the
        amount you paid for that order. We are not liable for indirect or consequential losses, or for allergic reactions
        where the ingredient concerned was disclosed on the product page and packaging. Nothing in these terms limits your
        rights under the Consumer Protection Act, 2019.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    content: (
      <p>
        These terms are governed by the laws of India. Subject to your rights to approach a consumer commission under the
        Consumer Protection Act, 2019, the courts at Bengaluru, Karnataka shall have exclusive jurisdiction. We encourage you
        to contact us first — most concerns are resolved quickly and amicably.
      </p>
    ),
  },
  {
    id: "grievance",
    title: "Grievance Officer",
    content: (
      <>
        <p>
          In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology (Intermediary
          Guidelines and Digital Media Ethics Code) Rules, 2021, our Grievance Officer is:
        </p>
        <GrievanceOfficer />
        <p>We acknowledge every complaint within 48 hours and resolve it within one month of receipt.</p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      summary="The ground rules for shopping with LushAura — written to be fair and easy to read. Please take a few minutes to go through them before placing an order."
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={sections}
    />
  );
}
