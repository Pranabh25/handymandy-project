import Link from "next/link";
import { AdminCard } from "@/components/admin/admin-page-header";
import { ProductImage } from "@/components/product/product-image";
import { formatINR, pluralize } from "@/lib/format";
import type { OrderDetail } from "@/server/orders";

export function OrderItemsCard({ order }: { order: OrderDetail }) {
  const units = order.items.reduce((n, i) => n + i.quantity, 0);
  return (
    <AdminCard title={`Items · ${pluralize(units, "unit")}`}>
      <ul className="divide-y">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 px-5 py-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
              <ProductImage src={item.image} alt={item.name} sizes="56px" className="[&>span:first-of-type]:text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              {item.productId ? (
                <Link href={`/admin/products/${item.productId}`} className="line-clamp-2 text-sm font-medium hover:underline">
                  {item.name}
                </Link>
              ) : (
                <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
              )}
              <p className="font-mono text-xs text-muted-foreground">SKU {item.sku}</p>
            </div>
            <div className="text-right text-sm tabular-nums">
              <p className="font-medium">{formatINR(item.price * item.quantity)}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} × {formatINR(item.price)}
                {item.mrp > item.price ? <span className="ml-1 line-through">{formatINR(item.mrp)}</span> : null}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </AdminCard>
  );
}
