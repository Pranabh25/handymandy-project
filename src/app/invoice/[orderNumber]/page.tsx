import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderDetailInclude } from "@/server/orders";
import { getStoreSettings } from "@/server/settings";
import { siteConfig } from "@/config/site";
import { GST_RATE } from "@/lib/pricing";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import { formatDate, formatPhone } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { PrintButton } from "@/components/account/print-button";
import { addressLines, orderAddress } from "@/components/account/order-utils";
import { SELLER_STATE, amountInWords, formatAmount } from "@/components/account/invoice-utils";
import { InvoiceTable, type InvoiceRow } from "@/components/account/invoice-table";

type Params = { params: Promise<{ orderNumber: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Tax invoice INV-${decodeURIComponent(orderNumber)}`, robots: { index: false, follow: false } };
}

export default async function InvoicePage({ params }: Params) {
  const orderNumber = decodeURIComponent((await params).orderNumber);
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/invoice/${orderNumber}`)}`);
  const isAdmin = user.role === "ADMIN";

  const order = await db.order.findFirst({
    where: { orderNumber, ...(isAdmin ? {} : { userId: user.id }) },
    include: orderDetailInclude,
  });
  if (!order) notFound();

  const backHref = isAdmin ? "/admin/orders" : `/account/orders/${order.orderNumber}`;
  const back = (
    <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
      <ArrowLeft aria-hidden />
      {isAdmin ? "Back to orders" : "Back to order"}
    </Link>
  );

  if (order.status === "PENDING_PAYMENT") {
    return (
      <main id="main" className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">Invoice not available yet</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          A tax invoice is generated once payment for order {order.orderNumber} is confirmed.
        </p>
        <div className="mt-6">{back}</div>
      </main>
    );
  }

  const [settings, products] = await Promise.all([
    getStoreSettings(),
    db.product.findMany({
      where: { id: { in: order.items.map((i) => i.productId).filter((v): v is string => !!v) } },
      select: { id: true, hsnCode: true },
    }),
  ]);
  const hsn = new Map(products.map((p) => [p.id, p.hsnCode]));
  const address = orderAddress(order.shippingAddress);
  const placeOfSupply = address?.state ?? SELLER_STATE;
  const intraState = placeOfSupply.trim().toLowerCase() === SELLER_STATE.toLowerCase();
  const invoiceDate = order.events.find((e) => e.status === "CONFIRMED")?.createdAt ?? order.createdAt;
  const paid = order.payments.find((p) => p.status === "PAID" || p.status === "REFUNDED");

  const split = (gross: number) => {
    const taxable = gross / (1 + GST_RATE);
    return { taxable, tax: gross - taxable };
  };
  const rows: InvoiceRow[] = order.items.map((item) => ({
    key: item.id,
    description: item.name,
    detail: `SKU ${item.sku}`,
    hsn: (item.productId && hsn.get(item.productId)) || "—",
    qty: item.quantity,
    rate: item.price,
    gross: item.price * item.quantity,
    ...split(item.price * item.quantity),
  }));
  const charge = (key: string, description: string, amount: number, code = "9968") => {
    if (amount) rows.push({ key, description, hsn: code, qty: 1, rate: amount, gross: amount, ...split(amount) });
  };
  charge("ship", "Shipping & handling", order.shippingFee);
  charge("wrap", "Gift wrapping", order.giftWrapFee, "—");
  charge("cod", "Cash on Delivery fee", order.codFee);
  if (order.discount) {
    const d = split(order.discount);
    rows.push({
      key: "discount",
      description: `Discount${order.couponCode ? ` (coupon ${order.couponCode})` : ""}`,
      hsn: "—",
      qty: 1,
      rate: -order.discount,
      gross: -order.discount,
      taxable: -d.taxable,
      tax: -d.tax,
    });
  }
  const totals = rows.reduce((t, r) => ({ taxable: t.taxable + r.taxable, tax: t.tax + r.tax }), { taxable: 0, tax: 0 });

  const gstin = settings.gstin || siteConfig.gstin;
  const sellerAddress = settings.registeredAddress || siteConfig.address;

  return (
    <main id="main" className="min-h-full bg-muted/40 px-4 py-6 print:bg-white print:p-0 md:py-10">
      <div className="no-print mx-auto mb-5 flex max-w-4xl flex-wrap items-center justify-between gap-3">
        {back}
        <PrintButton />
      </div>

      <article className="mx-auto max-w-4xl rounded-xl border bg-white p-5 text-[13px] leading-5 text-charcoal shadow-soft print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none sm:p-8 md:p-10">
        <header className="flex flex-col gap-6 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3 font-semibold">{siteConfig.legalName}</p>
            <p className="max-w-xs text-muted-foreground">{sellerAddress}</p>
            <p className="mt-1">
              <span className="text-muted-foreground">GSTIN </span>
              <span className="font-mono">{gstin}</span>
            </p>
            <p className="text-muted-foreground">
              {settings.supportEmail} · {settings.supportPhone}
            </p>
          </div>
          <div className="sm:text-right">
            <h1 className="font-sans text-lg font-bold tracking-[0.2em] uppercase">Tax Invoice</h1>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 sm:justify-end">
              <dt className="text-muted-foreground">Invoice no.</dt>
              <dd className="font-mono font-medium">INV-{order.orderNumber}</dd>
              <dt className="text-muted-foreground">Invoice date</dt>
              <dd>{formatDate(invoiceDate)}</dd>
              <dt className="text-muted-foreground">Order no.</dt>
              <dd className="font-mono">{order.orderNumber}</dd>
              <dt className="text-muted-foreground">Order date</dt>
              <dd>{formatDate(order.createdAt)}</dd>
              <dt className="text-muted-foreground">Place of supply</dt>
              <dd>{placeOfSupply}</dd>
            </dl>
          </div>
        </header>

        <section className="grid gap-6 border-b py-6 sm:grid-cols-2">
          {(["Billed to", "Shipped to"] as const).map((label) => (
            <div key={label}>
              <h2 className="mb-1.5 font-sans text-[0.7rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {label}
              </h2>
              {address ? (
                <address className="not-italic">
                  <span className="font-medium">{address.fullName}</span>
                  {addressLines(address).map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                  <span className="block">{formatPhone(address.phone)}</span>
                  {label === "Billed to" && (order.email || order.user.email) ? (
                    <span className="block">{order.email || order.user.email}</span>
                  ) : null}
                </address>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </div>
          ))}
        </section>

        <InvoiceTable rows={rows} intraState={intraState} totals={totals} grandTotal={order.total} />

        <section className="grid gap-6 border-t pt-6 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-muted-foreground">Amount in words</p>
            <p className="font-medium">{amountInWords(order.total)}</p>
            <p className="mt-3 text-muted-foreground">
              Payment: {PAYMENT_METHOD_LABEL[order.paymentMethod]} · {PAYMENT_STATUS_META[order.paymentStatus].label}
              {paid?.providerPaymentId ? ` · Ref ${paid.providerPaymentId}` : ""}
            </p>
            {order.status === "CANCELLED" ? (
              <p className="mt-2 font-medium text-destructive">This order was cancelled. Any amount paid is refunded.</p>
            ) : null}
          </div>
          <div className="text-left sm:text-right">
            <p className="text-muted-foreground">Total tax included</p>
            <p className="font-medium">₹{formatAmount(totals.tax)}</p>
            <p className="mt-6 font-medium">For {siteConfig.legalName}</p>
            <p className="text-muted-foreground">Authorised signatory</p>
          </div>
        </section>

        <footer className="mt-8 space-y-1 border-t pt-4 text-xs text-muted-foreground">
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
          <p>All prices are inclusive of GST. Whether tax is payable on reverse charge basis: No.</p>
          <p className="font-medium text-[#8a6420]">Demo invoice — not valid for tax purposes.</p>
        </footer>
      </article>
    </main>
  );
}
