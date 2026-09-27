import { Gift, Leaf, PenLine, Rabbit, ShieldCheck, Sparkles } from "lucide-react";
import type { ProductDetail } from "@/server/catalog";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground/90">{children}</dd>
    </div>
  );
}

function Pill({ icon: Icon, children }: { icon: typeof Leaf; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-xs font-medium text-sage">
      <Icon className="size-3.5" aria-hidden />
      {children}
    </li>
  );
}

/** Quick-scan facts under the buy box — different for beauty vs gifts. */
export function ProductHighlights({ product }: { product: ProductDetail }) {
  const isCosmetic = product.category.group === "COSMETICS";

  if (isCosmetic) {
    const badges = [
      product.isVegan && { icon: Leaf, label: "Vegan" },
      product.isCrueltyFree && { icon: Rabbit, label: "Cruelty-free" },
      product.isParabenFree && { icon: ShieldCheck, label: "Paraben-free" },
    ].filter(Boolean) as { icon: typeof Leaf; label: string }[];
    return (
      <section aria-labelledby="highlights-title">
        <h2 id="highlights-title" className="sr-only">
          Highlights
        </h2>
        {badges.length ? (
          <ul className="mb-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <Pill key={b.label} icon={b.icon}>
                {b.label}
              </Pill>
            ))}
          </ul>
        ) : null}
        <dl className="divide-y border-y">
          {product.size ? <Row label="Size">{product.size}</Row> : null}
          {product.shade ? <Row label="Shade">{product.shade}</Row> : null}
          {product.skinTypes.length ? <Row label="Skin type">{product.skinTypes.join(", ")}</Row> : null}
          {product.concerns.length ? <Row label="Good for">{product.concerns.join(", ")}</Row> : null}
          {product.keyIngredients.length ? <Row label="Key ingredients">{product.keyIngredients.join(", ")}</Row> : null}
          {product.shelfLifeMonths ? <Row label="Shelf life">{product.shelfLifeMonths} months from manufacture</Row> : null}
        </dl>
      </section>
    );
  }

  return (
    <section aria-labelledby="highlights-title" className="space-y-4">
      <h2 id="highlights-title" className="sr-only">
        Highlights
      </h2>
      {product.whatsInside.length ? (
        <div className="rounded-xl bg-sand/50 p-4 sm:p-5">
          <h3 className="flex items-center gap-2 font-sans text-sm font-semibold">
            <Sparkles className="size-4 text-terracotta" aria-hidden /> What&apos;s inside
          </h3>
          <ul className="mt-3 grid gap-1.5 text-sm text-foreground/85 sm:grid-cols-2">
            {product.whatsInside.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-terracotta" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <dl className="divide-y border-y">
        {product.occasions.length ? <Row label="Perfect for">{product.occasions.join(", ")}</Row> : null}
        {product.recipients.length ? <Row label="Gift for">{product.recipients.join(", ")}</Row> : null}
        {product.size ? <Row label="Size">{product.size}</Row> : null}
      </dl>
      <ul className="flex flex-wrap gap-2">
        {product.giftWrapAvailable ? <Pill icon={Gift}>Gift wrap & note available</Pill> : null}
        {product.isPersonalizable ? <Pill icon={PenLine}>Personalisable</Pill> : null}
      </ul>
      {product.isPersonalizable ? (
        <p className="text-xs leading-5 text-muted-foreground">
          Add the name or message you&apos;d like in the gift note at checkout — our team will confirm the personalisation on WhatsApp
          before dispatch. Personalised items ship in 2–3 working days.
        </p>
      ) : null}
    </section>
  );
}
