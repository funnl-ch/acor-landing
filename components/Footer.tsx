"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AGENCY, FUNNL } from "@/lib/constants";
import { scrollToLeadForm } from "@/lib/scroll-to-form";
import { Logo } from "./Logo";
import { PhoneIcon } from "./PhoneLink";

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
] as const;

export function Footer() {
  // le formulaire d'estimation n'existe que sur la landing
  const hasLeadForm = usePathname() === "/";

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            {hasLeadForm ? (
              <button
                type="button"
                className="flex w-fit"
                onClick={scrollToLeadForm}
                aria-label="Aller au formulaire d’estimation"
              >
                <Logo className="h-10 w-auto" />
              </button>
            ) : (
              <Logo className="h-10 w-auto" />
            )}
            <address className="mt-8 not-italic">
              <p className="text-[17px] font-medium text-brand">{AGENCY.name}</p>
              <p className="muted-canvas mt-1 text-[17px] font-normal">
                {AGENCY.street}, {AGENCY.zip} {AGENCY.city}
              </p>
            </address>
          </div>

          <div className="flex flex-col items-start">
            <a href={AGENCY.phoneHref} className="footer-contact">
              <PhoneIcon className="h-5 w-5 shrink-0" />
              <span>{AGENCY.phoneDisplay}</span>
            </a>
            <a href={`mailto:${AGENCY.email}`} className="footer-contact">
              <MailIcon />
              <span>{AGENCY.email}</span>
            </a>
          </div>
        </div>

        <nav
          className="muted-canvas mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#e2e2e2] pt-6 text-[15px] sm:gap-x-3"
          aria-label="Mentions"
        >
          {LEGAL_LINKS.map((item) => (
            <Fragment key={item.href}>
              <Link
                href={item.href}
                className="whitespace-nowrap underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
              {/* le point médian tomberait en fin de ligne quand la liste passe sur deux lignes */}
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
            </Fragment>
          ))}
          <span className="whitespace-nowrap">Créé par {FUNNL.name}</span>
        </nav>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 7 8.2 5.6L20.2 7" />
    </svg>
  );
}
