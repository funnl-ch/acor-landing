const STEPS = [
  {
    title: "Un appel, sous 48 heures",
    text: "Un courtier vous appelle pour comprendre votre bien et votre situation. Dix minutes, pas plus.",
  },
  {
    title: "Une visite, quand ça vous arrange",
    text: "Il se déplace, mesure, photographie, et relève ce qu’aucun simulateur ne voit : l’étage, la vue, l’état réel, le terrain.",
  },
  {
    title: "Un prix écrit, à garder",
    text: "Vous recevez l’estimation par écrit, avec les comparables qui la justifient. Ce que vous en faites ne regarde que vous.",
  },
] as const;

export function NextSteps() {
  return (
    <section className="bg-page" aria-labelledby="suite-title">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <h2
          id="suite-title"
          className="text-left text-[20px] font-bold leading-snug text-ink"
        >
          Ce qui se passe après votre demande
        </h2>
        <ol className="mt-10 grid items-stretch gap-4 sm:grid-cols-3 sm:gap-5">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-[12px] border-[0.5px] border-[#ececec] bg-page p-6"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[15px] font-medium text-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-[17px] font-semibold leading-snug text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[17px] font-normal leading-[1.5] text-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
