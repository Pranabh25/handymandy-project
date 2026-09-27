import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { formatPhone } from "@/lib/format";
import { AccountSidebar, AccountTabs } from "@/components/account/account-nav";

export const metadata: Metadata = {
  title: { default: "My account", template: "%s | My account | LushAura" },
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/account");
  const firstName = user.name?.split(" ")[0];

  return (
    <div className="container-page py-8 md:py-12">
      <header className="mb-6 md:mb-10">
        <p className="eyebrow mb-2">My account</p>
        <h1 className="text-3xl font-semibold md:text-4xl">{firstName ? `Namaste, ${firstName}` : "Namaste"}</h1>
        {user.phone ? (
          <p className="mt-1.5 text-sm text-muted-foreground">Signed in with {formatPhone(user.phone)}</p>
        ) : null}
      </header>
      <div className="mb-6 lg:hidden">
        <AccountTabs />
      </div>
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-14">
        <aside className="hidden lg:block">
          <AccountSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
