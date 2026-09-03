"use client";

import { AGENCY } from "@/lib/constants";
import { scrollToLeadForm } from "@/lib/scroll-to-form";

export function FinalCta() {
  return (
    <section className="bg-page" aria-labelledby="cta-title">
      <div className="px-5 pb-20 sm:px-8">
        <div className="cta-brand mx-auto max-w-[900px] rounded-[24px] bg-brand px-6 py-10 text-center sm:px-12 sm:py-16">
          <div className="mx-auto max-w-xl">
            <h2
              id="cta-title"
              className="mx-auto max-w-[20ch] text-balance text-[24px] font-extrabold leading-[1.15] tracking-[-0.035em] text-white sm:text-[32px]"
            >
              Demander une estimation n’engage à rien.
            </h2>
            <p className="mt-4 text-[17px] font-normal text-white">
              Deux minutes, six questions, et un courtier vous rappelle.
            </p>
            <p className="mt-6">
              <button
                type="button"
                className="btn-invert w-full sm:w-auto"
                onClick={scrollToLeadForm}
              >
                Demander mon estimation
              </button>
            </p>
            <p className="mt-5 text-[17px] font-normal text-white/80">
              Ou appelez directement le{" "}
              <a
                href={AGENCY.phoneHref}
                className="whitespace-nowrap text-white underline underline-offset-4"
              >
                {AGENCY.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
