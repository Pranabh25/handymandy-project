import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

/** Small square product thumbnail for admin tables. */
export function AdminThumb({ src, alt, group, className }: { src: string | null | undefined; alt: string; group?: "GIFTS" | "COSMETICS"; className?: string }) {
  return (
    <div className={cn("relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted [&_span]:text-base", className)}>
      <ProductImage src={src} alt={alt} group={group} sizes="40px" />
    </div>
  );
}
