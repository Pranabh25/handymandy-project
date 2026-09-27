import { StatusBadge } from "@/components/common/status-badge";

export function StockStatus({ stock, lowStockAt }: { stock: number; lowStockAt: number }) {
  if (stock <= 0) return <StatusBadge tone="danger">Out of stock</StatusBadge>;
  if (stock <= lowStockAt) return <StatusBadge tone="warning">Hurry — only {stock} left</StatusBadge>;
  return (
    <StatusBadge tone="success">
      <span aria-hidden className="size-1.5 rounded-full bg-sage" />
      In stock
    </StatusBadge>
  );
}
