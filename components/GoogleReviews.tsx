"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

const REVIEWS = [
  {
    name: "Janny C.",
    quote:
      "Ricardo a pris en charge la vente de mon appartement, après 2 autres courtiers qui n’arrivaient pas à le vendre. Il l’a vendu à un prix qui dépassait mes espérances.",
  },
  {
    name: "Reis H.",
    quote:
      "Je remercie Monsieur Ricardo Monteiro pour notre collaboration dans la vente de notre appartement. Très sérieux, doté d’une excellente communication et particulièrement efficace.",
  },
  {
    name: "Lionel C.",
    quote:
      "Un grand merci pour votre professionnalisme, votre écoute et votre gentillesse. Une agence tip top que nous ne pouvons que recommander.",
  },
  {
    name: "Bertrand B.",
    quote:
      "Un grand merci à Florian Bureau pour son professionnalisme, sa sympathie et sa bonne humeur. Vous pouvez lui faire totale confiance.",
  },
  {
    name: "Urs R.",
    quote:
      "J’ai rencontré un agent immobilier compétent, efficace et en plus très sympathique. Tout s’est déroulé parfaitement. À recommander sans réserve.",
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

function jumpScroll(scroller: HTMLElement, left: number) {
  scroller.style.scrollSnapType = "none";
  scroller.scrollLeft = left;
  scroller.style.scrollSnapType = "";
}

export function GoogleReviews() {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const jumpingRef = useRef(false);

  const keepLoop = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || jumpingRef.current) return;
    const width = setWidth(el);
    if (!width) return;

    if (el.scrollLeft < width) {
      jumpingRef.current = true;
      jumpScroll(el, el.scrollLeft + width);
      jumpingRef.current = false;
    } else if (el.scrollLeft >= width * 2) {
      jumpingRef.current = true;
      jumpScroll(el, el.scrollLeft - width);
      jumpingRef.current = false;
    }
  }, []);

  const goToMiddle = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = setWidth(el);
    if (!width) return;
    jumpScroll(el, width + (el.scrollLeft % width));
  }, []);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    goToMiddle();
    el.addEventListener("scroll", keepLoop, { passive: true });
    window.addEventListener("resize", goToMiddle);
    const observer = new ResizeObserver(goToMiddle);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", keepLoop);
      window.removeEventListener("resize", goToMiddle);
      observer.disconnect();
    };
  }, [goToMiddle, keepLoop]);

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
    <section className="bg-page" aria-label="Avis Google">
      <div className="mx-auto hidden max-w-5xl items-center justify-end px-5 pt-6 sm:px-8 md:flex">
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

      <ul
        ref={scrollerRef}
        className="reviews-scroller mt-6 pb-16 md:mt-4 sm:pb-20"
        aria-label="Avis de clients"
      >
        {LOOPED_REVIEWS.map((item) => (
          <li
            key={`${item.copy}-${item.name}`}
            className="reviews-card"
            aria-hidden={item.copy !== 1}
          >
            <span className="reviews-avatar" aria-hidden="true">
              {item.name.charAt(0)}
            </span>
            <p className="mt-3 text-[17px] font-medium leading-none text-ink">
              {item.name}
            </p>
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
