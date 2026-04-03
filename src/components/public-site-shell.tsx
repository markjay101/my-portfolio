"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { ContactModal } from "./contact-form";

export function PublicSiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader onContactClick={() => setOpen(true)} />
      <ContactModal open={open} setOpen={setOpen} />
      {children}
    </div>
  );
}

