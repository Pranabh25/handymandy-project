"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { AdminCard } from "@/components/admin/admin-page-header";
import { deleteCoupon, setCouponActive } from "@/server/actions/admin-coupons";
import { formatDate, formatINR } from "@/lib/format";
import type { Tone } from "@/lib/order-status";
import { CouponDialog, EMPTY_COUPON, type CouponFormValues } from "./coupon-dialog";

export type CouponRow = {
  id: string;
  code: string;
  description: string;
  type: "PERCENT" | "FLAT" | "FREE_SHIPPING";
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
};

const istDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" });

function couponStatus(c: CouponRow, now: number): { label: string; tone: Tone } {
  if (!c.isActive) return { label: "Inactive", tone: "neutral" };
  if (c.endsAt && c.endsAt.getTime() < now) return { label: "Expired", tone: "danger" };
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return { label: "Used up", tone: "warning" };
  if (c.startsAt && c.startsAt.getTime() > now) return { label: "Scheduled", tone: "info" };
  return { label: "Active", tone: "success" };
}

function offerText(c: CouponRow) {
  if (c.type === "FREE_SHIPPING") return "Free shipping";
  if (c.type === "FLAT") return `${formatINR(c.value)} off`;
  return `${c.value}% off${c.maxDiscount ? ` · up to ${formatINR(c.maxDiscount)}` : ""}`;
}

function toForm(c: CouponRow): CouponFormValues {
  return {
    code: c.code,
    description: c.description,
    type: c.type,
    value: String(c.value),
    minOrder: String(c.minOrder),
    maxDiscount: c.maxDiscount == null ? "" : String(c.maxDiscount),
    usageLimit: c.usageLimit == null ? "" : String(c.usageLimit),
    startsAt: c.startsAt ? istDate.format(c.startsAt) : "",
    endsAt: c.endsAt ? istDate.format(c.endsAt) : "",
    isActive: c.isActive,
  };
}

export function CouponsManager({ coupons, now }: { coupons: CouponRow[]; now: number }) {
  const router = useRouter();
  const [editing, setEditing] = useState<{ id: string | null; initial: CouponFormValues; key: number } | null>(null);
  const [deleting, setDeleting] = useState<CouponRow | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = (c: CouponRow, isActive: boolean) =>
    startTransition(async () => {
      const res = await setCouponActive(c.id, isActive);
      if (!res.ok) toast.error(res.error);
      else toast.success(`${c.code} ${isActive ? "activated" : "deactivated"}`);
      router.refresh();
    });

  const remove = () =>
    startTransition(async () => {
      if (!deleting) return;
      const res = await deleteCoupon(deleting.id);
      if (!res.ok) toast.error(res.error);
      else toast.success(`${deleting.code} deleted`);
      setDeleting(null);
      router.refresh();
    });

  const openNew = () => setEditing({ id: null, initial: EMPTY_COUPON, key: Date.now() });

  return (
    <>
      <AdminCard
        title={`${coupons.length} ${coupons.length === 1 ? "coupon" : "coupons"}`}
        action={
          <Button size="sm" variant="accent" onClick={openNew}>
            <Plus aria-hidden /> New coupon
          </Button>
        }
      >
        {coupons.length === 0 ? (
          <EmptyState icon={TicketPercent} title="No coupons yet" description="Create a festive code like DIWALI15 to reward shoppers." className="[&_h2]:text-xl" />
        ) : (
          <ul className="divide-y">
            {coupons.map((c) => {
              const st = couponStatus(c, now);
              return (
                <li key={c.id} className="flex flex-col gap-3 px-4 py-3.5 sm:px-5 md:flex-row md:items-center md:gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-dashed border-terracotta/50 bg-terracotta-soft px-2 py-0.5 font-mono text-sm font-semibold tracking-wide">{c.code}</span>
                      <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                    </div>
                    <p className="mt-1 truncate text-sm">{c.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {offerText(c)}
                      {c.minOrder ? ` · min. order ${formatINR(c.minOrder)}` : ""}
                      {c.startsAt || c.endsAt ? ` · ${c.startsAt ? formatDate(c.startsAt) : "Now"} – ${c.endsAt ? formatDate(c.endsAt) : "no end date"}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:justify-end">
                    <p className="text-xs text-muted-foreground tabular-nums">
                      <span className="font-medium text-foreground">{c.usedCount}</span>
                      {c.usageLimit != null ? ` / ${c.usageLimit}` : ""} used
                    </p>
                    <div className="flex items-center gap-1">
                      <label className="mr-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Switch checked={c.isActive} disabled={pending} onCheckedChange={(v) => toggle(c, Boolean(v))} aria-label={`${c.code} active`} />
                        <span className="hidden sm:inline">Active</span>
                      </label>
                      <Button variant="ghost" size="icon-sm" onClick={() => setEditing({ id: c.id, initial: toForm(c), key: Date.now() })} aria-label={`Edit ${c.code}`}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => setDeleting(c)} aria-label={`Delete ${c.code}`}>
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminCard>

      {editing ? (
        <CouponDialog key={editing.key} open onOpenChange={(o) => !o && setEditing(null)} couponId={editing.id} initial={editing.initial} />
      ) : null}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.code}?</AlertDialogTitle>
            <AlertDialogDescription>Customers will no longer be able to use this code. Past orders keep their discount. To pause it instead, switch it off.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep coupon</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove} disabled={pending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
