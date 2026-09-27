import type { Metadata } from "next";
import { GrievanceOfficer, GRIEVANCE_OFFICER, LEGAL_LAST_UPDATED, LegalPage, type LegalSection } from "@/components/content/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How LushAura Lifestyle Private Limited collects, uses and protects your personal data, in line with India's Digital Personal Data Protection Act, 2023.",
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "Who we are",
    content: (
      <>
        <p>
          This Privacy Policy explains how {siteConfig.legalName} (&ldquo;LushAura&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;),
          a company incorporated in India with its registered office at {siteConfig.address} (GSTIN {siteConfig.gstin}),
          processes your personal data when you visit lushaura.in, place an order, or contact us.
        </p>
        <p>
          For the purposes of the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;) and the rules made under
          it, LushAura is the <strong>Data Fiduciary</strong> and you are the <strong>Data Principal</strong>. This policy
          should be read with our Terms of Service.
        </p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "Personal data we collect",
    content: (
      <>
        <h3>Data you give us</h3>
        <ul>
          <li><strong>Account details:</strong> name, mobile number and email address.</li>
          <li><strong>Delivery details:</strong> recipient name, address, PIN code and phone number — including those of people you send gifts to.</li>
          <li><strong>Order details:</strong> products purchased, gift messages, personalisation text and order history.</li>
          <li><strong>Communications:</strong> messages you send via our contact form, email or WhatsApp, and product reviews.</li>
        </ul>
        <h3>Data collected automatically</h3>
        <ul>
          <li>Device and browser type, IP address, approximate location (city level) and pages visited.</li>
          <li>Your cart and wishlist, which are stored in your own browser&apos;s local storage.</li>
          <li>A secure session cookie that keeps you signed in.</li>
        </ul>
        <h3>Data we do not collect</h3>
        <p>
          We never see or store your full card number, CVV, UPI PIN or net-banking password. Payments are processed directly
          by our RBI-authorised payment aggregator, which is PCI-DSS compliant.
        </p>
      </>
    ),
  },
  {
    id: "purposes",
    title: "Why we use your data",
    content: (
      <>
        <p>We process your personal data only for clear, lawful purposes:</p>
        <ul>
          <li>To create your account and verify your mobile number by one-time password (OTP).</li>
          <li>To process, pack, ship and deliver your orders, and to send order and delivery updates by SMS, email or WhatsApp.</li>
          <li>To handle cancellations, returns, refunds and customer support requests.</li>
          <li>To issue GST invoices and meet our tax, accounting and legal obligations.</li>
          <li>To prevent fraud, misuse of coupons and abuse of Cash on Delivery.</li>
          <li>With your consent, to send you offers, festive launches and our newsletter.</li>
          <li>To understand how our website is used, in aggregate, so we can improve it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "Consent and legitimate uses",
    content: (
      <>
        <p>
          We process your data on the basis of your <strong>consent</strong>, which you give when you create an account, place
          an order, subscribe to our newsletter or submit a form. Each request for consent is accompanied by a notice
          describing the data and purpose, as required by Section 5 of the DPDP Act.
        </p>
        <p>
          We may also process data for <strong>legitimate uses</strong> permitted under Section 7 of the DPDP Act — for example,
          where you voluntarily share data to complete a purchase, or where we must comply with a law, court order or tax
          requirement.
        </p>
        <p>
          You may withdraw consent at any time by emailing {GRIEVANCE_OFFICER.email} or using the unsubscribe link in any
          marketing email. Withdrawal does not affect processing already carried out, and we may still need to retain some
          data to complete an order in progress or meet legal requirements.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share data with",
    content: (
      <>
        <p>We do not sell your personal data. We share it only with Data Processors who help us run LushAura, under written contracts:</p>
        <ul>
          <li><strong>Courier partners</strong> (such as Blue Dart, Delhivery, DTDC) — name, address and phone number for delivery.</li>
          <li><strong>Payment aggregator</strong> — order amount and contact details to process payments and refunds.</li>
          <li><strong>SMS, email and WhatsApp providers</strong> — to send OTPs and order updates.</li>
          <li><strong>Cloud hosting and analytics providers</strong> — to host our website and understand usage in aggregate.</li>
          <li><strong>Government authorities</strong> — when required by law, such as tax authorities or law-enforcement requests.</li>
        </ul>
        <p>
          Some processors may store data on servers outside India. Where they do, we transfer data only to countries not
          restricted by the Government of India under Section 16 of the DPDP Act, and with appropriate safeguards.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    content: (
      <ul>
        <li>Account data: for as long as your account is active, and erased within 90 days of an account deletion request.</li>
        <li>Order and invoice records: 8 years, as required under the Companies Act, 2013 and GST law.</li>
        <li>Support messages: 2 years after the conversation is closed.</li>
        <li>Marketing preferences: until you unsubscribe or withdraw consent.</li>
        <li>OTP codes: deleted or invalidated within 10 minutes of being issued.</li>
      </ul>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights as a Data Principal",
    content: (
      <>
        <p>Under the DPDP Act, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> a summary of the personal data we process about you and the processing activities involved.</li>
          <li><strong>Correction and completion</strong> of inaccurate or incomplete data, and <strong>updating</strong> of your data.</li>
          <li><strong>Erasure</strong> of data that is no longer needed for the purpose it was collected, unless we must retain it by law.</li>
          <li><strong>Grievance redressal</strong> through our Grievance Officer, and escalation to the Data Protection Board of India.</li>
          <li><strong>Nominate</strong> another person to exercise these rights on your behalf in the event of death or incapacity.</li>
        </ul>
        <p>
          You can update most details directly under My Account. For other requests, email {GRIEVANCE_OFFICER.email} from
          your registered email address or mention your registered mobile number. We respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's data",
    content: (
      <p>
        Our website is intended for adults. We do not knowingly process personal data of children under 18 years without
        verifiable consent of a parent or lawful guardian, and we do not track or target advertising at children. If you
        believe a child has shared data with us, please contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    content: (
      <>
        <p>We use a small number of cookies and browser storage items:</p>
        <ul>
          <li><strong>Essential:</strong> a signed session cookie to keep you logged in, and security cookies to protect forms.</li>
          <li><strong>Functional:</strong> local storage to remember your cart and wishlist on this device.</li>
          <li><strong>Analytics:</strong> privacy-friendly, aggregate usage statistics that do not identify you personally.</li>
        </ul>
        <p>You can clear cookies and local storage in your browser settings at any time; doing so will sign you out and empty your cart.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect your data",
    content: (
      <p>
        We use HTTPS encryption, access controls, signed session tokens and regular reviews to safeguard your data. Only
        trained staff who need data to fulfil orders can access it. In the unlikely event of a personal data breach, we will
        inform affected users and the Data Protection Board of India as required by the DPDP Act and its rules.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top shows when it was last
        revised. For material changes we will notify you by email or with a notice on our website before they take effect.
      </p>
    ),
  },
  {
    id: "grievance",
    title: "Grievance Officer",
    content: (
      <>
        <p>
          In accordance with the DPDP Act, 2023, the Information Technology Act, 2000 and the rules made thereunder, the
          contact details of our Grievance Officer are below. We acknowledge complaints within 48 hours and resolve them
          within 30 days.
        </p>
        <GrievanceOfficer />
        <p>
          If you are not satisfied with our response, you may file a complaint with the Data Protection Board of India once
          you have exhausted our grievance redressal process.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="Your trust matters more to us than any sale. This policy explains, in plain language, what personal data we collect, why we need it and how you stay in control — in line with India's Digital Personal Data Protection Act, 2023."
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={sections}
    />
  );
}
