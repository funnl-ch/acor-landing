const STEPS = [
  {
    title: "Une demande, en quelques minutes",
    text: "Vous décrivez votre bien : type, commune, surfaces, état. Quelques minutes suffisent.",
  },
  {
    title: "Un accompagnement personnalisé",
    text: "Un courtier vous accompagne ensuite pour vendre votre bien au meilleur prix.",
  },
  {
    title: "Sans engagement",
    text: "Le processus est rapide et ne vous engage à rien. Demander une estimation n’oblige pas à vendre.",
  },
] as const;

export function NextSteps() {
  return (
    <section className="bg-page" aria-labelledby="suite-title">
      <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-24">
        <h2
          id="suite-title"
          className="text-[20px] font-bold leading-snug text-ink sm:text-[22px]"
        >
          Ce qui se passe après votre demande
        </h2>
        <ol className="mt-8">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-[#ececec] py-6 sm:gap-x-5 sm:py-7 [&:not(:last-child)]:border-b"
            >
              <span
                className="pt-[3px] text-[15px] font-medium tabular-nums leading-none text-muted"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-[20px]">
                {step.title}
              </h3>
              <p className="col-start-2 text-[17px] font-normal leading-[1.5] text-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
