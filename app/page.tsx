import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { GoogleReviews } from "@/components/GoogleReviews";
import { Hero } from "@/components/Hero";
import { NextSteps } from "@/components/NextSteps";
import { Team } from "@/components/Team";

export default function HomePage() {
  return (
    <main id="contenu">
      <Hero
        title="Bien vendre commence par connaître le bon prix."
        underlined="le bon prix"
        subtitle={[
          "Décrivez votre bien en quelques minutes.",
          "Estimation transmise sous 48 heures ouvrables, sans engagement.",
        ]}
      />
      <NextSteps />
      <Team />
      <GoogleReviews />
      <Faq />
      <FinalCta />
    </main>
  );
}
