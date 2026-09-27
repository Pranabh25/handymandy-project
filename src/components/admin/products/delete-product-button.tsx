"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteOrArchiveProduct } from "@/server/actions/admin-catalog";

export function DeleteProductButton({ productId, productName, hasOrders }: { productId: string; productName: string; hasOrders: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const Icon = hasOrders ? Archive : Trash2;
  const verb = hasOrders ? "Archive" : "Delete";

  function confirm() {
    startTransition(async () => {
      const res = await deleteOrArchiveProduct(productId);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setOpen(false);
      toast.success(res.data.archived ? `${productName} archived` : `${productName} deleted`);
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button type="button" variant="destructive" size="sm" className="w-full" />}>
        <Icon aria-hidden /> {verb} product
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {verb} “{productName}”?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasOrders
              ? "It will be hidden from the store. Past orders and invoices keep their details. You can reactivate it later by setting the status to Active."
              : "This permanently removes the product, its photos and reviews. This can't be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Keep product</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirm} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Icon aria-hidden />} {verb}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
