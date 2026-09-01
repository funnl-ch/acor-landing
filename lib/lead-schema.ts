import { z } from "zod";

export const TYPE_BIEN = [
  "appartement",
  "maison",
  "terrain",
  "immeuble",
  "local",
] as const;

export const ETAT_BIEN = [
  "neuf",
  "renove",
  "bon",
  "rafraichir",
  "renover",
] as const;

export const ECHEANCE = ["asap", "6mois", "1an", "renseigne"] as const;

function emptyToUndefined(value: unknown) {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }
  return value;
}

const optionalText = z.preprocess(emptyToUndefined, z.string().optional());

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : value;
  }
  return value;
}, z.number().optional());

export const leadSchema = z.object({
  typeBien: z.enum(TYPE_BIEN),
  commune: z.string().trim().min(1),
  pieces: optionalNumber,
  surfaceHabitable: optionalNumber,
  surfaceTerrain: optionalNumber,
  etat: z.enum(ETAT_BIEN),
  echeance: z.enum(ECHEANCE),
  prenom: z.string().trim().min(1),
  nom: z.string().trim().min(1),
  email: z.email(),
  telephone: z.string().trim().min(1),
  adresseBien: optionalText,
  consentement: z.literal(true),
  honeypot: z.string().optional(),
  utmSource: optionalText,
  utmCampaign: optionalText,
  utmContent: optionalText,
  gclid: optionalText,
  referrer: optionalText,
});

export type LeadPayload = z.infer<typeof leadSchema>;

export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}
