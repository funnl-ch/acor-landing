"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setOaiContext, trackPageViewed } from "@/lib/oai";

const PAGE_NAMES: Record<string, { id: string; name: string }> = {
  "/": { id: "home", name: "Estimation" },
  "/mentions-legales": { id: "mentions-legales", name: "Mentions légales" },
  "/politique-de-confidentialite": {
    id: "politique-de-confidentialite",
    name: "Politique de confidentialité",
  },
};

export function OaiPageView() {
  const pathname = usePathname();

  useEffect(() => {
    const page = PAGE_NAMES[pathname] ?? {
      id: pathname.replace(/^\//, "") || "home",
      name: pathname,
    };
    void setOaiContext();
    trackPageViewed(page.id, page.name);
  }, [pathname]);

  return null;
}
