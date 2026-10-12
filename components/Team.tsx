"use client";

import Image from "next/image";
import { AGENCY } from "@/lib/constants";
import { trackCustomEvent } from "@/lib/oai";
import { scrollToLeadForm } from "@/lib/scroll-to-form";

export function Team() {
  return (
    <section className="bg-page" aria-labelledby="equipe-title">
      <div className="mx-auto max-w-[1080px] px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-[720px] rounded-[12px] border-[0.5px] border-[#ececec] bg-page">
          <div className="relative aspect-[5/2] overflow-hidden rounded-t-[12px] bg-[#6a6a6a]">
            <Image
              src="/equipe.jpg"
              alt="L’équipe d’ACOR Immobilier, courtiers à Sion"
              fill
              sizes="(max-width: 720px) 100vw, 720px"
              quality={90}
              className="object-cover object-center"
            />
          </div>

          <div className="px-6 py-7 text-center sm:px-8 sm:py-8">
            <h2
              id="equipe-title"
              className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.035em] text-ink sm:text-[32px]"
            >
              Notre équipe
            </h2>
            <p className="mt-4 text-[17px] leading-[1.55] text-muted">
              {AGENCY.brokers} courtiers, dont des experts en estimation
              immobilière au brevet fédéral. Agences à{" "}
              {AGENCY.agencyCities.slice(0, 3).join(", ")} et{" "}
              {AGENCY.agencyCities[3]}.
            </p>
            <p className="mt-5 text-[17px] leading-snug text-muted">
              {AGENCY.street}, {AGENCY.zip} {AGENCY.city}
              <span className="mx-2 text-line" aria-hidden="true">
                ·
              </span>
              <a
                href={AGENCY.phoneHref}
                onClick={() => trackCustomEvent("phone_click")}
                className="whitespace-nowrap text-ink underline underline-offset-4"
              >
                {AGENCY.phoneDisplay}
              </a>
            </p>
            <button
              type="button"
              className="btn-submit mx-auto mt-7 sm:w-auto"
              onClick={scrollToLeadForm}
            >
              Recevoir mon estimation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
