"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adjustStock } from "@/server/actions/admin-catalog";

/** Inline stock control: −/+ nudges by one, or type an exact count and press Set. */
export function StockAdjuster({ productId, productName, stock }: { productId: string; productName: string; stock: number }) {
  const [current, setCurrent] = useState(stock);
  const [draft, setDraft] = useState(String(stock));
  const [pending, startTransition] = useTransition();

  function run(mode: "delta" | "set", value: number) {
    startTransition(async () => {
      const res = await adjustStock({ productId, mode, value });
      if (!res.ok) {
        toast.error(res.error);
        setDraft(String(current));
        return;
      }
      setCurrent(res.data.stock);
      setDraft(String(res.data.stock));
      toast.success(`${productName}: stock is now ${res.data.stock}`);
    });
  }

  const parsed = Number.parseInt(draft, 10);
  const changed = draft.trim() !== "" && Number.isFinite(parsed) && parsed !== current;

  return (
    <form
      className="flex items-center gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (!changed) return;
        if (parsed < 0) {
          toast.error("Stock can't go below zero.");
          return;
        }
        run("set", parsed);
      }}
    >
      <Button type="button" variant="outline" size="icon-sm" disabled={pending || current <= 0} onClick={() => run("delta", -1)} aria-label={`Decrease stock of ${productName} by one`}>
        <Minus />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        aria-label={`Stock for ${productName}`}
        className="h-8 w-16 px-2 text-center tabular-nums"
      />
      <Button type="button" variant="outline" size="icon-sm" disabled={pending} onClick={() => run("delta", 1)} aria-label={`Increase stock of ${productName} by one`}>
        <Plus />
      </Button>
      <Button type="submit" size="sm" variant={changed ? "default" : "ghost"} disabled={pending || !changed} className="ml-1 h-8 w-16" aria-label={`Set stock for ${productName}`}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : changed ? "Set" : <Check aria-hidden />}
      </Button>
    </form>
  );
}
