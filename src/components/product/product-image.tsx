import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string | null | undefined;
  alt: string;
  /** Used to tint the placeholder when no image has been uploaded yet. */
  group?: "GIFTS" | "COSMETICS";
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Product image with a branded placeholder. Seeded products ship without
 * photos; images are uploaded from Admin → Products and served from /uploads.
 */
export function ProductImage({ src, alt, group = "GIFTS", label, sizes, priority, className }: Props) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden",
          group === "COSMETICS" ? "bg-terracotta-soft" : "bg-sand",
          className,
        )}
      >
        <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-[0.35]">
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-charcoal/30" />
          <circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-charcoal/20" />
        </svg>
        <span className="relative font-display text-4xl text-charcoal/45 italic">LA</span>
        {label ? (
          <span className="relative max-w-[80%] truncate text-[0.65rem] tracking-[0.2em] text-charcoal/45 uppercase">
            {label}
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
      priority={priority}
      // Admin uploads are served by our own route handler; skip the optimiser for them.
      unoptimized={src.startsWith("/uploads/")}
      className={cn("object-cover", className)}
    />
  );
}
