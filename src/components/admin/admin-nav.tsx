"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Ban,
  RotateCcw,
  CreditCard,
  Users,
  TicketPercent,
  MessageSquareQuote,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/cancellations", label: "Cancellations", icon: Ban },
  { href: "/admin/refunds", label: "Refunds", icon: RotateCcw },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminNav({ onNavigate, badges }: { onNavigate?: () => void; badges?: Partial<Record<string, number>> }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin">
      <ul className="space-y-0.5">
        {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          const badge = badges?.[href];
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-charcoal text-ivory" : "text-charcoal/75 hover:bg-muted hover:text-charcoal",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                <span className="flex-1">{label}</span>
                {badge ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[0.65rem] leading-4.5 font-semibold tabular-nums",
                      active ? "bg-ivory/20 text-ivory" : "bg-terracotta text-white",
                    )}
                  >
                    {badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
