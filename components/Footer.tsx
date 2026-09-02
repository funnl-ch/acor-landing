import Link from "next/link";
import { AGENCY } from "@/lib/constants";
import { Logo } from "./Logo";
import { PhoneLink } from "./PhoneLink";

export function Footer() {
  return (
    <footer className="mt-3 overflow-hidden rounded-t-[12px] bg-[#3f3f3e] text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <a href={AGENCY.website} aria-label="ACOR Immobilier, site officiel">
          <Logo inverted className="h-10 w-auto" />
        </a>
        <address className="mt-7 not-italic text-body">
          <p className="font-medium">{AGENCY.name}</p>
          <p className="mt-1 text-white/60">
            {AGENCY.street}, {AGENCY.zip} {AGENCY.city}
          </p>
          <p className="mt-4">
            <PhoneLink tone="light" />
          </p>
          <p className="mt-1">
            <a
              href={`mailto:${AGENCY.email}`}
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {AGENCY.email}
            </a>
          </p>
        </address>
        <nav
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[17px] text-white/55"
          aria-label="Mentions"
        >
          <Link href="/mentions-legales" className="underline-offset-4 hover:text-white hover:underline">
            Mentions légales
          </Link>
          <Link
            href="/politique-de-confidentialite"
            className="underline-offset-4 hover:text-white hover:underline"
          >
            Politique de confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
