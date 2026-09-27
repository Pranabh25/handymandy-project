"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipSelect } from "./chip-select";
import { Field, FormSection, ToggleRow } from "./form-fields";
import { TagInput } from "./tag-input";
import type { FieldErrors, ProductFormValues, SetValues } from "./form-types";

export type Vocabulary = { skinTypes: string[]; occasions: string[]; recipients: string[]; concerns: string[] };

const SKIN_TYPES = ["All skin types", "Dry", "Oily", "Combination", "Normal", "Sensitive", "Acne-prone", "Mature"];
const CONCERNS = ["Dullness", "Pigmentation", "Dryness", "Acne & blemishes", "Fine lines", "Dark circles", "Tan", "Uneven texture", "Frizz"];
const OCCASIONS = ["Diwali", "Raksha Bandhan", "Birthday", "Anniversary", "Wedding", "Housewarming", "Bhai Dooj", "Karwa Chauth", "Holi", "Mother's Day", "Corporate", "Thank you"];
const RECIPIENTS = ["For Her", "For Him", "Couples", "Parents", "Friends", "Colleagues", "Kids", "New home", "Self-care"];

type Props = { values: ProductFormValues; set: SetValues; errors: FieldErrors; vocab: Vocabulary };

const merge = (a: string[], b: string[]) => Array.from(new Set([...a, ...b]));

export function CosmeticSection({ values, set, errors, vocab }: Props) {
  return (
    <FormSection title="Cosmetic details" description="Fill in for skincare, makeup, fragrance and bath & body products.">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Size / net quantity" error={errors.size} optional>
          <Input value={values.size} onChange={(e) => set({ size: e.target.value })} placeholder="30 ml" maxLength={40} />
        </Field>
        <Field label="Shade" error={errors.shade} optional>
          <Input value={values.shade} onChange={(e) => set({ shade: e.target.value })} placeholder="Warm Nude 03" maxLength={60} />
        </Field>
        <Field label="Shelf life (months)" error={errors.shelfLifeMonths} optional>
          <Input type="number" inputMode="numeric" min={0} value={values.shelfLifeMonths} onChange={(e) => set({ shelfLifeMonths: e.target.value })} />
        </Field>
      </div>
      <ChipSelect label="Skin types" options={merge(SKIN_TYPES, vocab.skinTypes)} value={values.skinTypes} onChange={(skinTypes) => set({ skinTypes })} />
      <ChipSelect label="Concerns addressed" options={merge(CONCERNS, vocab.concerns)} value={values.concerns} onChange={(concerns) => set({ concerns })} />
      <Field label="Key ingredients" error={errors.keyIngredients} hint="Press Enter or comma after each ingredient" optional>
        <TagInput value={values.keyIngredients} onChange={(keyIngredients) => set({ keyIngredients })} placeholder="Kumkumadi oil, Saffron, Niacinamide" />
      </Field>
      <Field label="Benefits" error={errors.benefits} hint="One benefit per line" optional>
        <Textarea value={values.benefits} onChange={(e) => set({ benefits: e.target.value })} rows={4} placeholder={"Visibly brightens in 4 weeks\nLightweight, non-greasy finish"} />
      </Field>
      <Field label="How to use" error={errors.howToUse} optional>
        <Textarea value={values.howToUse} onChange={(e) => set({ howToUse: e.target.value })} rows={3} maxLength={2000} />
      </Field>
      <Field label="Full ingredients (INCI)" error={errors.ingredients} optional>
        <Textarea value={values.ingredients} onChange={(e) => set({ ingredients: e.target.value })} rows={3} maxLength={4000} />
      </Field>
      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-3">
        <ToggleRow label="Vegan" checked={values.isVegan} onChange={(isVegan) => set({ isVegan })} />
        <ToggleRow label="Cruelty-free" checked={values.isCrueltyFree} onChange={(isCrueltyFree) => set({ isCrueltyFree })} />
        <ToggleRow label="Paraben-free" checked={values.isParabenFree} onChange={(isParabenFree) => set({ isParabenFree })} />
      </div>
    </FormSection>
  );
}

export function GiftSection({ values, set, errors, vocab }: Props) {
  return (
    <FormSection title="Gift details" description="Helps shoppers find the right present by occasion and recipient.">
      <ChipSelect label="Occasions" options={merge(OCCASIONS, vocab.occasions)} value={values.occasions} onChange={(occasions) => set({ occasions })} />
      <ChipSelect label="Recipients" options={merge(RECIPIENTS, vocab.recipients)} value={values.recipients} onChange={(recipients) => set({ recipients })} />
      <Field label="What's inside" error={errors.whatsInside} hint="One item per line" optional>
        <Textarea
          value={values.whatsInside}
          onChange={(e) => set({ whatsInside: e.target.value })}
          rows={4}
          placeholder={"Brass diya (set of 2)\nSandalwood incense, 20 sticks\nHandwritten gift note"}
        />
      </Field>
    </FormSection>
  );
}
