"use client";

import { useId, useState } from "react";
import { nbsp } from "@/lib/typography";

const QUESTIONS = [
  {
    question: "Est-ce sans engagement ?",
    answer:
      "Oui. Le processus est rapide et sans engagement. Demander une estimation ne vous oblige pas à vendre avec nous.",
  },
  {
    question: "Combien de temps cela prend-il ?",
    answer:
      "La demande se fait en quelques minutes. Un courtier vous recontacte ensuite pour l’accompagnement personnalisé.",
  },
  {
    question: "Qui s’occupe de l’estimation ?",
    answer:
      "Nos courtiers, dont des experts en estimation immobilière au brevet fédéral. Ils vous accompagnent pour vendre au meilleur prix.",
  },
] as const;

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className="bg-page" aria-labelledby="faq-title">
      <div className="mx-auto max-w-[900px] px-5 py-24 sm:px-8">
        <h2 id="faq-title" className="text-[22px] font-bold leading-snug text-ink">
          Questions fréquentes
        </h2>
        <ul className="mt-10">
          {QUESTIONS.map((item, index) => {
            const open = openIndex === index;
            const buttonId = `${baseId}-question-${index}`;
            const panelId = `${baseId}-answer-${index}`;

            return (
              <li key={item.question} className="faq-item" data-open={open}>
                <button
                  type="button"
                  id={buttonId}
                  className="faq-question"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                    <span className="text-balance">{nbsp(item.question)}</span>
                  <Chevron />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-panel"
                  data-open={open}
                >
                  <div>
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg
      className="faq-chevron"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
