import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, PackageSearch, SearchX } from "lucide-react";
import { trackOrder } from "@/server/orders";
import { getCurrentUser } from "@/lib/auth";
import { demoConfig } from "@/config/site";
import { ORDER_STATUS_META } from "@/lib/order-status";
import { formatDate, pluralize } from "@/lib/format";
import { phoneSchema } from "@/lib/validators";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { DemoNotice } from "@/components/common/demo-notice";
import { StatusBadge } from "@/components/common/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderEventList, OrderStepper, ShipmentDetails } from "@/components/account/order-timeline";
import { firstParam, orderAddress } from "@/components/account/order-utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Track your LushAura order with your order number and mobile number.",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const orderNumber = firstParam(sp.order).toUpperCase();
  const phone = firstParam(sp.phone);
  const searched = !!(orderNumber || phone);

  let error: string | null = null;
  let order: Awaited<ReturnType<typeof trackOrder>> = null;
  if (searched) {
    const parsedPhone = phoneSchema.safeParse(phone);
    if (!orderNumber) error = "Enter your order number";
    else if (!parsedPhone.success) error = parsedPhone.error.issues[0].message;
    else order = await trackOrder(orderNumber, parsedPhone.data);
  }
  const user = await getCurrentUser();
  const city = order ? orderAddress(order.shippingAddress) : null;

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Track order" }]} />
      <div className="mx-auto mt-6 max-w-3xl">
        <header className="text-center">
          <p className="eyebrow mb-2">Order tracking</p>
          <h1 className="text-3xl font-semibold md:text-5xl">Where&apos;s my order?</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Enter your order number (from your confirmation SMS or email) and the mobile number used at checkout.
          </p>
        </header>

        <form method="get" action="/track" className="mt-8 rounded-xl border bg-card p-5 shadow-soft md:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="track-order">Order number</Label>
              <Input
                id="track-order"
                name="order"
                required
                defaultValue={orderNumber}
                placeholder="e.g. LA2609241234"
                autoCapitalize="characters"
                className="uppercase placeholder:normal-case"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="track-phone">Mobile number</Label>
              <Input
                id="track-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                defaultValue={phone}
                placeholder="10-digit mobile"
              />
            </div>
            <Button type="submit" size="lg" className="h-11">
              Track order
            </Button>
          </div>
          {error ? (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <DemoNotice className="mt-4">
            Try the demo customer&apos;s orders — log in with {demoConfig.customer.phone} (OTP {demoConfig.otp}) and copy an
            order number from My account.
          </DemoNotice>
        </form>

        {searched && !error && !order ? (
          <div role="status" className="mt-8 flex flex-col items-center rounded-xl border bg-card px-6 py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-sand">
              <SearchX className="size-6 text-terracotta" strokeWidth={1.5} aria-hidden />
            </div>
            <h2 className="text-2xl font-semibold">We couldn&apos;t find that order</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Please check the order number and use the same mobile number you entered at checkout. Still stuck?{" "}
              <Link href="/contact" className="underline underline-offset-4">
                Contact us
              </Link>
              .
            </p>
          </div>
        ) : null}

        {order ? (
          <section aria-labelledby="track-result" className="mt-8 space-y-6">
            <div className="rounded-xl border bg-card p-5 shadow-soft md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id="track-result" className="text-2xl font-semibold">
                    Order {order.orderNumber}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Placed {formatDate(order.createdAt)} · {pluralize(order.items.reduce((n, i) => n + i.quantity, 0), "item")}
                  </p>
                  {city ? (
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" aria-hidden />
                      Delivering to {city.city}, {city.state}
                    </p>
                  ) : null}
                </div>
                <StatusBadge tone={ORDER_STATUS_META[order.status].tone}>{ORDER_STATUS_META[order.status].label}</StatusBadge>
              </div>
              <div className="mt-6">
                <OrderStepper status={order.status} events={order.events} estimatedDelivery={order.estimatedDelivery} />
              </div>
              {order.status !== "PENDING_PAYMENT" ? (
                <div className="mt-6 border-t pt-5">
                  <ShipmentDetails
                    courier={order.courier}
                    trackingNumber={order.trackingNumber}
                    estimatedDelivery={order.estimatedDelivery}
                    status={order.status}
                  />
                </div>
              ) : null}
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-soft md:p-6">
              <h3 className="mb-4 text-xl font-semibold">Shipment updates</h3>
              <OrderEventList events={order.events} />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              <Link
                href={user ? `/account/orders/${order.orderNumber}` : `/login?next=${encodeURIComponent(`/account/orders/${order.orderNumber}`)}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                {user ? "View full order details" : "Log in to see full order details"}
              </Link>
            </p>
          </section>
        ) : null}

        {!searched ? (
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <PackageSearch className="size-4 text-terracotta" aria-hidden />
            Most orders reach metro cities in 3–5 working days.
          </div>
        ) : null}
      </div>
    </div>
  );
}
