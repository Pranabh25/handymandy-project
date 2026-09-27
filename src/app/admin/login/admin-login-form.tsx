"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoNotice } from "@/components/common/demo-notice";
import { demoConfig } from "@/config/site";
import { adminLogin } from "@/server/actions/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const res = await adminLogin({ email, password });
          if (!res.ok) return setError(res.error);
          toast.success("Welcome back");
          router.replace("/admin");
          router.refresh();
        });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="admin-email">Email</Label>
        <Input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "admin-login-error" : undefined}
        />
      </div>
      {error ? (
        <p id="admin-login-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <DemoNotice>
        Use <strong>{demoConfig.admin.email}</strong> / <strong>{demoConfig.admin.password}</strong>
        <button
          type="button"
          className="ml-1 underline underline-offset-2"
          onClick={() => {
            setEmail(demoConfig.admin.email);
            setPassword(demoConfig.admin.password);
          }}
        >
          Fill in
        </button>
      </DemoNotice>
    </form>
  );
}
