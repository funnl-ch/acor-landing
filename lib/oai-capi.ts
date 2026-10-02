import {
  OAI_PIXEL_ID,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  sha256Hex,
} from "@/lib/oai-hash";
import type { LeadPayload } from "@/lib/lead-schema";

const CAPI_URL = "https://bzr.openai.com/v1/events";

type CapiInput = {
  ip: string;
  userAgent: string;
};

export async function sendOaiLeadEvent(
  lead: LeadPayload,
  { ip, userAgent }: CapiInput,
): Promise<void> {
  const token = process.env.OPENAI_CONVERSIONS_API_TOKEN?.trim();
  const pixelId = process.env.OPENAI_PIXEL_ID?.trim() || OAI_PIXEL_ID;
  if (!token || !lead.eventId) return;

  const emails = [await sha256Hex(normalizeEmail(lead.email))];
  const phones = normalizePhone(lead.telephone);
  const first = normalizeName(lead.prenom);
  const last = normalizeName(lead.nom);
  const external = lead.externalId?.trim();

  const user: Record<string, unknown> = {
    emails_sha256: emails,
    countries: ["CH"],
    regions: ["Valais"],
    cities: [lead.commune],
  };

  if (phones) user.phone_numbers_sha256 = [await sha256Hex(phones)];
  if (first) user.first_names_sha256 = [await sha256Hex(first)];
  if (last) user.last_names_sha256 = [await sha256Hex(last)];
  if (external) user.external_ids_sha256 = [await sha256Hex(external)];
  if (lead.obref?.trim()) user.obref = lead.obref.trim();
  if (ip && ip !== "unknown") user.ip_address = ip;
  if (userAgent) user.user_agent = userAgent;

  const event: Record<string, unknown> = {
    id: lead.eventId,
    type: "registration_completed",
    timestamp_ms: Date.now(),
    action_source: "web",
    source_url: lead.sourceUrl || "https://acor-landing.vercel.app/",
    data: { type: "customer_action" },
    user,
  };

  if (lead.oppref?.trim()) event.oppref = lead.oppref.trim();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${CAPI_URL}?pid=${encodeURIComponent(pixelId)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ validate_only: false, events: [event] }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("OAI_CAPI_FAILED", response.status, body.slice(0, 400));
    }
  } catch (error) {
    console.error("OAI_CAPI_FAILED", error);
  } finally {
    clearTimeout(timer);
  }
}
