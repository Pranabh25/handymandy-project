"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/server/actions/newsletter";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await subscribeNewsletter(email);
          if (res.ok) {
            toast.success("You're on the list", { description: "Look out for early festive drops and 10% off your first order." });
            setEmail("");
          } else toast.error(res.error);
        });
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="h-11 min-w-0 flex-1 rounded-lg border border-ivory/20 bg-ivory/5 px-3.5 text-sm text-ivory placeholder:text-ivory/50 outline-none focus-visible:border-ivory/60"
      />
      <Button type="submit" disabled={pending} className="h-11 bg-ivory text-charcoal hover:bg-ivory/90">
        {pending ? "Joining…" : "Subscribe"}
      </Button>
    </form>
  );
}
