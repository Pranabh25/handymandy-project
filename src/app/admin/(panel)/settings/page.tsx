import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { getStoreSettings } from "@/server/settings";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getStoreSettings();
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Store settings" description={`Last updated ${formatDateTime(s.updatedAt)}`} />
      <SettingsForm
        key={s.updatedAt.toISOString()}
        initial={{
          storeName: s.storeName,
          supportEmail: s.supportEmail,
          supportPhone: s.supportPhone,
          whatsappNumber: s.whatsappNumber ?? "",
          gstin: s.gstin ?? "",
          registeredAddress: s.registeredAddress,
          freeShippingThreshold: String(s.freeShippingThreshold),
          shippingFee: String(s.shippingFee),
          codFee: String(s.codFee),
          codEnabled: s.codEnabled,
          giftWrapFee: String(s.giftWrapFee),
          announcement: s.announcement ?? "",
        }}
      />
    </div>
  );
}
