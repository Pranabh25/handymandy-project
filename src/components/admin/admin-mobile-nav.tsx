"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminNav } from "./admin-nav";
import { Logo } from "@/components/layout/logo";

export function AdminMobileNav({ badges }: { badges?: Partial<Record<string, number>> }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-muted lg:hidden" aria-label="Open admin menu">
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-background p-4">
        <SheetHeader className="p-0 pb-4">
          <SheetTitle className="sr-only">Admin menu</SheetTitle>
          <Logo href="/admin" />
        </SheetHeader>
        <AdminNav badges={badges} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
