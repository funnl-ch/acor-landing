import { NextResponse } from "next/server";
import { leadSchema, zodFieldErrors } from "@/lib/lead-schema";
import { sendLeadEmail } from "@/lib/mail";

export const runtime = "nodejs";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hitsByIp = new Map<string, number[]>();

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "RESEND_API_KEY absente : les leads seront enregistrés en log (LEAD_FAILED) sans e-mail.",
  );
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hitsByIp.get(ip) ?? []).filter(
    (stamp) => now - stamp < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT) {
    hitsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  hitsByIp.set(ip, recent);
  return false;
}

function honeypotFilled(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as { honeypot?: unknown }).honeypot;
  return typeof value === "string" && value.trim() !== "";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Le corps de la requête n’est pas un JSON valide." },
      { status: 400 },
    );
  }

  if (honeypotFilled(body)) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      {
        error:
          "Trop de demandes depuis cette connexion. Réessayez dans une heure ou appelez l’agence.",
      },
      { status: 429 },
    );
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Veuillez vérifier les champs du formulaire.",
        fields: zodFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
    await sendLeadEmail(parsed.data);
  } catch (error) {
    console.error("LEAD_FAILED", error);
    console.error("LEAD_FAILED", JSON.stringify(parsed.data));
  }

  // TODO: appel serveur à l’API Conversions OpenAI — identifiants non disponibles.

  return NextResponse.json({ ok: true });
}
