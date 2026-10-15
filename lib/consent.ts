export const CONSENT_STORAGE_KEY = "acor-tracking-consent";
const CONSENT_EVENT = "acor-tracking-consent";

export type TrackingConsent = "accepted" | "refused";

const TRACKING_COOKIES = ["__oai_eid", "__oppref", "__obref", "_clck", "_clsk", "CLID"];

export function readTrackingConsent(): TrackingConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "refused" ? value : null;
  } catch {
    return null;
  }
}

export function writeTrackingConsent(value: TrackingConsent): void {
  localStorage.setItem(CONSENT_STORAGE_KEY, value);
  if (value === "refused") clearTrackingCookies();
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function subscribeTrackingConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function openConsentPreferences(): void {
  window.dispatchEvent(new Event("acor-open-consent"));
}

function clearTrackingCookies(): void {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  for (const name of TRACKING_COOKIES) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  }
}
