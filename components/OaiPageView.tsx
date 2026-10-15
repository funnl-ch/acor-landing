"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { readTrackingConsent, subscribeTrackingConsent } from "@/lib/consent";
import { setOaiContext, trackPageViewed } from "@/lib/oai";
import { loadTrackingScripts } from "@/lib/tracking";

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
  const consent = useSyncExternalStore(
    subscribeTrackingConsent,
    readTrackingConsent,
    () => null,
  );

  useEffect(() => {
    if (consent !== "accepted") return;
    const page = PAGE_NAMES[pathname] ?? {
      id: pathname.replace(/^\//, "") || "home",
      name: pathname,
    };
    loadTrackingScripts();
    void setOaiContext();
    trackPageViewed(page.id, page.name);
  }, [pathname, consent]);

  return null;
}
