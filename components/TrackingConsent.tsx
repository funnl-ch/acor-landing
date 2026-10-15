"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  readTrackingConsent,
  subscribeTrackingConsent,
  writeTrackingConsent,
  type TrackingConsent,
} from "@/lib/consent";
import { loadTrackingScripts } from "@/lib/tracking";

export function TrackingConsent() {
  const consent = useSyncExternalStore(
    subscribeTrackingConsent,
    readTrackingConsent,
    () => null,
  );
  const [mounted, setMounted] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const open = () => setPreferencesOpen(true);
    window.addEventListener("acor-open-consent", open);
    return () => window.removeEventListener("acor-open-consent", open);
  }, []);

  useEffect(() => {
    if (!mounted || consent !== "accepted") return;
    loadTrackingScripts();
  }, [mounted, consent]);

  if (!mounted || (consent !== null && !preferencesOpen)) return null;

  function choose(value: TrackingConsent) {
    const previous = readTrackingConsent();
    writeTrackingConsent(value);
    setPreferencesOpen(false);
    if (value === "accepted") {
      loadTrackingScripts();
      return;
    }
    if (previous === "accepted") window.location.reload();
  }

  return (
    <aside className="consent-banner" aria-label="Cookies">
      <p id="consent-text" className="consent-copy">
        Pour améliorer le site et mesurer les annonces, nous et nos
        partenaires utilisons quelques cookies. Rien ne part sans votre
        accord.
      </p>
      <div className="consent-actions">
        <button
          type="button"
          className="consent-btn consent-btn-accept"
          onClick={() => choose("accepted")}
        >
          Accepter et fermer
        </button>
        <button type="button" className="consent-btn" onClick={() => choose("refused")}>
          Refuser et fermer
        </button>
      </div>
      <Link href="/politique-de-confidentialite" className="consent-more">
        En savoir plus
      </Link>
    </aside>
  );
}
