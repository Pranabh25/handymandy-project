import Link from "next/link";
import { mainNav } from "@/config/site";
import { Logo } from "./logo";
import { SearchBox } from "./search-box";
import { HeaderActions } from "./header-actions";
import { MobileNav } from "./mobile-nav";

export function AnnouncementBar({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <div className="bg-charcoal text-ivory">
      <p className="container-page py-2 text-center text-[0.72rem] tracking-wide">{text}</p>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/85">
      <div className="container-page flex h-16 items-center gap-3 lg:h-[4.5rem] lg:gap-8">
        <MobileNav />
        <Logo className="shrink-0" />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative py-2 text-charcoal/85 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-charcoal after:transition-transform hover:text-charcoal hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SearchBox className="ml-auto hidden w-full max-w-xs md:block xl:max-w-sm" />
        <div className="ml-auto md:ml-0">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
