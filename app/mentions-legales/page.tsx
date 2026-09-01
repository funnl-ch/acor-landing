import type { Metadata } from "next";
import { LegalArticle } from "@/components/LegalArticle";
import { AGENCY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mentions légales | ACOR Immobilier",
  description: `Mentions légales de ${AGENCY.name}.`,
};

export default function MentionsLegalesPage() {
  return (
    <LegalArticle title="Mentions légales">
      <p>
        {AGENCY.name}
        <br />
        {AGENCY.street}, {AGENCY.zip} {AGENCY.city}, Suisse
        <br />
        <a href={AGENCY.phoneHref}>{AGENCY.phoneDisplay}</a>
        {" · "}
        <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
        <br />
        [PLACEHOLDER — numéro CHE au registre du commerce]
      </p>
      <p>
        Rien de ce qui figure sur le site ne doit être interprété comme un droit
        d’utilisation d’une image, d’une marque, d’une marque de service ou d’un
        logo. Le téléchargement, la copie ou l’impression de pages et/ou de
        parties du site ne sont autorisés qu’à des fins d’utilisation
        strictement personnelles. Le franc suisse est la monnaie de référence
        mais aucun prix n’a valeur contractuelle.
      </p>
    </LegalArticle>
  );
}
