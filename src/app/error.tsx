"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { MinimalShell } from "@/components/content/minimal-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MinimalShell>
      <section className="container-page flex flex-col items-center py-16 text-center md:py-24" role="alert">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold text-balance md:text-5xl">We dropped the ribbon on this one</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground md:text-base">
          An unexpected error stopped this page from loading. Your cart is safe — please try again, and if the problem
          continues, write to us at {siteConfig.supportEmail}.
        </p>
        {error.digest ? <p className="mt-3 text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => retry()}>
            <RotateCcw aria-hidden />
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Back to home
          </Link>
        </div>
      </section>
    </MinimalShell>
  );
}
