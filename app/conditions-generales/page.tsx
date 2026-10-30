import type { Metadata } from "next";
import { LegalArticle } from "@/components/LegalArticle";
import { AGENCY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conditions générales — ACOR Immobilier",
  robots: { index: false, follow: true },
};

export default function ConditionsGeneralesPage() {
  return (
    <LegalArticle title="Conditions générales">
      <p>
        Les présentes conditions s’appliquent à la demande d’estimation
        immobilière effectuée via ce site, exploité par {AGENCY.name},{" "}
        {AGENCY.street}, {AGENCY.zip} {AGENCY.city}.
      </p>

      <h2>Objet</h2>
      <p>
        Ce site vous permet de demander une estimation de votre bien immobilier
        en décrivant ses principales caractéristiques. La demande est gratuite.
      </p>

      <h2>Sans engagement</h2>
      <p>
        Demander une estimation ne vous oblige ni à vendre votre bien, ni à
        confier un mandat de vente à {AGENCY.name}.
      </p>

      <h2>Prise de contact</h2>
      <p>
        En envoyant le formulaire, vous acceptez d’être recontacté par un
        courtier d’{AGENCY.name} au sujet de votre estimation, par e-mail et, si
        vous l’avez indiqué, par téléphone. Ce contact sert uniquement à traiter
        votre demande. Vous pouvez à tout moment demander à ne plus être
        recontacté en écrivant à{" "}
        <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a> ou en appelant le{" "}
        <a href={AGENCY.phoneHref}>{AGENCY.phoneDisplay}</a>.
      </p>

      <h2>Exactitude des informations</h2>
      <p>
        L’estimation repose sur les informations que vous fournissez. Merci de
        les indiquer de manière exacte et complète.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre{" "}
        <a href="/politique-de-confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit suisse.
      </p>
      <p>Dernière mise à jour : 31 octobre 2026</p>
    </LegalArticle>
  );
}
