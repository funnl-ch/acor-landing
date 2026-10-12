"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1400;
const STAGGER_MS = 140;

type Stat = {
  value: string;
  label: string;
};

function parseStat(raw: string) {
  const decimals = raw.includes(",") ? (raw.split(",")[1]?.length ?? 1) : 0;
  const end = Number(raw.replace(",", "."));
  return { end, decimals };
}

function formatStat(n: number, decimals: number) {
  return n.toFixed(decimals).replace(".", ",");
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function CountUp({
  value,
  play,
  delay,
}: {
  value: string;
  play: boolean;
  delay: number;
}) {
  const { end, decimals } = parseStat(value);
  const [text, setText] = useState(() =>
    Number.isFinite(end) ? formatStat(0, decimals) : value,
  );

  useEffect(() => {
    if (!play) return;
    if (!Number.isFinite(end) || prefersReducedMotion()) {
      setText(value);
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const timeout = window.setTimeout(() => {
      const tick = (now: number) => {
        if (start === null) start = now;
        const t = Math.min(1, (now - start) / DURATION_MS);
        setText(formatStat(end * easeOutCubic(t), decimals));
        if (t < 1) raf = requestAnimationFrame(tick);
        else setText(value);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [play, value, end, decimals, delay]);

  return (
    <span className="tabular-nums" aria-hidden="true">
      {text}
    </span>
  );
}

export function AnimatedStats({ stats }: { stats: readonly Stat[] }) {
  const rootRef = useRef<HTMLUListElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      setPlay(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <ul
      ref={rootRef}
      className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 text-center sm:grid-cols-4 sm:gap-8"
    >
      {stats.map((stat, index) => (
        <li key={stat.label}>
          <p
            className="text-[32px] font-extrabold leading-none tracking-[-0.04em] text-ink sm:text-[36px]"
            aria-label={stat.value}
          >
            <CountUp value={stat.value} play={play} delay={index * STAGGER_MS} />
          </p>
          <p className="mt-2 text-[15px] leading-snug text-muted">{stat.label}</p>
        </li>
      ))}
    </ul>
  );
}
