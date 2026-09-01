"use client";

import { scrollToLeadForm } from "@/lib/scroll-to-form";

export function FinalCta() {
  return (
    <section className="bg-page">
      <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8 sm:py-24">
        <p className="text-[24px] font-extrabold leading-[1.15] tracking-[-0.035em] text-ink sm:text-[32px]">
          Un courtier <span className="word-accent">ACOR</span> se déplace et vous
          remet une <span className="word-accent">estimation écrite</span>,
          gratuite et sans engagement.
        </p>
        <p className="mt-6">
          <button type="button" className="btn-next w-full sm:w-auto" onClick={scrollToLeadForm}>
            Demander mon estimation
          </button>
        </p>
      </div>
    </section>
  );
}
