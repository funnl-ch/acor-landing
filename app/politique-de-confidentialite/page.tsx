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
        {AGENCY.che}
      </p>

      <h2>Données collectées</h2>
      <p>
        Lorsque vous remplissez le formulaire d’estimation, nous collectons : le
        type de bien, la commune, la surface et le nombre de pièces, l’état du
        bien, votre échéance de vente, l’adresse du bien, ainsi que votre nom,
        prénom, numéro de téléphone et, si vous la donnez, adresse e-mail.
      </p>
      <p>
        Lors de votre visite, sont également enregistrés de manière automatique :
        votre adresse IP, le type et la version de votre navigateur, la page
        depuis laquelle vous êtes arrivé et les paramètres de la campagne
        publicitaire ayant mené à ce site.
      </p>

      <h2>Finalité du traitement</h2>
      <p>
        Les données du formulaire servent à traiter votre demande d’estimation
        et à vous recontacter. Elles ne sont ni vendues, ni louées, ni
        transmises à d’autres agences immobilières. Vous n’êtes inscrit à aucune
        newsletter.
      </p>
      <p>
        Si vous l’acceptez, les données de navigation servent aussi à mesurer
        quelles annonces diffusées dans ChatGPT amènent une demande, et à
        comprendre comment le site est utilisé afin de l’améliorer.
      </p>

      <h2>Base légale</h2>
      <p>
        Le traitement des données du formulaire repose sur le consentement que
        vous donnez en l’envoyant, ainsi que sur les démarches précontractuelles
        liées à votre demande, conformément à la loi fédérale sur la protection
        des données. La mesure publicitaire et la mesure d’audience reposent
        sur le consentement recueilli dans le bandeau cookies.
      </p>

      <h2>Destinataires</h2>
      <p>
        Vos données sont accessibles aux collaborateurs d’ACOR Immobilier Sàrl
        chargés de traiter votre demande. Elles transitent par nos prestataires
        techniques, mandatés pour l’hébergement du site et l’acheminement des
        e-mails, qui agissent sur nos instructions et sont tenus à la
        confidentialité.
      </p>
      <p>
        Si vous acceptez les cookies de mesure, OpenAI et Microsoft reçoivent
        les données de navigation décrites ci-dessous.
      </p>

      <h2>Mesure publicitaire</h2>
      <p>
        Avec votre accord, ce site utilise le pixel de mesure d’OpenAI, qui nous
        permet de savoir quelles annonces diffusées dans ChatGPT amènent des
        demandes d’estimation. Ce service dépose un cookie sur votre appareil,
        enregistre votre visite et, si vous envoyez le formulaire, des
        identifiants hachés : numéro de téléphone, nom, prénom et, si vous
        l’avez indiquée, adresse e-mail. Le hachage empêche de lire ces identifiants en clair. Il est
        exploité par OpenAI, dont les serveurs se situent aux États-Unis : vos
        données de navigation peuvent donc être transférées hors de Suisse,
        vers un pays dont la législation en matière de protection des données
        diffère du droit suisse.
      </p>
      <p>
        Avec le même accord, ce site utilise Microsoft Clarity, qui enregistre
        des sessions de navigation (pages vues, clics, défilement) afin
        d’améliorer le site. Le service est exploité par Microsoft, dont les
        serveurs se situent hors de Suisse.
      </p>
      <p>
        Vous pouvez refuser ces cookies dès votre arrivée, ou modifier votre
        choix plus tard via le lien Cookies en bas de page. Sans accord, le
        pixel OpenAI et Clarity ne sont pas chargés.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données du formulaire, soit votre identité et les caractéristiques
        du bien, sont conservées 24 mois à compter de votre demande, puis
        supprimées. Si vous nous confiez un mandat, elles sont conservées
        pendant la durée du mandat et les délais légaux de conservation
        applicables.
      </p>
      <p>
        Nous ne conservons pas, de notre côté, un fichier séparé de vos visites.
        Les données de mesure envoyées à OpenAI et à Microsoft sont traitées par
        ces prestataires selon leurs propres durées.
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
      <p>
        Ce site est hébergé par Vercel Inc., société établie aux États-Unis. Les
        données transmises via le formulaire transitent par cette infrastructure.
        L’acheminement des e-mails est assuré par Resend, également établie aux
        États-Unis.
      </p>

      <h2>Modifications</h2>
      <p>
        Cette politique peut être adaptée. La version en vigueur est celle
        publiée sur cette page.
      </p>
      <p>Dernière mise à jour : 15 octobre 2026</p>
    </LegalArticle>
  );
}
