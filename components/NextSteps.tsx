import { AnimatedStats } from "@/components/AnimatedStats";
import { AGENCY } from "@/lib/constants";
import { GOOGLE_RATING } from "@/components/GoogleRating";

const STATS = [
  {
    value: String(AGENCY.soldListings),
    label: "biens vendus",
  },
  {
    value: GOOGLE_RATING.score,
    label: "avis Google",
  },
  {
    value: String(AGENCY.brokers),
    label: "courtiers",
  },
  {
    value: String(AGENCY.agencies),
    label: "agences",
  },
] as const;

const POINTS = [
  {
    title: "En ligne, en quelques minutes",
    text: "Vous décrivez le bien : type, commune, surface, état. Nous préparons ensuite l’estimation, en seulement quelques minutes.",
  },
  {
    title: "Un accompagnement personnalisé",
    text: "Un courtier ACOR vous recontacte pour vendre votre bien immobilier au meilleur prix, avec un suivi adapté à votre situation.",
  },
  {
    title: "Sans engagement",
    text: "La demande est gratuite. Demander une estimation n’oblige pas à vendre avec nous.",
  },
] as const;

export function NextSteps() {
  return (
    <section className="bg-page" aria-labelledby="suite-title">
      <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-8 sm:py-20">
        <h2
          id="suite-title"
          className="max-w-[22ch] text-[26px] font-extrabold leading-[1.15] tracking-[-0.035em] text-ink sm:text-[32px]"
        >
          Processus rapide et sans engagement.
        </h2>
        <p className="mt-5 max-w-[68ch] text-justify text-[17px] leading-[1.55] text-muted hyphens-auto">
          Estimez votre bien en ligne en seulement quelques minutes et profitez
          d’un accompagnement personnalisé pour vendre votre bien immobilier au
          meilleur prix.
        </p>

        <AnimatedStats stats={STATS} />

        <ul className="mt-12 max-w-[68ch] space-y-8">
          {POINTS.map((point) => (
            <li key={point.title}>
              <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-[20px]">
                {point.title}
              </h3>
              <p className="mt-2 text-justify text-[17px] font-normal leading-[1.55] text-muted hyphens-auto">
                {point.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
