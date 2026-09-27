import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

/** Lightweight header/footer for pages rendered outside the storefront layout (root 404, error). */
export function MinimalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Go to homepage
          </Link>
        </div>
      </header>
      <main id="main" className="flex flex-1 items-center">
        {children}
      </main>
      <footer className="border-t">
        <p className="container-page py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.legalName} · {siteConfig.supportEmail} · {siteConfig.supportPhone}
        </p>
      </footer>
    </>
  );
}
