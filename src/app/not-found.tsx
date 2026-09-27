import type { Metadata } from "next";
import { MinimalShell } from "@/components/content/minimal-shell";
import { NotFoundContent } from "@/components/content/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Handles unmatched URLs across the app (rendered in the root layout, without the store header/footer). */
export default function NotFound() {
  return (
    <MinimalShell>
      <NotFoundContent />
    </MinimalShell>
  );
}
