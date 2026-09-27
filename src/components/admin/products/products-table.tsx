import Link from "next/link";
import { Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { AdminThumb } from "@/components/admin/shared/thumb";
import { PRODUCT_STATUS_META, stockMeta } from "@/components/admin/shared/status-meta";
import { buttonVariants } from "@/components/ui/button";
import { discountPercent, formatINR } from "@/lib/format";
import type { ProductStatus } from "@/generated/prisma/enums";

type Item = {
  id: string;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  lowStockAt: number;
  status: ProductStatus;
  category: { name: string; group: "GIFTS" | "COSMETICS" };
  images: { url: string; alt: string | null }[];
};

function PriceCell({ price, mrp }: { price: number; mrp: number }) {
  const off = discountPercent(price, mrp);
  return (
    <div className="tabular-nums">
      <span className="font-medium">{formatINR(price)}</span>
      {off ? (
        <span className="ml-1.5 text-xs text-muted-foreground">
          <s>{formatINR(mrp)}</s> · {off}% off
        </span>
      ) : null}
    </div>
  );
}

function StockCell({ stock, lowStockAt }: { stock: number; lowStockAt: number }) {
  const meta = stockMeta(stock, lowStockAt);
  return meta.tone === "success" ? (
    <span className="tabular-nums">{stock}</span>
  ) : (
    <StatusBadge tone={meta.tone}>{stock <= 0 ? "Out of stock" : `${stock} · low`}</StatusBadge>
  );
}

export function ProductsTable({ items }: { items: Item[] }) {
  return (
    <>
      {/* Mobile: stacked cards */}
      <ul className="divide-y md:hidden">
        {items.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/products/${p.id}`} className="flex gap-3 px-4 py-3 hover:bg-muted/50">
              <AdminThumb src={p.images[0]?.url} alt={p.images[0]?.alt ?? p.name} group={p.category.group} className="size-14" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                  <StatusBadge tone={PRODUCT_STATUS_META[p.status].tone}>{PRODUCT_STATUS_META[p.status].label}</StatusBadge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {p.sku} · {p.category.name}
                </p>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <PriceCell price={p.price} mrp={p.mrp} />
                  <StockCell stock={p.stock} lowStockAt={p.lowStockAt} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Tablet & desktop: table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <AdminThumb src={p.images[0]?.url} alt={p.images[0]?.alt ?? p.name} group={p.category.group} />
                    <div className="min-w-0">
                      <Link href={`/admin/products/${p.id}`} className="block max-w-72 truncate font-medium hover:text-terracotta">
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{p.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.category.name}</TableCell>
                <TableCell>
                  <PriceCell price={p.price} mrp={p.mrp} />
                </TableCell>
                <TableCell>
                  <StockCell stock={p.stock} lowStockAt={p.lowStockAt} />
                </TableCell>
                <TableCell>
                  <StatusBadge tone={PRODUCT_STATUS_META[p.status].tone}>{PRODUCT_STATUS_META[p.status].label}</StatusBadge>
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <Link href={`/admin/products/${p.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })} aria-label={`Edit ${p.name}`}>
                    <Pencil aria-hidden /> Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
