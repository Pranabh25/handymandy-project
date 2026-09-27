"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { useStoreSettings } from "@/components/providers/store-provider";
import { useAppliedCoupon } from "@/components/cart/use-applied-coupon";
import { useCartRefresh } from "@/components/cart/use-cart-refresh";
import { cartActions, useCartState } from "@/hooks/use-cart";
import { calculateTotals } from "@/lib/pricing";
import { formatPhone, pluralize } from "@/lib/format";
import type { PaymentMethod } from "@/generated/prisma/enums";
import type { SavedAddress } from "@/server/actions/addresses";
import type { AvailableCoupon } from "@/server/actions/cart";
import { placeOrder } from "@/server/actions/checkout";
import { AddressStep, formatAddressLines } from "./address-step";
import { CheckoutSkeleton } from "./checkout-skeleton";
import { CheckoutSteps } from "./checkout-steps";
import { CheckoutSummary } from "./checkout-summary";
import { ContactStep } from "./contact-step";
import { DemoPaymentModal, type PayableOrder } from "./demo-payment-modal";
import { PaymentStep } from "./payment-step";
import { ReviewStep } from "./review-step";
import { StepSection } from "./step-section";
import { PAYMENT_OPTIONS, type PrepaidMethod } from "./payment-options";

type Props = {
  user: { name: string | null; phone: string | null; email: string | null };
  addresses: SavedAddress[];
  coupons: AvailableCoupon[];
  deliveryLabel: string;
};

