"use client";

import { useEffect, useState } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type HeroVideoProps = {
  src: string;
  poster: string;
};

/**
 * Fond décoratif. Monté côté client uniquement : le formulaire se rend sans
 * attendre la vidéo. En reduced-motion rien n'est chargé, l'image de repli
 * placée sous cette couche suffit alors.
 */
export function HeroVideo({ src, poster }: HeroVideoProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION);
    const sync = () => setEnabled(!reduced.matches);

    sync();
    reduced.addEventListener("change", sync);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  if (!enabled) return null;

  return (
    <video
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
