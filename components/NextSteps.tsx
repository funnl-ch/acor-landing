const STEPS = [
  "Un appel sous 48 h",
  "Une visite sur place",
  "Un prix écrit, à garder",
] as const;

export function NextSteps() {
  return (
    <section className="bg-page" aria-labelledby="suite-title">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <h2
          id="suite-title"
          className="text-center text-[22px] font-bold tracking-[-0.02em] text-ink sm:text-[26px]"
        >
          Ce qui se passe après votre demande
        </h2>
        <ol className="mt-8 flex flex-col items-center gap-3 text-center text-[17px] font-normal text-muted sm:mt-10 sm:flex-row sm:justify-center sm:gap-0">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center">
              {index > 0 ? (
                <span className="mx-3 hidden text-[#c8c8c8] sm:inline" aria-hidden="true">
                  ·
                </span>
              ) : null}
              {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
