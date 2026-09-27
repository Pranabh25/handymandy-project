import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, MapPin, Package } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatINR, formatPhone } from "@/lib/format";
import { getStoreSettings } from "@/server/settings";
import { EmptyState } from "@/components/common/empty-state";
import { OrderCard, orderCardSelect } from "@/components/account/order-card";
import { ProfileCard } from "@/components/account/profile-card";
import { HelpBox } from "@/components/account/help-box";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

export default async function AccountOverviewPage() {
  const user = await requireUser("/account");
  const [recent, orderCount, spent, address, settings] = await Promise.all([
    db.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 3, select: orderCardSelect }),
    db.order.count({ where: { userId: user.id } }),
    db.order.aggregate({
      where: { userId: user.id, status: { notIn: ["PENDING_PAYMENT", "CANCELLED"] } },
      _sum: { total: true },
    }),
    db.address.findFirst({ where: { userId: user.id }, orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] }),
    getStoreSettings(),
  ]);

  const stats = [
    { label: "Orders placed", value: orderCount.toLocaleString("en-IN") },
    { label: "Total spent", value: formatINR(spent._sum.total ?? 0) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <ProfileCard name={user.name} email={user.email} phone={user.phone} memberSince={user.createdAt} />
        <dl className="grid grid-cols-2 gap-4 xl:grid-cols-1">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-sand/60 p-5">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 font-display text-3xl font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section aria-labelledby="recent-orders">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="recent-orders" className="text-2xl font-semibold">
            Recent orders
          </h2>
          {orderCount > 0 ? (
            <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-medium hover:underline">
              View all <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>
        {recent.length ? (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {recent.map((o) => (
              <OrderCard key={o.orderNumber} order={o} compact />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-card">
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="When you place an order, you'll be able to track it and download invoices here."
              action={{ label: "Start shopping", href: "/shop" }}
            />
          </div>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="default-address" className="rounded-xl border bg-card p-5 shadow-soft md:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="default-address" className="flex items-center gap-2 text-xl font-semibold">
              <MapPin className="size-4 text-terracotta" aria-hidden />
              {address?.isDefault ? "Default address" : "Saved address"}
            </h2>
            <Link href="/account/addresses" className="text-sm font-medium hover:underline">
              Manage
            </Link>
          </div>
          {address ? (
            <address className="mt-4 text-sm leading-6 text-muted-foreground not-italic">
              <span className="font-medium text-foreground">{address.fullName}</span>
              <br />
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}
              <br />
              {address.city}, {address.state} {address.pincode}
              <br />
              {formatPhone(address.phone)}
            </address>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Save an address for faster checkout.</p>
              <Link href="/account/addresses" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}>
                Add address
              </Link>
            </div>
          )}
        </section>
        <HelpBox
          icon={Headphones}
          supportEmail={settings.supportEmail}
          supportPhone={settings.supportPhone}
          whatsapp={settings.whatsappNumber}
        />
      </div>
    </div>
  );
}
