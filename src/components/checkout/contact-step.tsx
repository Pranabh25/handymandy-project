"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/lib/format";
import { emailSchema } from "@/lib/validators";

type Props = {
  user: { name: string | null; phone: string | null };
  email: string;
  onEmailChange: (email: string) => void;
  onContinue: () => void;
};

export function ContactStep({ user, email, onEmailChange, onContinue }: Props) {
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim() && !emailSchema.safeParse(email).success) {
          setError("Enter a valid email address, or leave it blank");
          document.getElementById("checkout-email")?.focus();
          return;
        }
        setError(null);
        onContinue();
      }}
    >
      <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-4 py-3">
        <div className="min-w-0 text-sm">
          <p className="font-semibold">{user.name || "Your mobile number"}</p>
          <p className="text-muted-foreground tabular-nums">{user.phone ? formatPhone(user.phone) : "—"}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-soft px-2.5 py-1 text-xs font-medium text-sage">
          <BadgeCheck className="size-3.5" aria-hidden />
          Verified via OTP
        </span>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="checkout-email">
          Email <span className="font-normal text-muted-foreground">(optional, for your invoice)</span>
        </Label>
        <Input
          id="checkout-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            if (error) setError(null);
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "checkout-email-error" : "checkout-email-hint"}
        />
        {error ? (
          <p id="checkout-email-error" role="alert" className="text-xs text-destructive">
            {error}
          </p>
        ) : (
          <p id="checkout-email-hint" className="text-xs text-muted-foreground">
            Order updates are sent by SMS to your verified number.
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Continue to address
      </Button>
    </form>
  );
}
