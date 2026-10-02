import {
  normalizeEmail,
  normalizeName,
  normalizePhone,
  sha256Hex,
} from "@/lib/oai-hash";

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

const EXTERNAL_ID_COOKIE = "__oai_eid";
const TWO_YEARS_S = 60 * 60 * 24 * 365 * 2;

export type OaiUserInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
};

export type OaiAttribution = {
  oppref?: string;
  obref?: string;
  externalId: string;
  sourceUrl: string;
};

function hasOaiq(): boolean {
  return typeof window !== "undefined" && typeof window.oaiq === "function";
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getExternalId(): string {
  if (typeof document === "undefined") return "";

  const existing = readCookie(EXTERNAL_ID_COOKIE)?.trim();
  if (existing) return existing;

  const id = crypto.randomUUID();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${EXTERNAL_ID_COOKIE}=${encodeURIComponent(id)}; Path=/; SameSite=Lax; Max-Age=${TWO_YEARS_S}${secure}`;
  return id;
}

export function getOaiAttribution(): OaiAttribution {
  const fromUrl =
    typeof location !== "undefined"
      ? new URLSearchParams(location.search).get("oppref")?.trim()
      : undefined;
  return {
    oppref: fromUrl || readCookie("__oppref")?.trim() || undefined,
    obref: readCookie("__obref")?.trim() || undefined,
    externalId: getExternalId(),
    sourceUrl: typeof location !== "undefined" ? location.href : "",
  };
}

/** Matching de base dès la première vue : identifiant cookie, pays, canton. */
export async function setOaiContext(): Promise<void> {
  if (!hasOaiq()) return;
  const externalId = getExternalId().trim();
  if (!externalId) return;
  window.oaiq!("init", {
    user: {
      external_id_sha256: await sha256Hex(externalId),
      country: "CH",
      region: "Valais",
    },
  });
}

export async function setOaiUser({
  email,
  firstName,
  lastName,
  phone,
  city,
}: OaiUserInput): Promise<void> {
  if (!hasOaiq()) return;

  const user: Record<string, string> = {
    email_sha256: await sha256Hex(normalizeEmail(email)),
    external_id_sha256: await sha256Hex(getExternalId().trim()),
    country: "CH",
    region: "Valais",
  };

  const first = normalizeName(firstName);
  if (first) user.first_name_sha256 = await sha256Hex(first);

  const last = normalizeName(lastName);
  if (last) user.last_name_sha256 = await sha256Hex(last);

  const digits = normalizePhone(phone);
  if (digits) user.phone_number_sha256 = await sha256Hex(digits);

  const place = city?.trim();
  if (place) user.city = place;

  window.oaiq!("init", { user });
}

export function trackEvent(
  name: string,
  data: Record<string, unknown>,
  options?: Record<string, unknown>,
): void {
  if (!hasOaiq()) return;
  if (options) {
    window.oaiq!("measure", name, data, options);
    return;
  }
  window.oaiq!("measure", name, data);
}

export function trackPageViewed(id: string, name: string): void {
  trackEvent("page_viewed", {
    type: "contents",
    contents: [{ id, name, content_type: "page" }],
  });
}

export function trackContentsViewed(id: string, name: string): void {
  trackEvent("contents_viewed", {
    type: "contents",
    contents: [{ id, name, content_type: "product" }],
  });
}

export function trackCustomEvent(name: string): void {
  trackEvent("custom", { type: "custom" }, { custom_event_name: name });
}
