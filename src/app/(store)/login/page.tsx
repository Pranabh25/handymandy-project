import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Gift, ShieldCheck, Truck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { media } from "@/config/media";
import { siteConfig } from "@/config/site";
import { LoginForm } from "./login-form";
import { safeNext } from "./safe-next";

export const metadata: Metadata = {
  title: "Log in or sign up",
  description: "Log in to LushAura with your mobile number to track orders, save addresses and check out faster.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const user = await getCurrentUser();
  if (user) redirect(next);

  const fromCheckout = next.startsWith("/checkout");

  return (
    <div className="container-page py-8 md:py-14">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-lift lg:grid-cols-[1.05fr_1fr]">
        <div className="relative hidden min-h-[36rem] lg:block">
          <Image src={media.heroSecondary.src} alt={media.heroSecondary.alt} fill priority sizes="520px" className="object-cover" />
          <div className="absolute inset-x-6 bottom-6 rounded-xl bg-ivory/95 p-6 shadow-soft">
            <p className="eyebrow">Welcome to {siteConfig.name}</p>
            <p className="mt-2 font-display text-2xl leading-snug font-semibold text-charcoal">
              Thoughtful gifts and clean beauty, a tap away.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Truck className="size-4 text-terracotta" aria-hidden /> Track every order in real time
              </li>
              <li className="flex items-center gap-2.5">
                <Gift className="size-4 text-terracotta" aria-hidden /> Save addresses for faster gifting
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-terracotta" aria-hidden /> No passwords — log in with an OTP
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-8 sm:px-10 sm:py-12">
          <p className="eyebrow">{fromCheckout ? "Almost there" : "Log in or sign up"}</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            {fromCheckout ? "Log in to check out" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {fromCheckout
              ? "Your bag is saved. Verify your mobile number to add a delivery address and pay securely."
              : "Enter your mobile number and we'll send you a one-time password. New here? An account is created automatically."}
          </p>
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
