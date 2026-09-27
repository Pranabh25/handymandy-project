"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Faq } from "./faq-data";

export function FaqAccordion({ items, groupId }: { items: Faq[]; groupId: string }) {
  return (
    <Accordion className="rounded-xl border bg-card px-5 sm:px-6">
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`${groupId}-${i}`}>
          <AccordionTrigger className="gap-4 py-4 text-[0.95rem] leading-6 hover:no-underline hover:text-terracotta">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pr-8 pb-5 leading-7 text-muted-foreground">
            <p>{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
