import { AGENCY } from "@/lib/constants";

type PhoneLinkProps = {
  className?: string;
  showNumber?: boolean;
  tone?: "dark" | "light";
  variant?: "text" | "button";
};

export function PhoneIcon({ className = "h-5 w-5 shrink-0" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M6.8 3.8h3.2l1.4 3.6-2.2 1.4a11 11 0 0 0 5.8 5.8l1.4-2.2 3.6 1.4v3.3c0 .9-.8 1.9-1.8 1.9C8.8 19 4 14.2 4 5.6c0-1 .9-1.8 1.8-1.8Z" />
    </svg>
  );
}

export function PhoneLink({
  className = "",
  showNumber = true,
  tone = "dark",
  variant = "text",
}: PhoneLinkProps) {
  const light = tone === "light";
  const button = variant === "button";

  return (
    <a
      href={AGENCY.phoneHref}
      className={
        button
          ? `btn-header-phone ${className}`
          : `inline-flex min-h-btn items-center gap-2 whitespace-nowrap font-medium underline-offset-4 hover:underline ${
              light ? "text-white" : "text-brand"
            } ${className}`
      }
    >
      <PhoneIcon className={button ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0"} />
      {showNumber ? (
        <span>{AGENCY.phoneDisplay}</span>
      ) : (
        <span className="sr-only">{AGENCY.phoneDisplay}</span>
      )}
    </a>
  );
}
