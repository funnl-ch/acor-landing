"use client";

import { AGENCY } from "@/lib/constants";
import { scrollToLeadForm } from "@/lib/scroll-to-form";

export function FinalCta() {
  return (
    <section className="bg-page" aria-labelledby="cta-title">
      <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-8 sm:py-24">
        <h2
          id="cta-title"
          className="text-[24px] font-extrabold leading-[1.15] tracking-[-0.035em] text-ink sm:text-[32px]"
        >
          Vous n’êtes pas obligé de vendre pour savoir combien.
        </h2>
        <p className="mt-4 text-[17px] font-normal text-muted">
          Deux minutes, six questions, et un courtier vous rappelle.
        </p>
        <p className="mt-6">
          <button type="button" className="btn-next w-full sm:w-auto" onClick={scrollToLeadForm}>
            Demander mon estimation
          </button>
        </p>
        <p className="mt-5 text-[17px] font-normal text-muted">
          Ou appelez directement le{" "}
          <a href={AGENCY.phoneHref} className="underline underline-offset-4">
            {AGENCY.phoneDisplay}
          </a>
        </p>
      </div>
    </section>
  );
}
