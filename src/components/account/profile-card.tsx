"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/server/actions/auth";
import { formatDate, formatPhone } from "@/lib/format";

type Props = { name: string | null; email: string | null; phone: string | null; memberSince: Date };

export function ProfileCard({ name, email, phone, memberSince }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: name ?? "", email: email ?? "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const rows = [
    { label: "Name", value: name || "Add your name" },
    { label: "Mobile", value: phone ? formatPhone(phone) : "—" },
    { label: "Email", value: email || "Add an email for order updates" },
    { label: "Member since", value: formatDate(memberSince) },
  ];

  return (
    <section aria-labelledby="profile-heading" className="rounded-xl border bg-card p-5 shadow-soft md:p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 id="profile-heading" className="text-2xl font-semibold">
          Profile
        </h2>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (o) setForm({ name: name ?? "", email: email ?? "" });
            setError(null);
          }}
        >
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            <Pencil aria-hidden />
            Edit
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Edit profile</DialogTitle>
              <DialogDescription>Your mobile number is your login and can&apos;t be changed here.</DialogDescription>
            </DialogHeader>
            <form
              id="profile-form"
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                start(async () => {
                  const res = await updateProfile(form);
                  if (!res.ok) return setError(res.error);
                  toast.success("Profile updated");
                  setOpen(false);
                  router.refresh();
                });
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email">Email (optional)</Label>
                <Input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" form="profile-form" disabled={pending}>
                {pending ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="mt-0.5 text-sm font-medium break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
