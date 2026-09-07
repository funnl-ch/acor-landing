declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

const EXTERNAL_ID_COOKIE = "__oai_eid";
const TWO_YEARS_S = 60 * 60 * 24 * 365 * 2;
const ASCII_PUNCT_AND_SPACE = /[\s!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/g;

export type OaiUserInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

function hasOaiq(): boolean {
  return typeof window !== "undefined" && typeof window.oaiq === "function";
}

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
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

export async function setOaiUser({
  email,
  firstName,
  lastName,
  phone,
}: OaiUserInput): Promise<void> {
  if (!hasOaiq()) return;

  const user: Record<string, string> = {
    email_sha256: await sha256Hex(email.trim().toLowerCase()),
    external_id_sha256: await sha256Hex(getExternalId().trim()),
  };

  const first = normalizeName(firstName);
  if (first) user.first_name_sha256 = await sha256Hex(first);

  const last = normalizeName(lastName);
  if (last) user.last_name_sha256 = await sha256Hex(last);

  const digits = normalizePhone(phone);
  if (digits) user.phone_number_sha256 = await sha256Hex(digits);

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

function normalizeName(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().replace(ASCII_PUNCT_AND_SPACE, "");
  return normalized || undefined;
}

function normalizePhone(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const digits = value
    .replace(/[\s().-]/g, "")
    .replace(/^\+/, "")
    .replace(/^0+/, "");
  if (digits.length < 8 || digits.length > 15 || !/^\d+$/.test(digits)) {
    return undefined;
  }
  return digits;
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}
