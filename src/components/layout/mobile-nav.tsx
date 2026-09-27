"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Heart, Package, User, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mainNav, siteConfig } from "@/config/site";
import { SearchBox } from "./search-box";
import { Logo } from "./logo";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" strokeWidth={1.6} />
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] max-w-sm gap-0 bg-background p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <SearchBox onNavigate={close} />
          <nav aria-label="Mobile" className="mt-6">
            <ul className="divide-y">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="block py-3.5 font-display text-xl">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 grid grid-cols-2 gap-2 text-sm">
            {[
              { href: "/account", label: "My account", icon: User },
              { href: "/account/orders", label: "Orders", icon: Package },
              { href: "/wishlist", label: "Wishlist", icon: Heart },
              { href: "/track", label: "Track order", icon: MapPin },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={close} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-3">
                <Icon className="size-4 text-terracotta" /> {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t px-5 py-4 text-xs text-muted-foreground">
          Need help? {siteConfig.supportPhone} · {siteConfig.supportHours}
        </div>
      </SheetContent>
    </Sheet>
  );
}
