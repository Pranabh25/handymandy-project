import { SiteHeader, AnnouncementBar } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getStoreSettings } from "@/server/settings";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStoreSettings();
  return (
    <>
      <AnnouncementBar text={settings.announcement} />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
