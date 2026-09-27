"use client";

import { useId, useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/server/actions/reviews";
import { cn } from "@/lib/utils";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Loved it"];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-destructive">
      {message}
    </p>
  );
}

export function ReviewForm({ productId }: { productId: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Write a review
      </Button>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await submitReview({
        productId,
        rating,
        title: String(fd.get("title") ?? ""),
        body: String(fd.get("body") ?? ""),
        city: String(fd.get("city") ?? ""),
      });
      if (res.ok) {
        toast.success("Thanks! Your review will appear once approved");
        form.reset();
        setRating(0);
        setErrors({});
        setOpen(false);
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
      }
    });
  }

  const shown = hover || rating;

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5 rounded-xl border bg-card p-5 sm:p-6" noValidate>
      <h3 className="text-2xl font-semibold">Share your experience</h3>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Your rating</legend>
        <div className="flex items-center gap-3">
          <div className="flex" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="cursor-pointer p-0.5" onMouseEnter={() => setHover(n)}>
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="peer sr-only"
                  aria-label={`${n} star${n > 1 ? "s" : ""} — ${LABELS[n]}`}
                />
                <Star
                  aria-hidden
                  strokeWidth={1.25}
                  className={cn(
                    "size-7 rounded-sm transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
                    n <= shown ? "fill-gold text-gold" : "text-charcoal/30",
                  )}
                />
              </label>
            ))}
          </div>
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {LABELS[shown]}
          </span>
        </div>
        <FieldError id={`${id}-rating`} message={errors.rating} />
      </fieldset>

      <div>
        <label htmlFor={`${id}-title`} className="mb-1.5 block text-sm font-medium">
          Review title
        </label>
        <Input
          id={`${id}-title`}
          name="title"
          maxLength={80}
          placeholder="e.g. Lovely glow in a week"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? `${id}-title-err` : undefined}
        />
        <FieldError id={`${id}-title-err`} message={errors.title} />
      </div>

      <div>
        <label htmlFor={`${id}-body`} className="mb-1.5 block text-sm font-medium">
          Your review
        </label>
        <Textarea
          id={`${id}-body`}
          name="body"
          rows={5}
          maxLength={1500}
          className="min-h-28 bg-background"
          placeholder="What did you like? How did it feel, smell or look? Would you gift it?"
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? `${id}-body-err` : undefined}
        />
        <FieldError id={`${id}-body-err`} message={errors.body} />
      </div>

      <div className="sm:max-w-xs">
        <label htmlFor={`${id}-city`} className="mb-1.5 block text-sm font-medium">
          City <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input id={`${id}-city`} name="city" maxLength={40} placeholder="e.g. Pune" autoComplete="address-level2" />
      </div>

      <p className="text-xs text-muted-foreground">Reviews are checked by our team before they appear — usually within a day.</p>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting…" : "Submit review"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
