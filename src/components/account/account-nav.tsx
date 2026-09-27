"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutGrid, LogOut, MapPin, Package, Truck } from "lucide-react";
import { logout } from "@/server/actions/auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Overview", href: "/account", icon: LayoutGrid, exact: true },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Track order", href: "/track", icon: Truck },
] as const;

function useIsActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
}

/** Vertical sidebar on desktop. */
export function AccountSidebar() {
  const isActive = useIsActive();
  return (
    <nav aria-label="My account" className="hidden lg:block">
      <ul className="space-y-1">
        {LINKS.map(({ label, href, icon: Icon, ...rest }) => {
          const active = isActive(href, "exact" in rest ? rest.exact : false);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                  active ? "bg-card font-medium text-foreground shadow-soft ring-1 ring-border" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("size-4", active && "text-terracotta")} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <form action={logout} className="mt-6 border-t pt-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <LogOut className="size-4" aria-hidden />
          Log out
        </button>
      </form>
    </nav>
  );
}

/** Horizontally scrolling tabs on mobile and tablet. */
export function AccountTabs() {
  const isActive = useIsActive();
  return (
    <nav aria-label="My account" className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden [&::-webkit-scrollbar]:hidden">
      <ul className="flex w-max gap-2 pb-1">
        {LINKS.map(({ label, href, icon: Icon, ...rest }) => {
          const active = isActive(href, "exact" in rest ? rest.exact : false);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors",
                  active ? "border-charcoal bg-charcoal text-ivory" : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm whitespace-nowrap text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-3.5" aria-hidden />
              Log out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
