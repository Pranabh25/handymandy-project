import Link from "next/link";
import { Gift, Mail, Phone } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-page-header";
import { formatPhone } from "@/lib/format";
import type { OrderDetail } from "@/server/orders";
import type { ShippingAddress } from "@/types";

export function OrderCustomerCard({ order }: { order: OrderDetail }) {
  const addr = order.shippingAddress as ShippingAddress | null;
  const email = order.email ?? order.user?.email;
  return (
    <AdminCard title="Customer & delivery">
      <div className="space-y-4 p-5 text-sm">
        <div>
          <p className="eyebrow mb-1">Customer</p>
          <Link href={`/admin/customers/${order.userId}`} className="font-medium hover:underline">
            {order.user?.name || addr?.fullName || "Customer"}
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <Phone className="size-3.5" aria-hidden />
            <a href={`tel:${order.phone}`} className="hover:text-foreground">
              {formatPhone(order.phone)}
            </a>
          </p>
          {email ? (
            <p className="flex items-center gap-1.5 break-all text-muted-foreground">
              <Mail className="size-3.5 shrink-0" aria-hidden />
              <a href={`mailto:${email}`} className="hover:text-foreground">
                {email}
              </a>
            </p>
          ) : null}
        </div>
        {addr ? (
          <div>
            <p className="eyebrow mb-1">Ship to{addr.type ? ` · ${addr.type.toLowerCase()}` : ""}</p>
            <address className="leading-6 not-italic">
              <span className="font-medium">{addr.fullName}</span>
              <br />
              {addr.line1}
              {addr.line2 ? (
                <>
                  <br />
                  {addr.line2}
                </>
              ) : null}
              {addr.landmark ? (
                <>
                  <br />
                  Near {addr.landmark}
                </>
              ) : null}
              <br />
              {addr.city}, {addr.state} {addr.pincode}
              <br />
              <span className="text-muted-foreground">{formatPhone(addr.phone)}</span>
            </address>
          </div>
        ) : null}
        {order.giftWrap || order.giftMessage ? (
          <div className="rounded-lg bg-terracotta-soft/60 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-foreground">
              <Gift className="size-3.5" aria-hidden /> {order.giftWrap ? "Gift wrapped" : "Gift message"}
            </p>
            {order.giftMessage ? <p className="mt-1.5 whitespace-pre-line italic">“{order.giftMessage}”</p> : null}
          </div>
        ) : null}
      </div>
    </AdminCard>
  );
}
