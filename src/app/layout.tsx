import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/components/providers/store-provider";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/auth";
import { getStoreSettings } from "@/server/settings";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Manrope({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["gift hampers India", "personalised gifts", "clean beauty India", "Ayurvedic skincare", "Diwali gifts", "luxury gifts"],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf6f0",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, user] = await Promise.all([getStoreSettings(), getCurrentUser()]);
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-charcoal px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <StoreProvider
          value={{
            settings: {
              freeShippingThreshold: settings.freeShippingThreshold,
              shippingFee: settings.shippingFee,
              codFee: settings.codFee,
              giftWrapFee: settings.giftWrapFee,
              codEnabled: settings.codEnabled,
              supportEmail: settings.supportEmail,
              supportPhone: settings.supportPhone,
            },
            user: user ? { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role } : null,
          }}
        >
          {children}
        </StoreProvider>
        <Toaster position="bottom-center" richColors={false} closeButton />
      </body>
    </html>
  );
}
