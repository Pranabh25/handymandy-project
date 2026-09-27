import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";
import { AdminLoginForm } from "./admin-login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user?.role === "ADMIN") redirect("/admin");
  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-sand/60 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo />
          <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Store admin</p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-lift sm:p-8">
          <h1 className="font-sans text-xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage products, orders and refunds.</p>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
