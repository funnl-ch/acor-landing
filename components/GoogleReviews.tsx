"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { GoogleRating } from "@/components/GoogleRating";

// Versions abrégées des avis Google : le texte doit tenir en entier dans la
// carte, une citation coupée en plein milieu d'une phrase ne rassure personne.
const REVIEWS = [
  {
    name: "Janny C.",
    ago: "il y a 11 mois",
    quote:
      "Ricardo a pris en charge la vente de mon appartement, après 2 autres courtiers qui n’y arrivaient pas. Vendu au-dessus de mes espérances.",
  },
  {
    name: "Reis H.",
    ago: "il y a 9 mois",
    quote:
      "Très sérieux, doté d’une excellente communication et particulièrement efficace dans la vente de notre appartement.",
  },
  {
    name: "Lionel C.",
    ago: "il y a un an",
    quote:
      "Un grand merci pour votre professionnalisme, votre écoute et votre gentillesse. Une agence que nous recommandons.",
  },
  {
    name: "Bertrand B.",
    ago: "il y a 9 mois",
    quote:
      "Un grand merci à Florian Bureau pour son professionnalisme. Vous pouvez lui faire totale confiance.",
  },
  {
    name: "Urs R.",
    ago: "il y a 8 mois",
    quote:
      "Un agent immobilier compétent, efficace et très sympathique. Tout s’est déroulé parfaitement. À recommander sans réserve.",
  },
] as const;

const LOOP_COPIES = 3;
const LOOPED_REVIEWS = Array.from({ length: LOOP_COPIES }, (_, copy) =>
  REVIEWS.map((item) => ({ ...item, copy })),
).flat();

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setWidth(scroller: HTMLElement) {
  const cards = scroller.querySelectorAll<HTMLElement>(".reviews-card");
  if (cards.length < REVIEWS.length * 2) return 0;
  return cards[REVIEWS.length].offsetLeft - cards[0].offsetLeft;
}

export function GoogleReviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const jumpingRef = useRef(false);
  const touchingRef = useRef(false);
  const autoplayingRef = useRef(false);
  const loopWidthRef = useRef(0);

  const jump = useCallback((el: HTMLElement, left: number) => {
    jumpingRef.current = true;
    if (!autoplayingRef.current) el.style.scrollSnapType = "none";
    el.scrollLeft = left;
    if (!autoplayingRef.current) el.style.scrollSnapType = "";
    jumpingRef.current = false;
  }, []);

  const keepLoop = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || jumpingRef.current) return;
    const width = setWidth(el);
    if (!width) return;
    loopWidthRef.current = width;

    if (el.scrollLeft < width) {
      jump(el, el.scrollLeft + width);
    } else if (el.scrollLeft >= width * 2) {
      jump(el, el.scrollLeft - width);
    }
  }, [jump]);

  const goToMiddle = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = setWidth(el);
    if (!width) return;
    loopWidthRef.current = width;
    jump(el, width + (el.scrollLeft % width));
  }, [jump]);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    goToMiddle();
    el.addEventListener("scroll", keepLoop, { passive: true });
    window.addEventListener("resize", goToMiddle);

    const observer = new ResizeObserver(() => {
      const next = setWidth(el);
      if (!next || next === loopWidthRef.current) return;
      goToMiddle();
    });
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", keepLoop);
      window.removeEventListener("resize", goToMiddle);
      observer.disconnect();
    };
  }, [goToMiddle, keepLoop]);

  useEffect(() => {
    const el = scrollerRef.current;
    const section = sectionRef.current;
    if (!el || !section || prefersReducedMotion()) return;

    const PX_PER_MS = 0.035;
    const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let last = performance.now();
    let hovering = false;

    const setSnapOff = () => {
      autoplayingRef.current = true;
      el.classList.add("is-autoplaying");
    };

    const onPointerEnter = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "mouse") hovering = true;
    };
    const onPointerLeave = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "mouse") hovering = false;
      touchingRef.current = false;
    };
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "mouse") return;
      touchingRef.current = true;
    };
    const onPointerUp = () => {
      touchingRef.current = false;
    };

    section.addEventListener("pointerenter", onPointerEnter);
    section.addEventListener("pointerleave", onPointerLeave);
    section.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    const tick = () => {
      const now = performance.now();
      const hovered = hovering || (hoverPointer.matches && section.matches(":hover"));
      const paused =
        hovered || touchingRef.current || document.visibilityState === "hidden";
      const delta = Math.min(now - last, 48);
      last = now;

      if (!paused) el.scrollLeft += PX_PER_MS * delta;
    };

    setSnapOff();
    const timer = window.setInterval(tick, 16);

    return () => {
      window.clearInterval(timer);
      autoplayingRef.current = false;
      el.classList.remove("is-autoplaying");
      section.removeEventListener("pointerenter", onPointerEnter);
      section.removeEventListener("pointerleave", onPointerLeave);
      section.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const amount = card ? card.getBoundingClientRect().width + 16 : 316;
    el.scrollBy({
      left: direction * amount,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  return (
    <section ref={sectionRef} className="bg-page" aria-label="Avis Google">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-5 pt-8 sm:px-8 md:justify-between">
        <GoogleRating className="mt-0" />
        <div className="hidden items-center md:flex">
          <button
            type="button"
            className="reviews-arrow"
            aria-label="Avis précédents"
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="reviews-arrow ml-1"
            aria-label="Avis suivants"
            onClick={() => scrollByCard(1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        className="reviews-scroller mt-6 md:mt-4"
        aria-label="Avis de clients"
      >
        {LOOPED_REVIEWS.map((item) => (
          <li
            key={`${item.copy}-${item.name}`}
            className="reviews-card"
            aria-hidden={item.copy !== 1}
          >
            <img
              src="/google-g.svg"
              alt=""
              width={16}
              height={16}
              className="reviews-google-g"
              decoding="async"
            />
            <span className="reviews-avatar" aria-hidden="true">
              {item.name.charAt(0)}
            </span>
            <p className="mt-3 text-[17px] font-medium leading-none text-ink">
              {item.name}
            </p>
            <p className="reviews-ago">{item.ago}</p>
            <p
              className="mt-2 text-[14px] leading-none tracking-tight text-[#FBBC04]"
              aria-hidden="true"
            >
              ★★★★★
            </p>
            <p className="reviews-quote mt-3">« {item.quote} »</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M11.25 4.5 6.75 9l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M6.75 4.5 11.25 9l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
