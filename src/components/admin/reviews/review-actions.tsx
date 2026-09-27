"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { moderateReview } from "@/server/actions/admin-reviews";

type Status = "PENDING" | "APPROVED" | "REJECTED";

const MESSAGES: Record<Status, string> = {
  APPROVED: "Review approved and published",
  REJECTED: "Review rejected",
  PENDING: "Review moved back to pending",
};

/** Approve / reject buttons. The server recomputes the product's rating after each change. */
export function ReviewActions({ reviewId, status }: { reviewId: string; status: Status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (next: Status) =>
    startTransition(async () => {
      const res = await moderateReview({ reviewId, status: next });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(MESSAGES[next]);
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy={pending}>
      {status !== "APPROVED" ? (
        <Button size="sm" onClick={() => run("APPROVED")} disabled={pending}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />} Approve
        </Button>
      ) : null}
      {status !== "REJECTED" ? (
        <Button size="sm" variant="outline" onClick={() => run("REJECTED")} disabled={pending}>
          <X aria-hidden /> Reject
        </Button>
      ) : null}
      {status !== "PENDING" ? (
        <Button size="sm" variant="ghost" onClick={() => run("PENDING")} disabled={pending}>
          <RotateCcw aria-hidden /> Back to pending
        </Button>
      ) : null}
    </div>
  );
}
