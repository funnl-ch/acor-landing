import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { GoogleReviews } from "@/components/GoogleReviews";
import { Hero } from "@/components/Hero";
import { NextSteps } from "@/components/NextSteps";

export default function HomePage() {
  return (
    <main id="contenu">
      <Hero
        title="Bien vendre commence par connaître le bon prix."
        underlined="le bon prix"
        subtitle={[
          "Un courtier ACOR vient l’établir chez vous.",
          "Gratuitement, sans engagement.",
        ]}
      />
      <NextSteps />
      <GoogleReviews />
      <Faq />
      <FinalCta />
    </main>
  );
}
