import { Fragment } from "react";
import Image from "next/image";
import { nbsp } from "@/lib/typography";
import { HeroVideo } from "./HeroVideo";
import { LeadForm } from "./LeadForm";
import { Logo } from "./Logo";
import { PhoneLink } from "./PhoneLink";

type HeroProps = {
  title: string;
  /** Portion de `title` soulignée à main levée. Doit s'y trouver telle quelle. */
  underlined?: string;
  /** Une entrée par ligne : la coupure du sous-titre est voulue, pas subie. */
  subtitle: string[];
};

/** Trait de stylo statique, tracé derrière le texte. */
function SketchUnderline() {
  return (
    <svg
      className="hero-underline-mark"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 7.4C68 3.6 132 7.4 198 5.6" strokeLinecap="round" />
    </svg>
  );
}

const HERO_IMAGE_SRC = "/hero.jpg";
const HERO_VIDEO_SRC = "/hero.mp4";

export function Hero({ title, underlined, subtitle }: HeroProps) {
  const markAt = underlined ? title.indexOf(underlined) : -1;

  return (
    <section className="hero relative isolate w-full min-h-0 overflow-hidden md:min-h-screen">
      {/* couche 0 : image de repli, puis vidéo par-dessus quand elle est chargée */}
      <div className="absolute inset-0 z-0 bg-[#2a2a2a]" aria-hidden="true">
        <Image
          src={HERO_IMAGE_SRC}
          alt=""
          fill
          priority
          quality={85}
          sizes="(max-width: 1920px) 100vw, 1920px"
          className="object-cover"
        />
        <HeroVideo src={HERO_VIDEO_SRC} poster={HERO_IMAGE_SRC} />
      </div>

      {/* couche 1 : voile sombre, garantit le contraste du texte blanc */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 to-black/55"
        aria-hidden="true"
      />

      {/* couche 2 : contenu */}
      {/* mobile : logo et téléphone côte à côte, ils se chevauchaient */}
      <div className="relative z-[2] flex items-center justify-between px-4 py-2 sm:hidden">
        <Logo inverted priority className="h-7 w-auto" />
        <PhoneLink tone="light" className="hero-phone text-[15px]" />
      </div>

      <div className="absolute right-8 top-5 z-[2] hidden sm:block">
        <PhoneLink tone="light" className="hero-phone text-body" />
      </div>

      <div className="relative z-[2] mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-8 pt-2 text-center sm:px-10 sm:pb-14 sm:pt-16 md:min-h-screen md:justify-center">
        <Logo inverted priority className="hidden h-10 w-auto sm:block" />

        <h1 className="hero-copy mx-auto mt-2 max-w-[18ch] text-balance text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:mt-6 sm:text-[52px]">
          {markAt >= 0 && underlined ? (
            <>
              {nbsp(title.slice(0, markAt))}
              <span className="hero-underline">
                <span className="hero-underline-text">{underlined}</span>
                <SketchUnderline />
              </span>
              {nbsp(title.slice(markAt + underlined.length))}
            </>
          ) : (
            nbsp(title)
          )}
        </h1>
        <p className="hero-copy mx-auto mt-3 max-w-[44ch] text-[17px] font-normal leading-[1.55] text-white/85 sm:mt-6 sm:text-[20px] sm:leading-[1.6]">
          {subtitle.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {nbsp(line)}
            </Fragment>
          ))}
        </p>

        <div className="mt-4 w-full sm:mt-8">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
