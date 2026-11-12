import { readTrackingConsent } from "@/lib/consent";
import {
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from "@/lib/oai-hash";

export const META_PIXEL_ID = "136428647141757";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** File d’attente officielle du pixel, pour que les événements partent même si le script n’est pas encore là. */
export function installMetaPixel(): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") return;

  const fbq = function (...args: unknown[]) {
    if (typeof fbq.callMethod === "function") {
      Reflect.apply(fbq.callMethod, fbq, args);
    } else {
      fbq.queue.push(args);
    }
  } as Fbq;

  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;

  const script = document.createElement("script");
  script.id = "meta-pixel";
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
}

function trackingAllowed(): boolean {
  return readTrackingConsent() === "accepted";
}

export function trackMetaPageView(): void {
  if (!trackingAllowed()) return;
  installMetaPixel();
  window.fbq?.("track", "PageView");
}

export type MetaLeadInput = {
  eventId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  externalId?: string;
};

/** Lead standard + correspondance avancée. Le pixel hache les identifiants avant envoi. */
export function trackMetaLead({
  eventId,
  email,
  firstName,
  lastName,
  phone,
  city,
  externalId,
}: MetaLeadInput): void {
  if (!trackingAllowed()) return;
  installMetaPixel();
  if (typeof window.fbq !== "function") return;

  const userData: Record<string, string> = { country: "ch" };
  const normalizedEmail = normalizeEmail(email ?? "");
  if (normalizedEmail) userData.em = normalizedEmail;
  const first = normalizeName(firstName);
  if (first) userData.fn = first;
  const last = normalizeName(lastName);
  if (last) userData.ln = last;
  const digits = normalizePhone(phone);
  if (digits) userData.ph = digits;
  const place = normalizeName(city);
  if (place) userData.ct = place;
  const id = externalId?.trim();
  if (id) userData.external_id = id;

  window.fbq("init", META_PIXEL_ID, userData);
  window.fbq(
    "track",
    "Lead",
    { content_name: "Demande d'estimation" },
    { eventID: eventId },
  );
}
