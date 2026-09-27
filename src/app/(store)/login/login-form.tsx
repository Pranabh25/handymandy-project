"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoNotice } from "@/components/common/demo-notice";
import { demoConfig } from "@/config/site";
import { formatPhone } from "@/lib/format";
import { phoneSchema } from "@/lib/validators";
import { sendOtp, verifyOtp } from "@/server/actions/auth";
import { OtpInput } from "./otp-input";

const RESEND_SECONDS = 30;

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [pending, start] = useTransition();
  const otpHeading = useRef<HTMLHeadingElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  function requestOtp(raw: string, isResend = false) {
    const parsed = phoneSchema.safeParse(raw);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      phoneRef.current?.focus();
      return;
    }
    setError(null);
    start(async () => {
      const res = await sendOtp(parsed.data);
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      setVerifiedPhone(res.data.phone);
      setOtp("");
      setStep("otp");
      setSecondsLeft(RESEND_SECONDS);
      toast.success(isResend ? "A new OTP is on its way" : "OTP sent", {
        description: `Sent to ${formatPhone(res.data.phone)} · Demo OTP: ${demoConfig.otp}`,
      });
      requestAnimationFrame(() => otpHeading.current?.focus());
    });
  }

  function submitOtp(code: string) {
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setError(null);
    start(async () => {
      const res = await verifyOtp({ phone: verifiedPhone, otp: code, name: name.trim() || undefined });
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      const first = res.data.name?.split(" ")[0];
      toast.success(res.data.isNew ? "Welcome to LushAura" : `Welcome back${first ? `, ${first}` : ""}`, {
        description: res.data.isNew ? "Your account is ready." : "You're now logged in.",
      });
      router.replace(next);
      router.refresh();
    });
  }

  if (step === "otp") {
    return (
      <form
        className="mt-7 space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submitOtp(otp);
        }}
      >
        <div>
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setError(null);
              setOtp("");
              requestAnimationFrame(() => phoneRef.current?.focus());
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Change number
          </button>
          <h2 ref={otpHeading} tabIndex={-1} className="mt-3 font-sans text-base font-semibold outline-none">
            Enter the OTP sent to {formatPhone(verifiedPhone)}
          </h2>
        </div>

        <OtpInput
          value={otp}
          onChange={(v) => {
            setOtp(v);
            if (error) setError(null);
          }}
          onComplete={(v) => {
            if (!pending) submitOtp(v);
          }}
          invalid={!!error}
          describedBy={error ? "otp-error" : "otp-hint"}
          disabled={pending}
        />
        {error ? (
          <p id="otp-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-between text-xs" id="otp-hint">
          <span className="text-muted-foreground">Didn&apos;t receive it?</span>
          {secondsLeft > 0 ? (
            <span className="text-muted-foreground tabular-nums" aria-live="polite">
              Resend in 0:{String(secondsLeft).padStart(2, "0")}
            </span>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={() => requestOtp(verifiedPhone, true)}
              className="font-semibold text-terracotta underline-offset-4 hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-name">
            Your name <span className="font-normal text-muted-foreground">(optional, for new accounts)</span>
          </Label>
          <Input
            id="login-name"
            autoComplete="name"
            value={name}
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ananya Sharma"
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={pending || otp.length !== 6}>
          {pending ? "Verifying…" : "Verify & continue"}
        </Button>

        <DemoNotice>
          No SMS is sent. Use OTP <strong className="tracking-widest">{demoConfig.otp}</strong>
          <button type="button" className="ml-1.5 underline underline-offset-2" onClick={() => {
              setOtp(demoConfig.otp);
              submitOtp(demoConfig.otp);
            }}>
            Fill &amp; verify
          </button>
        </DemoNotice>
      </form>
    );
  }

  return (
    <form
      className="mt-7 space-y-5"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        requestOtp(phone);
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="login-phone">Mobile number</Label>
        <div className="flex">
          <span className="inline-flex h-11 items-center rounded-l-lg border border-r-0 border-input bg-muted px-3.5 text-sm font-medium text-muted-foreground">
            +91
          </span>
          <Input
            ref={phoneRef}
            id="login-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            autoFocus
            placeholder="98765 43210"
            maxLength={11}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/[^\d ]/g, ""));
              if (error) setError(null);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "phone-error" : "phone-hint"}
            className="rounded-l-none tracking-wide"
          />
        </div>
        {error ? (
          <p id="phone-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : (
          <p id="phone-hint" className="text-xs text-muted-foreground">
            We&apos;ll use this number for order updates. No spam, ever.
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending OTP…" : "Get OTP"}
      </Button>

      <DemoNotice>
        OTP is always <strong className="tracking-widest">{demoConfig.otp}</strong>. Try the demo customer{" "}
        <strong>{formatPhone(demoConfig.customer.phone)}</strong> ({demoConfig.customer.name}) to see saved addresses and
        past orders.
        <button
          type="button"
          className="mt-1 block font-semibold underline underline-offset-2"
          onClick={() => {
            setPhone(demoConfig.customer.phone);
            requestOtp(demoConfig.customer.phone);
          }}
        >
          Use demo number
        </button>
      </DemoNotice>

      <p className="text-center text-xs leading-5 text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
