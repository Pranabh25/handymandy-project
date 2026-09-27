import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminLogout } from "@/server/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [pendingCancellations, pendingRefunds, pendingReviews, newOrders] = await Promise.all([
    db.cancellationRequest.count({ where: { status: "REQUESTED" } }),
    db.refund.count({ where: { status: "PENDING" } }),
    db.review.count({ where: { status: "PENDING" } }),
    db.order.count({ where: { status: "CONFIRMED" } }),
  ]);
  const badges = {
    "/admin/orders": newOrders,
    "/admin/cancellations": pendingCancellations,
    "/admin/refunds": pendingRefunds,
    "/admin/reviews": pendingReviews,
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-background px-3 py-5 lg:flex">
        <div className="mb-6 px-3">
          <Logo href="/admin" />
          <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Store admin</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminNav badges={badges} />
        </div>
        <div className="mt-4 border-t px-3 pt-4 text-xs text-muted-foreground">
          <p className="truncate font-medium text-foreground">{admin.name ?? "Admin"}</p>
          <p className="truncate">{admin.email}</p>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <AdminMobileNav badges={badges} />
          <span className="rounded-full bg-[#fbf5e9] px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-[#6b5323] uppercase">
            Demo data
          </span>
          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="size-4" aria-hidden /> <span className="hidden sm:inline">View store</span>
            </Link>
            <form action={adminLogout}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="size-4" aria-hidden /> <span className="hidden sm:inline">Log out</span>
              </button>
            </form>
          </div>
        </header>
        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
