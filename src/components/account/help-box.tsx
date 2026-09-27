import Link from "next/link";
import { LifeBuoy, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";

type Props = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp?: string | null;
  orderNumber?: string;
};

/** "Need help?" contact box used across the account area. */
export function HelpBox({
  icon: Icon = LifeBuoy,
  title = "Need help?",
  description,
  supportEmail,
  supportPhone,
  whatsapp,
  orderNumber,
}: Props) {
  const subject = orderNumber ? `?subject=${encodeURIComponent(`Help with order ${orderNumber}`)}` : "";
  const wa = whatsapp?.replace(/\D/g, "");
  return (
    <section aria-label={title} className="rounded-xl border bg-terracotta-soft/50 p-5 md:p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Icon className="size-4 text-terracotta" aria-hidden />
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description ??
          `Our care team is here ${siteConfig.supportHours}. ${orderNumber ? `Mention order ${orderNumber} for a quicker reply.` : ""}`}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        <li>
          <a href={`tel:${supportPhone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:underline">
            <Phone className="size-4 text-terracotta" aria-hidden />
            {supportPhone}
          </a>
        </li>
        <li>
          <a href={`mailto:${supportEmail}${subject}`} className="inline-flex items-center gap-2 break-all hover:underline">
            <Mail className="size-4 text-terracotta" aria-hidden />
            {supportEmail}
          </a>
        </li>
        {wa ? (
          <li>
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:underline"
            >
              <MessageCircle className="size-4 text-terracotta" aria-hidden />
              Chat on WhatsApp
            </a>
          </li>
        ) : null}
      </ul>
      <Link href="/faq" className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline">
        Browse FAQs
      </Link>
    </section>
  );
}
