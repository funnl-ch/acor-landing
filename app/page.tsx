import { FinalCta } from "@/components/FinalCta";
import { GoogleReviews } from "@/components/GoogleReviews";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LeadForm } from "@/components/LeadForm";
import { NextSteps } from "@/components/NextSteps";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="contenu">
        <Hero
          title="Combien vaut votre bien en Valais ?"
          highlights={["Valais"]}
          subtitle="Le prix dépend de la commune, de l’état et du moment où vous vendez."
        />
        <LeadForm />
        <GoogleReviews />
        <NextSteps />
        <FinalCta />
      </main>
    </>
  );
}
