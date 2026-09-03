"use client";

import { useId, useState } from "react";
import { nbsp } from "@/lib/typography";

const QUESTIONS = [
  {
    question: "L’estimation est-elle vraiment gratuite ?",
    answer:
      "Oui. Le déplacement du courtier, le relevé sur place et l’estimation écrite ne vous coûtent rien, et ne vous engagent à rien. ACOR n’est rémunérée que si vous lui confiez la vente et qu’elle aboutit.",
  },
  {
    question: "Combien de temps cela prend-il ?",
    answer:
      "Un courtier vous appelle sous 48 heures ouvrables pour convenir d’un rendez-vous. La visite dure généralement moins d’une heure. Vous recevez l’estimation écrite dans les jours qui suivent.",
  },
  {
    question: "Suis-je obligé de vendre avec ACOR ensuite ?",
    answer:
      "Non. L’estimation vous appartient, vous en faites ce que vous voulez. Aucun mandat n’est demandé lors de la visite, et personne ne vous rappellera pour insister.",
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
