import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getAdminCoupons } from "@/server/admin/marketing";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CouponsManager } from "@/components/admin/coupons/coupons-manager";

export const metadata: Metadata = { title: "Coupons" };

export default async function CouponsPage() {
  await requireAdmin();
  const coupons = await getAdminCoupons();
  // eslint-disable-next-line react-hooks/purity -- request-time timestamp for status badges
  const now = Date.now();
  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader title="Coupons" description="Discount codes for festive campaigns, first orders and free shipping." />
      <CouponsManager coupons={coupons} now={now} />
    </div>
  );
}