export function CheckoutFlow({ user, addresses: initialAddresses, coupons, deliveryLabel }: Props) {
  const router = useRouter();
  const settings = useStoreSettings();
  const cart = useCartState();
  const { hydrated, refreshed } = useCartRefresh();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(user.email ?? "");
  const [addresses, setAddresses] = useState(initialAddresses);
  const [addressId, setAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id ?? null,
  );
  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState<(PayableOrder & { signature: string }) | null>(null);
  const [modal, setModal] = useState<{ open: boolean; key: number }>({ open: false, key: 0 });
  const [dismissed, setDismissed] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [placing, startPlacing] = useTransition();

  const baseSubtotal = cart.lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const applied = useAppliedCoupon(cart.couponCode, baseSubtotal);
  const couponCode = applied.coupon ? cart.couponCode : null;
  const totals = calculateTotals(cart.lines, settings, {
    coupon: applied.coupon,
    giftWrap: cart.giftWrap,
    cod: method === "COD",
  });

  const selectedAddress = addresses.find((a) => a.id === addressId) ?? null;
  const signature = JSON.stringify([
    cart.lines.map((l) => [l.productId, l.quantity]),
    couponCode,
    cart.giftWrap,
    cart.giftMessage,
    addressId,
  ]);
  const activePending = pendingOrder && pendingOrder.signature === signature ? pendingOrder : null;

  function goTo(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      const el = document.getElementById(`checkout-step-${next}`);
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function finish(orderNumber: string) {
    setCompleting(true);
    cartActions.clear();
    router.replace(`/checkout/success/${orderNumber}`);
  }

  function openModal() {
    setDismissed(false);
    setModal((m) => ({ open: true, key: m.key + 1 }));
  }

  function submitOrder() {
    if (!selectedAddress) {
      toast.error("Choose a delivery address");
      goTo(1);
      return;
    }
    if (activePending && method !== "COD") {
      openModal();
      return;
    }
    setPlaceError(null);
    startPlacing(async () => {
      const res = await placeOrder({
        addressId: selectedAddress.id,
        paymentMethod: method,
        lines: cart.lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        couponCode,
        giftWrap: cart.giftWrap,
        giftMessage: cart.giftMessage || null,
        email: email.trim() || null,
      });
      if (!res.ok) {
        setPlaceError(res.error);
        toast.error("We couldn't place your order", {
          description: res.error,
          action: { label: "Review bag", onClick: () => router.push("/cart") },
        });
        return;
      }
      if (!res.data.requiresPayment) {
        toast.success("Order placed", { description: `Order ${res.data.orderNumber} · Pay on delivery` });
        finish(res.data.orderNumber);
        return;
      }
      setPendingOrder({ orderId: res.data.orderId, orderNumber: res.data.orderNumber, total: res.data.total, signature });
      openModal();
    });
  }

  if (!hydrated) return <CheckoutSkeleton />;

  if (completing) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center" role="status">
        <span className="size-10 animate-spin rounded-full border-2 border-muted border-t-terracotta" aria-hidden />
        <p className="mt-5 font-display text-2xl font-semibold">Confirming your order…</p>
        <p className="mt-1 text-sm text-muted-foreground">Just a moment while we get everything ready.</p>
      </div>
    );
  }

  if (!cart.lines.length) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={ShoppingBag}
          title="There's nothing to check out yet"
          description="Your bag is empty. Add a hamper or a little something for yourself, then come back here."
          action={{ label: "Browse the shop", href: "/shop" }}
        />
      </div>
    );
  }

  const status = (i: number) => (i < step ? "done" : i === step ? "active" : "upcoming") as "done" | "active" | "upcoming";
  const methodLabel = PAYMENT_OPTIONS.find((o) => o.value === method)?.label ?? method;

  return (
    <div className="container-page pt-6 pb-20 md:pt-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1 className="mt-1.5 text-3xl font-semibold md:text-4xl">Checkout</h1>
        </div>
        <CheckoutSteps current={step} className="w-full md:max-w-lg" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <div className="space-y-4">
          <div className="lg:hidden">
            <CheckoutSummary variant="mobile" lines={cart.lines} totals={totals} couponCode={couponCode} showCod={method === "COD"} deliveryLabel={deliveryLabel} />
          </div>

          <StepSection
            index={0}
            title="Contact"
            status={status(0)}
            onEdit={() => goTo(0)}
            summary={
              <>
                {user.name ? `${user.name} · ` : ""}
                {user.phone ? formatPhone(user.phone) : ""}
                {email ? ` · ${email}` : ""}
              </>
            }
          >
            <ContactStep user={user} email={email} onEmailChange={setEmail} onContinue={() => goTo(1)} />
          </StepSection>

          <StepSection
            index={1}
            title="Delivery address"
            status={status(1)}
            onEdit={() => goTo(1)}
            summary={
              selectedAddress ? (
                <>
                  <span className="font-medium text-foreground">{selectedAddress.fullName}</span> · {formatAddressLines(selectedAddress)}
                </>
              ) : null
            }
          >
            <AddressStep
              addresses={addresses}
              selectedId={addressId}
              onSelect={setAddressId}
              defaults={{ fullName: user.name ?? "", phone: user.phone ?? "" }}
              onSaved={(a) => {
                setAddresses((list) => {
                  const rest = list.filter((x) => x.id !== a.id).map((x) => (a.isDefault ? { ...x, isDefault: false } : x));
                  return a.isDefault ? [a, ...rest] : [...rest, a];
                });
                setAddressId(a.id);
              }}
              onContinue={() => goTo(2)}
            />
          </StepSection>

          <StepSection
            index={2}
            title="Review your order"
            status={status(2)}
            onEdit={() => goTo(2)}
            summary={
              <>
                {pluralize(totals.itemCount, "item")}
                {cart.giftWrap ? " · Gift wrapped" : ""}
                {cart.giftMessage ? " · Gift note added" : ""}
                {couponCode ? ` · ${couponCode} applied` : ""}
              </>
            }
          >
            <ReviewStep
              cart={cart}
              applied={applied}
              baseSubtotal={baseSubtotal}
              coupons={coupons}
              deliveryLabel={deliveryLabel}
              address={selectedAddress}
              onContinue={() => goTo(3)}
            />
          </StepSection>

          <StepSection index={3} title="Payment" status={status(3)} summary={methodLabel}>
            <PaymentStep
              method={method}
              onMethodChange={(m) => {
                setMethod(m);
                setPlaceError(null);
              }}
              total={totals.total}
              placing={placing}
              ready={refreshed}
              error={placeError}
              pendingOrder={activePending}
              dismissed={dismissed}
              onSubmit={submitOrder}
            />
          </StepSection>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            Need help? Call {settings.supportPhone} or write to{" "}
            <Link href={`mailto:${settings.supportEmail}`} className="underline underline-offset-2">
              {settings.supportEmail}
            </Link>
          </p>
        </div>

        <div className="hidden lg:block">
          <CheckoutSummary variant="desktop" lines={cart.lines} totals={totals} couponCode={couponCode} showCod={method === "COD"} deliveryLabel={deliveryLabel} />
        </div>
      </div>

      {activePending ? (
        <DemoPaymentModal
          key={modal.key}
          open={modal.open}
          order={activePending}
          initialMethod={(method === "COD" ? "UPI" : method) as PrepaidMethod}
          onSuccess={finish}
          onDismiss={() => {
            setModal((m) => ({ ...m, open: false }));
            setDismissed(true);
            toast.warning("Payment not completed — you can retry from My Orders", {
              description: `Order ${activePending.orderNumber} is saved and awaiting payment.`,
              action: { label: "My Orders", onClick: () => router.push(`/account/orders/${activePending.orderNumber}`) },
            });
          }}
        />
      ) : null}
    </div>
  );
}
