declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export const AB_VARIANTS = ["control", "short"] as const;

export type AbVariant = (typeof AB_VARIANTS)[number];

const COOKIE = "ab";
const MAX_AGE_S = 60 * 60 * 24 * 90;

function isAbVariant(value: string | null | undefined): value is AbVariant {
  return value === "control" || value === "short";
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

function writeCookie(value: AbVariant): void {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${value}; Path=/; SameSite=Lax; Max-Age=${MAX_AGE_S}${secure}`;
}

/** `?ab=short` ou `?ab=control` pour forcer une variante (tests). */
export function getOrAssignAbVariant(): AbVariant {
  if (typeof window === "undefined") return "control";

  const fromUrl = new URLSearchParams(location.search).get("ab")?.trim();
  if (isAbVariant(fromUrl)) {
    writeCookie(fromUrl);
    return fromUrl;
  }

  const fromCookie = readCookie(COOKIE);
  if (isAbVariant(fromCookie)) return fromCookie;

  const assigned: AbVariant = Math.random() < 0.5 ? "control" : "short";
  writeCookie(assigned);
  return assigned;
}

export function tagClarityAb(variant: AbVariant): void {
  const apply = () => {
    const clarity = window.clarity;
    if (typeof clarity !== "function") return false;
    clarity("set", "ab", variant);
    return true;
  };

  if (apply()) return;

  const started = Date.now();
  const timer = window.setInterval(() => {
    if (apply() || Date.now() - started > 8000) {
      window.clearInterval(timer);
    }
  }, 250);
}
