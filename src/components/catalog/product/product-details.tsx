import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";
import { formatINR } from "@/lib/format";
import type { ProductDetail } from "@/server/catalog";

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n{2,}|\r\n\r\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </>
  );
}

const trigger = "py-5 font-display text-xl font-semibold hover:no-underline md:text-2xl";
const content = "pb-6 text-sm leading-7 text-muted-foreground md:text-[0.95rem]";

/** Description, ingredients, usage, shipping and Legal Metrology details as an accessible accordion. */
export function ProductDetails({ product, freeShippingThreshold }: { product: ProductDetail; freeShippingThreshold: number }) {
  const isCosmetic = product.category.group === "COSMETICS";
  const hasIngredients = product.keyIngredients.length > 0 || !!product.ingredients;
  const details: [string, string | null | undefined][] = [
    ["SKU", product.sku],
    ["HSN code", product.hsnCode],
    ["Net quantity", product.size ?? (product.weightGrams ? `${product.weightGrams} g` : "1 unit")],
    ["Country of origin", product.countryOfOrigin],
    ["Manufactured & marketed by", product.manufacturer ?? `${siteConfig.legalName}, ${siteConfig.address}`],
    ["Shelf life", product.shelfLifeMonths ? `${product.shelfLifeMonths} months from the date of manufacture` : null],
    ["Customer care", `${siteConfig.supportEmail} · ${siteConfig.supportPhone}`],
  ];

  return (
    <Accordion multiple defaultValue={["description"]} className="border-t">
      <AccordionItem value="description" className="border-b">
        <AccordionTrigger className={trigger}>Description</AccordionTrigger>
        <AccordionContent className={content}>
          <Paragraphs text={product.description} />
          {product.benefits.length ? (
            <ul className="mt-4 list-disc space-y-1 pl-5">
              {product.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </AccordionContent>
      </AccordionItem>

      {hasIngredients ? (
        <AccordionItem value="ingredients" className="border-b">
          <AccordionTrigger className={trigger}>Key ingredients & full list</AccordionTrigger>
          <AccordionContent className={content}>
            {product.keyIngredients.length ? (
              <ul className="mb-4 flex flex-wrap gap-2">
                {product.keyIngredients.map((k) => (
                  <li key={k} className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-foreground">
                    {k}
                  </li>
                ))}
              </ul>
            ) : null}
            {product.ingredients ? (
              <p>
                <span className="font-semibold text-foreground">Ingredients (INCI): </span>
                {product.ingredients}
              </p>
            ) : null}
            {isCosmetic ? <p className="text-xs">Please do a patch test before first use. For external use only.</p> : null}
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {product.howToUse ? (
        <AccordionItem value="how-to-use" className="border-b">
          <AccordionTrigger className={trigger}>How to use</AccordionTrigger>
          <AccordionContent className={content}>
            <Paragraphs text={product.howToUse} />
          </AccordionContent>
        </AccordionItem>
      ) : null}

      <AccordionItem value="shipping" className="border-b">
        <AccordionTrigger className={trigger}>Shipping & returns</AccordionTrigger>
        <AccordionContent className={content}>
          <p>
            Orders are packed within 1–2 working days and delivered in 3–5 days across India. Shipping is free on orders above {formatINR(freeShippingThreshold)}, and
            Cash on Delivery is available on most PIN codes.
          </p>
          <p>
            Unopened products can be returned within 7 days of delivery. For hygiene reasons, opened beauty products and personalised gifts
            can&apos;t be returned unless they arrive damaged. Read our <Link href="/shipping-policy">shipping policy</Link> and{" "}
            <Link href="/returns">returns & refunds policy</Link>.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="details" className="border-b">
        <AccordionTrigger className={trigger}>Product details</AccordionTrigger>
        <AccordionContent className={content}>
          <dl className="divide-y rounded-xl border bg-card">
            {details
              .filter(([, v]) => !!v)
              .map(([k, v]) => (
                <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
                  <dt className="text-xs font-medium tracking-wide text-foreground uppercase sm:text-[0.7rem]">{k}</dt>
                  <dd className="text-sm">{v}</dd>
                </div>
              ))}
          </dl>
          <p className="mt-3 text-xs">MRP is inclusive of all taxes. Date of manufacture and batch number are printed on the pack.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
