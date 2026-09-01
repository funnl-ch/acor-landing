import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
  inverted?: boolean;
};

export function Logo({
  className = "h-12 w-auto",
  priority = false,
  inverted = false,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="ACOR Immobilier"
        width={194}
        height={60}
        className={`h-full w-auto max-h-full ${inverted ? "brightness-0 invert" : ""}`}
        priority={priority}
      />
    </span>
  );
}
