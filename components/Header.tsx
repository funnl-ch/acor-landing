import Link from "next/link";
import { Logo } from "./Logo";
import { PhoneLink } from "./PhoneLink";

export function Header() {
  return (
    <header className="bg-page">
      <div className="mx-auto flex min-h-[52px] max-w-5xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <Link href="/" aria-label="ACOR Immobilier, retour à l’accueil">
          <Logo priority className="h-8 w-auto sm:h-9" />
        </Link>
        <PhoneLink variant="button" className="shrink-0" />
      </div>
    </header>
  );
}
