type HeroProps = {
  title: string;
  subtitle: string;
  highlights?: string[];
};

function Emphasize({ text, highlights }: { text: string; highlights?: string[] }) {
  const marks = (highlights ?? []).filter((word) => word && text.includes(word));
  if (marks.length === 0) {
    return <>{text}</>;
  }

  const pattern = new RegExp(`(${marks.map(escapeRegExp).join("|")})`, "g");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) =>
        marks.includes(part) ? (
          <span key={`${part}-${index}`} className="word-accent">
            {part}
          </span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function Hero({ title, subtitle, highlights }: HeroProps) {
  const glue = "en Valais";
  const glueAt = title.indexOf(glue);

  return (
    <section className="bg-page">
      <div className="mx-auto max-w-3xl px-5 pb-4 pt-8 text-center sm:px-10 sm:pb-8 sm:pt-14">
        <h1 className="text-[32px] font-extrabold leading-[1.12] tracking-[-0.04em] text-ink sm:text-[52px] sm:leading-[1.08]">
          {glueAt >= 0 ? (
            <>
              {title.slice(0, glueAt)}
              <span className="whitespace-nowrap">
                en <span className="word-accent">Valais</span>
              </span>
              {title.slice(glueAt + glue.length)}
            </>
          ) : (
            <Emphasize text={title} highlights={highlights} />
          )}
        </h1>
        <p className="mx-auto mt-5 max-w-[34rem] text-[17px] font-normal leading-[1.55] text-[#6b7280] sm:mt-6 sm:text-[20px] sm:leading-[1.6]">
          <Emphasize text={subtitle} highlights={highlights} />
        </p>
      </div>
    </section>
  );
}
