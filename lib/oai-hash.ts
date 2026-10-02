const ASCII_PUNCT_AND_SPACE = /[\s!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/g;

export const OAI_PIXEL_ID = "HmLqosFboZSUPnPKUJWyg6";

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeName(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().replace(ASCII_PUNCT_AND_SPACE, "");
  return normalized || undefined;
}

/** Format suisse national (0xx) → indicatif 41, comme le demande OpenAI. */
export function normalizePhone(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let digits = value.replace(/[\s().-]/g, "").replace(/^\+/, "");
  if (/^0\d{9}$/.test(digits)) {
    digits = `41${digits.slice(1)}`;
  }
  digits = digits.replace(/^0+/, "");
  if (digits.length < 8 || digits.length > 15 || !/^\d+$/.test(digits)) {
    return undefined;
  }
  return digits;
}
