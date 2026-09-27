"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { submitContactMessage } from "@/server/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SUBJECTS = ["Order help", "Corporate gifting", "Product question", "Returns", "Other"] as const;

const EMPTY = { name: "", email: "", phone: "", subject: "Order help", message: "" };

type Field = keyof typeof EMPTY;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const initialSubject = SUBJECTS.find((s) => s === defaultSubject) ?? EMPTY.subject;
  const [values, setValues] = useState({ ...EMPTY, subject: initialSubject });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: set(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await submitContactMessage(values);
      if (res.ok) {
        toast.success("Message sent", { description: "Thank you — our care team will reply within one working day." });
        setValues({ ...EMPTY, subject: values.subject });
        setErrors({});
        setSent(true);
      } else {
        setErrors((res.fieldErrors ?? {}) as Partial<Record<Field, string>>);
        toast.error(res.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Full name</Label>
          <Input {...fieldProps("name")} autoComplete="name" placeholder="Ananya Sharma" required />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@example.com" required />
          <FieldError id="contact-email-error" message={errors.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">
            Mobile number <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="98765 43210" />
          <FieldError id="contact-phone-error" message={errors.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">What can we help with?</Label>
          <select
            {...fieldProps("subject")}
            className={cn(
              "h-11 w-full rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm",
            )}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <FieldError id="contact-subject-error" message={errors.subject} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          {...fieldProps("message")}
          rows={6}
          className="min-h-36 bg-card px-3.5 py-3"
          placeholder="Share your order number (e.g. LA2609264821) if your message is about an existing order."
          required
        />
        <FieldError id="contact-message-error" message={errors.message} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          We use these details only to reply to you. See our{" "}
          <Link href="/privacy" className="underline underline-offset-3 hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" disabled={pending} className="sm:min-w-44">
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
          {pending ? "Sending…" : "Send message"}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {sent ? "Your message has been sent." : ""}
      </p>
    </form>
  );
}
