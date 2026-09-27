"use client";

import { useState, useTransition } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { deleteAddress, setDefaultAddress, type SavedAddress } from "@/server/actions/addresses";
import { formatPhone } from "@/lib/format";
import { AddressFormDialog } from "@/components/account/address-form-dialog";

const TYPE_LABEL = { HOME: "Home", WORK: "Work", OTHER: "Other" } as const;

export function AddressManager({ addresses }: { addresses: SavedAddress[] }) {
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [toDelete, setToDelete] = useState<SavedAddress | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const openForm = (a: SavedAddress | null) => {
    setEditing(a);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  };

  const makeDefault = (id: string) => {
    setPendingId(id);
    start(async () => {
      const res = await setDefaultAddress(id);
      setPendingId(null);
      if (res.ok) toast.success("Default address updated");
      else toast.error(res.error);
    });
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const id = toDelete.id;
    setPendingId(id);
    start(async () => {
      const res = await deleteAddress(id);
      setPendingId(null);
      setToDelete(null);
      if (res.ok) toast.success("Address removed");
      else toast.error(res.error);
    });
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">Saved addresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your default address is pre-selected at checkout.</p>
        </div>
        {addresses.length ? (
          <Button onClick={() => openForm(null)}>
            <Plus aria-hidden />
            Add address
          </Button>
        ) : null}
      </div>

      {addresses.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="flex flex-col rounded-xl border bg-card p-5 shadow-soft data-[default=true]:border-charcoal/40"
              data-default={a.isDefault}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{a.fullName}</p>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                  {TYPE_LABEL[a.type]}
                </span>
                {a.isDefault ? <StatusBadge tone="success">Default</StatusBadge> : null}
              </div>
              <address className="mt-2 flex-1 text-sm leading-6 text-muted-foreground not-italic">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                {a.landmark ? <span className="block">Near {a.landmark}</span> : null}
                <span className="block">
                  {a.city}, {a.state} {a.pincode}
                </span>
                <span className="block">{formatPhone(a.phone)}</span>
              </address>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => openForm(a)}>
                  <Pencil aria-hidden />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setToDelete(a)}
                  disabled={pending && pendingId === a.id}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 aria-hidden />
                  Remove
                </Button>
                {!a.isDefault ? (
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-auto px-0"
                    onClick={() => makeDefault(a.id)}
                    disabled={pending}
                  >
                    {pending && pendingId === a.id ? "Updating…" : "Set as default"}
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={MapPin}
            title="No saved addresses"
            description="Save your home, office or a loved one's address to check out faster next time."
          >
            <Button className="mt-6" onClick={() => openForm(null)}>
              <Plus aria-hidden />
              Add your first address
            </Button>
          </EmptyState>
        </div>
      )}

      <AddressFormDialog key={formKey} open={formOpen} onOpenChange={setFormOpen} address={editing} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this address?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete ? `${toDelete.fullName}, ${toDelete.city} will be removed from your saved addresses.` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep it</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmDelete} disabled={pending}>
              {pending ? "Removing…" : "Remove"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
