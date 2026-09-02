import { AGENCY } from "@/lib/constants";
import { Logo } from "./Logo";
import { PhoneLink } from "./PhoneLink";

export function Header() {
  return (
    <header className="bg-page">
      <div className="mx-auto flex min-h-[52px] max-w-5xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <a href={AGENCY.website} aria-label="ACOR Immobilier, site officiel">
          <Logo priority className="h-8 w-auto sm:h-9" />
        </a>
        <PhoneLink variant="button" className="shrink-0" />
      </div>
    </header>
  );
}
