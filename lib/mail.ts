import { Resend } from "resend";
import type { LeadPayload } from "./lead-schema";

const TYPE_LABELS: Record<LeadPayload["typeBien"], string> = {
  appartement: "Appartement",
  maison: "Maison",
  terrain: "Terrain",
  immeuble: "Immeuble",
  local: "Local commercial",
};

const ETAT_LABELS: Record<LeadPayload["etat"], string> = {
  neuf: "Neuf ou récent",
  renove: "Rénové récemment",
  bon: "Bon état",
  rafraichir: "À rafraîchir",
  renover: "À rénover entièrement",
};

const ECHEANCE_LABELS: Record<LeadPayload["echeance"], string> = {
  asap: "Dès que possible",
  "6mois": "Dans les 6 mois",
  "1an": "D’ici un an",
  renseigne: "Je me renseigne, sans échéance",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function telHref(phone: string): string {
  const compact = phone.replace(/\s/g, "");
  return compact.startsWith("+") || compact.startsWith("00")
    ? `tel:${compact}`
    : `tel:${compact}`;
}

function receivedAt(): string {
  return new Intl.DateTimeFormat("fr-CH", {
    timeZone: "Europe/Zurich",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());
}

function provenanceLine(lead: LeadPayload): string | undefined {
  const parts = [lead.utmSource, lead.utmCampaign, lead.utmContent].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export function typeBienLabel(value: LeadPayload["typeBien"]): string {
  return TYPE_LABELS[value];
}

export function buildLeadEmail(lead: LeadPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const typeLabel = TYPE_LABELS[lead.typeBien];
  const contactLines = [
    `${lead.prenom} ${lead.nom}`,
    lead.telephone,
    lead.email,
    `Échéance : ${ECHEANCE_LABELS[lead.echeance]}`,
  ];

  const bienLines = [
    `Type : ${typeLabel}`,
    `Commune : ${lead.commune}`,
    lead.adresseBien ? `Adresse : ${lead.adresseBien}` : undefined,
    lead.pieces !== undefined ? `Pièces : ${lead.pieces}` : undefined,
    lead.surfaceHabitable !== undefined
      ? `Surface habitable : ${lead.surfaceHabitable} m²`
      : undefined,
    lead.surfaceTerrain !== undefined
      ? `Surface terrain : ${lead.surfaceTerrain} m²`
      : undefined,
    `État : ${ETAT_LABELS[lead.etat]}`,
  ].filter((line): line is string => Boolean(line));

  const provenance = provenanceLine(lead);
  const recu = `Reçu le ${receivedAt()}`;

  const text = [
    "CONTACT",
    ...contactLines,
    "",
    "LE BIEN",
    ...bienLines,
    "",
    "PROVENANCE",
    provenance,
    recu,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  const htmlContact = [
    escapeHtml(`${lead.prenom} ${lead.nom}`),
    `<a href="${escapeHtml(telHref(lead.telephone))}">${escapeHtml(lead.telephone)}</a>`,
    `<a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a>`,
    `Échéance : ${escapeHtml(ECHEANCE_LABELS[lead.echeance])}`,
  ].join("<br>");

  const htmlBien = bienLines.map((line) => escapeHtml(line)).join("<br>");
  const htmlProvenance = [
    provenance ? escapeHtml(provenance) : undefined,
    escapeHtml(recu),
  ]
    .filter((line): line is string => Boolean(line))
    .join("<br>");

  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#111111;max-width:36em;">
<p style="margin:0 0 4px;font-weight:700;">CONTACT</p>
<p style="margin:0 0 20px;">${htmlContact}</p>
<p style="margin:0 0 4px;font-weight:700;">LE BIEN</p>
<p style="margin:0 0 20px;">${htmlBien}</p>
<p style="margin:0 0 4px;font-weight:700;">PROVENANCE</p>
<p style="margin:0;">${htmlProvenance}</p>
</div>`;

  return {
    subject: `Estimation — ${typeLabel} à ${lead.commune} — ${lead.prenom} ${lead.nom}`,
    text,
    html,
  };
}

export async function sendLeadEmail(lead: LeadPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new Error(
      "Configuration e-mail incomplète : RESEND_API_KEY, LEAD_TO_EMAIL ou LEAD_FROM_EMAIL manquante.",
    );
  }

  const resend = new Resend(apiKey);
  const { subject, text, html } = buildLeadEmail(lead);
  const cc = process.env.LEAD_CC_EMAIL?.trim();

  const { error } = await resend.emails.send({
    from,
    to,
    cc: cc || undefined,
    replyTo: lead.email,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
