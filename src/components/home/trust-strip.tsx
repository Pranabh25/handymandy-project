import { HandHeart, Leaf, ShieldCheck, Truck } from "lucide-react";
import { formatINR } from "@/lib/format";

export function TrustStrip({ freeShippingThreshold }: { freeShippingThreshold: number }) {
  const items = [
    { icon: Truck, title: "Free shipping", text: `On orders above ${formatINR(freeShippingThreshold)}` },
    { icon: HandHeart, title: "Handcrafted in India", text: "By artisans in 11 states" },
    { icon: Leaf, title: "Cruelty-free & clean", text: "No parabens, no animal testing" },
    { icon: ShieldCheck, title: "Secure payments", text: "UPI, cards & Cash on Delivery" },
  ];
  return (
    <section aria-label="Why shop with LushAura" className="border-y bg-card">
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-6 py-7 md:py-8 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3 sm:items-center">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-terracotta-soft">
              <Icon className="size-[1.1rem] text-terracotta" strokeWidth={1.6} aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold">{title}</span>
              <span className="block text-xs leading-5 text-muted-foreground">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
