"use client";

import { createContext, useContext } from "react";
import type { PricingSettings } from "@/lib/pricing";

export type ClientStoreSettings = PricingSettings & {
  codEnabled: boolean;
  supportPhone: string;
  supportEmail: string;
};

export type ClientUser = { id: string; name: string | null; phone: string | null; email: string | null; role: "CUSTOMER" | "ADMIN" } | null;

type Ctx = { settings: ClientStoreSettings; user: ClientUser };

const StoreContext = createContext<Ctx | null>(null);

/** Passes server-loaded store settings and the signed-in user to client components. */
export function StoreProvider({ value, children }: { value: Ctx; children: React.ReactNode }) {
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStoreSettings() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStoreSettings must be used inside <StoreProvider>");
  return ctx.settings;
}

export function useCurrentUser() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useCurrentUser must be used inside <StoreProvider>");
  return ctx.user;
}
