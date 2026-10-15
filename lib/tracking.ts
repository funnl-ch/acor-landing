import { readTrackingConsent } from "@/lib/consent";
import { OAI_PIXEL_ID } from "@/lib/oai-hash";

const CLARITY_ID = "ysn6d1qrfs";

type QueuedFn = ((...args: unknown[]) => void) & { q: unknown[] };

function installOpenAiPixel(): void {
  if (typeof window.oaiq === "function") return;

  const queue = function (this: unknown) {
    queue.q.push(arguments);
  } as QueuedFn;
  queue.q = [];
  window.oaiq = queue;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
  document.head.appendChild(script);

  const init: { pixelId: string; debug?: boolean } = { pixelId: OAI_PIXEL_ID };
  if (process.env.NODE_ENV !== "production") init.debug = true;
  window.oaiq("init", init);
}

function installClarity(): void {
  if (document.getElementById("microsoft-clarity")) return;

  const clarity = function (this: unknown) {
    (clarity.q = clarity.q || []).push(arguments);
  } as QueuedFn;
  clarity.q = [];
  window.clarity = window.clarity || clarity;

  const script = document.createElement("script");
  script.id = "microsoft-clarity";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(script);
}

/** Charge le pixel OpenAI et Clarity. Sans effet tant que le visiteur n’a pas accepté. */
export function loadTrackingScripts(): void {
  if (typeof window === "undefined") return;
  if (readTrackingConsent() !== "accepted") return;
  installOpenAiPixel();
  installClarity();
}
