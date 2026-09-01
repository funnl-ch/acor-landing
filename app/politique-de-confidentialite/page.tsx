import type { Metadata } from "next";
import { LegalArticle } from "@/components/LegalArticle";
import { AGENCY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Politique de confidentialité — ACOR Immobilier",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalArticle title="Politique de confidentialité">
      <p>
        ACOR Immobilier Sàrl attache de l’importance à la protection de vos
        données personnelles. Cette page explique quelles données sont collectées
        sur ce site, pourquoi, et quels sont vos droits.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        {AGENCY.name}
        <br />
        {AGENCY.street}, {AGENCY.zip} {AGENCY.city}, Suisse
        <br />
        <a href={AGENCY.phoneHref}>{AGENCY.phoneDisplay}</a>
        {" · "}
        <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
        <br />
        [PLACEHOLDER — numéro CHE]
      </p>

      <h2>Données collectées</h2>
      <p>
        Lorsque vous remplissez le formulaire d’estimation, nous collectons : le
        type de bien, la commune, la surface et le nombre de pièces, l’état du
        bien, votre échéance de vente, l’adresse du bien, ainsi que votre nom,
        prénom, adresse e-mail et numéro de téléphone.
      </p>
      <p>
        Lors de votre visite, sont également enregistrés de manière automatique :
        votre adresse IP, le type et la version de votre navigateur, la page
        depuis laquelle vous êtes arrivé et les paramètres de la campagne
        publicitaire ayant mené à ce site.
      </p>

      <h2>Finalité du traitement</h2>
      <p>
        Ces données servent exclusivement à traiter votre demande d’estimation et
        à vous recontacter. Elles ne sont ni vendues, ni louées, ni transmises à
        d’autres agences immobilières. Vous n’êtes inscrit à aucune newsletter.
      </p>

      <h2>Base légale</h2>
      <p>
        Le traitement repose sur le consentement que vous donnez en envoyant le
        formulaire, ainsi que sur les démarches précontractuelles liées à votre
        demande, conformément à la loi fédérale sur la protection des données.
      </p>

      <h2>Destinataires</h2>
      <p>
        Vos données sont accessibles aux collaborateurs d’ACOR Immobilier Sàrl
        chargés de traiter votre demande. Elles transitent par nos prestataires
        techniques, mandatés pour l’hébergement du site et l’acheminement des
        e-mails, qui agissent sur nos instructions et sont tenus à la
        confidentialité.
      </p>

      <h2>Mesure publicitaire</h2>
      <p>
        Ce site utilise le pixel de mesure d’OpenAI, qui nous permet de savoir
        quelles annonces diffusées dans ChatGPT amènent des demandes
        d’estimation. Ce service enregistre votre visite et, le cas échéant,
        l’envoi du formulaire. Il est exploité par OpenAI, dont les serveurs se
        situent aux États-Unis : vos données de navigation peuvent donc être
        transférées hors de Suisse, vers un pays dont la législation en matière
        de protection des données diffère du droit suisse. Vous pouvez limiter
        cette collecte en utilisant un bloqueur de traceurs ou les réglages de
        confidentialité de votre navigateur.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Vos données sont conservées [PLACEHOLDER — durée, par exemple 24 mois] à
        compter de votre demande, puis supprimées. Si vous nous confiez un
        mandat, elles sont conservées pendant la durée du mandat et les délais
        légaux de conservation applicables.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les données transmises via ce site sont chiffrées lors de leur transfert.
        Nous prenons les mesures techniques et organisationnelles raisonnables
        pour les protéger contre tout accès non autorisé, perte ou altération.
        Aucune transmission par internet ne peut toutefois être garantie
        totalement sûre.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez à tout moment demander l’accès à vos données, leur
        rectification ou leur suppression, vous opposer à leur traitement et
        retirer votre consentement. Écrivez à{" "}
        <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a> ou appelez le{" "}
        <a href={AGENCY.phoneHref}>{AGENCY.phoneDisplay}</a>. Vous disposez
        également d’un droit de recours auprès du Préposé fédéral à la protection
        des données et à la transparence.
      </p>

      <h2>Hébergement</h2>
      <p>[PLACEHOLDER — nom et pays de l’hébergeur]</p>

      <h2>Modifications</h2>
      <p>
        Cette politique peut être adaptée. La version en vigueur est celle
        publiée sur cette page.
      </p>
      <p>Dernière mise à jour : [PLACEHOLDER — date]</p>
    </LegalArticle>
  );
}
