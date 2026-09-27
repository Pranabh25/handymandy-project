import { redirect } from "next/navigation";

/** Invoices render outside the store chrome for clean printing. */
export default async function AccountInvoiceRedirect({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  redirect(`/invoice/${orderNumber}`);
}
