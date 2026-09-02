export const AGENCY = {
  name: "ACOR Immobilier Sàrl",
  street: "Avenue Ritz 17",
  zip: "1950",
  city: "Sion",
  canton: "Valais",
  phoneDisplay: "027 322 10 25",
  phoneHref: "tel:+41273221025",
  email: "info@acor-immo.ch",
  website: "https://www.acor-immo.ch/fr",
  che: "CH-626.4.014.358-2",
} as const;

export const FUNNL = {
  name: "funnl.ch",
  website: "https://funnl.ch",
} as const;

export const PROPERTY_TYPES = [
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "terrain", label: "Terrain" },
  { value: "immeuble", label: "Immeuble" },
  { value: "local", label: "Local commercial" },
] as const;

export const CONDITIONS = [
  { value: "neuf", label: "Neuf ou récent" },
  { value: "renove", label: "Rénové récemment" },
  { value: "bon", label: "Bon état" },
  { value: "rafraichir", label: "À rafraîchir" },
  { value: "renover", label: "À rénover entièrement" },
] as const;

export const TIMELINES = [
  { value: "asap", label: "Dès que possible" },
  { value: "6mois", label: "Dans les 6 mois" },
  { value: "1an", label: "D’ici un an" },
  { value: "renseigne", label: "Je me renseigne, sans échéance" },
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];
export type Condition = (typeof CONDITIONS)[number]["value"];
export type Timeline = (typeof TIMELINES)[number]["value"];

export function showsLandArea(type: PropertyType | ""): boolean {
  return type === "maison" || type === "terrain" || type === "immeuble";
}
