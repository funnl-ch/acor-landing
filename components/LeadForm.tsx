"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { GoogleRating } from "@/components/GoogleRating";
import { PropertyTypeIcon } from "@/components/PropertyTypeIcon";
import { filterCommunes } from "@/lib/communes";
import { trackLead } from "@/lib/oaiq";
import { nbsp } from "@/lib/typography";
import {
  AGENCY,
  CONDITIONS,
  PROPERTY_TYPES,
  TIMELINES,
  showsLandArea,
  type Condition,
  type PropertyType,
  type Timeline,
} from "@/lib/constants";

const TOTAL_STEPS = 6;
const AUTO_ADVANCE_STEPS = new Set([1, 4, 5]);

const STEP_TITLES = [
  "Quel type de bien souhaitez-vous estimer ?",
  "Dans quelle commune se trouve le bien ?",
  "Quel est le volume et la surface ?",
  "Dans quel état est le bien ?",
  "Quand souhaitez-vous vendre ?",
  "Où un courtier peut-il vous joindre ?",
].map(nbsp);

type FormState = {
  propertyType: PropertyType | "";
  commune: string;
  livingArea: string;
  landArea: string;
  rooms: string;
  condition: Condition | "";
  timeline: Timeline | "";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  consent: boolean;
  website: string;
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  gclid: string;
  referrer: string;
};

const initialState: FormState = {
  propertyType: "",
  commune: "",
  livingArea: "",
  landArea: "",
  rooms: "",
  condition: "",
  timeline: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  consent: false,
  website: "",
  utm_source: "",
  utm_campaign: "",
  utm_content: "",
  gclid: "",
  referrer: "",
};

function canContinue(step: number, data: FormState): boolean {
  switch (step) {
    case 1:
      return data.propertyType !== "";
    case 2:
      return data.commune.trim().length >= 2;
    case 3:
      return (
        data.livingArea.trim() !== "" ||
        data.landArea.trim() !== "" ||
        data.rooms.trim() !== ""
      );
    case 4:
      return data.condition !== "";
    case 5:
      return data.timeline !== "";
    case 6:
      return (
        data.firstName.trim() !== "" &&
        data.lastName.trim() !== "" &&
        data.email.trim() !== "" &&
        data.phone.trim() !== "" &&
        data.address.trim() !== "" &&
        data.consent
      );
    default:
      return false;
  }
}

function optionalNumber(value: string): number | undefined {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optionalString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function toLeadBody(data: FormState) {
  return {
    typeBien: data.propertyType,
    commune: data.commune.trim(),
    pieces: optionalNumber(data.rooms),
    surfaceHabitable: optionalNumber(data.livingArea),
    surfaceTerrain: optionalNumber(data.landArea),
    etat: data.condition,
    echeance: data.timeline,
    prenom: data.firstName.trim(),
    nom: data.lastName.trim(),
    email: data.email.trim(),
    telephone: data.phone.trim(),
    adresseBien: optionalString(data.address),
    consentement: true as const,
    honeypot: data.website,
    utmSource: optionalString(data.utm_source),
    utmCampaign: optionalString(data.utm_campaign),
    utmContent: optionalString(data.utm_content),
    gclid: optionalString(data.gclid),
    referrer: optionalString(data.referrer),
  };
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LeadForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [communeOpen, setCommuneOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skipInitialFocus = useRef(true);
  const advancingRef = useRef(false);
  const leadTrackedRef = useRef(false);
  const submittingRef = useRef(false);
  const listId = useId();

  const suggestions = useMemo(
    () => filterCommunes(data.commune),
    [data.commune],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setData((current) => ({
      ...current,
      utm_source: params.get("utm_source") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_content: params.get("utm_content") ?? "",
      gclid: params.get("gclid") ?? "",
      referrer: params.get("referrer") ?? document.referrer ?? "",
    }));
  }, []);

  useEffect(() => {
    if (skipInitialFocus.current) {
      skipInitialFocus.current = false;
      return;
    }
    document.getElementById("lead-first-field")?.focus({ preventScroll: true });
  }, [step, submitted]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function goNext() {
    if (!canContinue(step, data)) return;
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  function goBack() {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  }

  function autoAdvance(next: () => void) {
    if (advancingRef.current) return;
    advancingRef.current = true;
    next();
    const advance = () => {
      setStep((current) => Math.min(TOTAL_STEPS, current + 1));
      advancingRef.current = false;
    };
    if (prefersReducedMotion()) {
      advance();
      return;
    }
    window.setTimeout(advance, 140);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      step !== TOTAL_STEPS ||
      !canContinue(6, data) ||
      sending ||
      submittingRef.current
    ) {
      return;
    }

    submittingRef.current = true;
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toLeadBody(data)),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setError("network");
        return;
      }

      if (!leadTrackedRef.current) {
        leadTrackedRef.current = true;
        trackLead();
      }

      setSubmitted(true);
    } catch {
      setError("network");
    } finally {
      submittingRef.current = false;
      setSending(false);
    }
  }

  function onCommuneKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!communeOpen || suggestions.length === 0) {
      if (event.key === "ArrowDown" && suggestions.length > 0) {
        setCommuneOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveOption((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveOption((current) =>
        current === 0 ? suggestions.length - 1 : current - 1,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const chosen = suggestions[activeOption];
      if (chosen) {
        update("commune", chosen);
        setCommuneOpen(false);
      }
    } else if (event.key === "Escape") {
      setCommuneOpen(false);
    }
  }

  const progress = submitted ? 100 : (step / TOTAL_STEPS) * 100;
  const liveMessage = submitted
    ? "Demande enregistrée."
    : `${step} / ${TOTAL_STEPS}. ${STEP_TITLES[step - 1]}`;
  const showLand = showsLandArea(data.propertyType);
  const showNext = !AUTO_ADVANCE_STEPS.has(step) && step < TOTAL_STEPS;

  const cardClass = "flex flex-col text-left";

  if (submitted) {
    return (
      <section
        id="estimation"
        className="mx-auto w-full max-w-[560px] scroll-mt-4 text-left"
        aria-labelledby="lead-first-field"
      >
        <div className={cardClass}>
          <p className="sr-only" aria-live="polite">
            {liveMessage}
          </p>
          <h2
            id="lead-first-field"
            ref={headingRef}
            tabIndex={-1}
            className="hero-copy text-[22px] font-extrabold tracking-[-0.03em] text-white"
          >
            Demande envoyée
          </h2>
          <p className="hero-copy mt-5 text-body text-white">
            Votre demande est enregistrée. Un courtier ACOR vous rappelle sous
            48 heures ouvrables pour convenir d’une visite.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="estimation"
      className="mx-auto w-full max-w-[560px] scroll-mt-4 text-left"
      aria-labelledby="form-title"
    >
      <div className={cardClass}>
          <div className="mb-6 flex items-center gap-4">
            <div
              className="h-[4px] w-full overflow-hidden bg-white/20"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
              aria-valuenow={step}
              aria-label={`Progression, ${step} sur ${TOTAL_STEPS}`}
            >
              <div
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p
              className="form-on-video shrink-0 text-[17px] text-white/80"
              aria-hidden="true"
            >
              {step} / {TOTAL_STEPS}
            </p>
          </div>

          <p className="sr-only" aria-live="polite">
            {liveMessage}
          </p>

          <h2
            id="form-title"
            ref={headingRef}
            tabIndex={-1}
            className="form-on-video text-balance text-[22px] font-extrabold leading-snug tracking-[-0.03em] text-white"
          >
            {STEP_TITLES[step - 1]}
          </h2>

          <form className="mt-5 flex flex-col" onSubmit={onSubmit} noValidate>
            <input
              type="text"
              name="website"
              value={data.website}
              onChange={(event) => update("website", event.target.value)}
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <input type="hidden" name="utm_source" value={data.utm_source} />
            <input type="hidden" name="utm_campaign" value={data.utm_campaign} />
            <input type="hidden" name="utm_content" value={data.utm_content} />
            <input type="hidden" name="gclid" value={data.gclid} />
            <input type="hidden" name="referrer" value={data.referrer} />

            <div>
              {step === 1 && (
                <div className="grid gap-2.5" role="group" aria-label="Type de bien">
                  {PROPERTY_TYPES.map((item, index) => (
                    <button
                      key={item.value}
                      id={index === 0 ? "lead-first-field" : undefined}
                      type="button"
                      className="choice-btn"
                      aria-pressed={data.propertyType === item.value}
                      onClick={() => {
                        autoAdvance(() => {
                          setData((current) => ({
                            ...current,
                            propertyType: item.value,
                            landArea: showsLandArea(item.value)
                              ? current.landArea
                              : "",
                          }));
                          setError("");
                        });
                      }}
                    >
                      <PropertyTypeIcon type={item.value} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="relative">
                  <label htmlFor="lead-first-field" className="field-label">
                    Commune
                  </label>
                  <input
                    id="lead-first-field"
                    className="field-input"
                    value={data.commune}
                    onChange={(event) => {
                      update("commune", event.target.value);
                      setCommuneOpen(true);
                      setActiveOption(0);
                    }}
                    onFocus={() => setCommuneOpen(true)}
                    onBlur={() => {
                      window.setTimeout(() => setCommuneOpen(false), 120);
                    }}
                    onKeyDown={onCommuneKeyDown}
                    autoComplete="off"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={communeOpen && suggestions.length > 0}
                    aria-controls={listId}
                    aria-activedescendant={
                      communeOpen && suggestions[activeOption]
                        ? `${listId}-${activeOption}`
                        : undefined
                    }
                    placeholder="Ex. Sion, Crans-Montana, Verbier"
                  />
                  {communeOpen && suggestions.length > 0 && (
                    <ul
                      id={listId}
                      role="listbox"
                      className="absolute z-10 mt-2 max-h-56 w-full overflow-auto rounded-[12px] border-[0.5px] border-line bg-page"
                    >
                      {suggestions.map((commune, index) => (
                        <li key={commune} role="presentation">
                          <button
                            id={`${listId}-${index}`}
                            type="button"
                            role="option"
                            aria-selected={index === activeOption}
                            className={`block w-full min-h-btn px-4 py-3 text-left text-[17px] ${
                              index === activeOption ? "bg-canvas" : "bg-page"
                            }`}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              update("commune", commune);
                              setCommuneOpen(false);
                            }}
                          >
                            {commune}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-5">
                  <div>
                    <label htmlFor="lead-first-field" className="field-label">
                      Nombre de pièces
                    </label>
                    <input
                      id="lead-first-field"
                      className="field-input"
                      inputMode="decimal"
                      value={data.rooms}
                      onChange={(event) =>
                        update("rooms", event.target.value.replace(/[^\d.,]/g, ""))
                      }
                      placeholder="Ex. 4.5"
                    />
                  </div>
                  <div>
                    <label htmlFor="livingArea" className="field-label">
                      Surface habitable (m²)
                    </label>
                    <input
                      id="livingArea"
                      className="field-input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={data.livingArea}
                      onChange={(event) =>
                        update("livingArea", event.target.value.replace(/[^\d]/g, ""))
                      }
                      placeholder="Ex. 120"
                    />
                  </div>
                  {showLand && (
                    <div>
                      <label htmlFor="landArea" className="field-label">
                        Surface du terrain (m²)
                      </label>
                      <input
                        id="landArea"
                        className="field-input"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={data.landArea}
                        onChange={(event) =>
                          update("landArea", event.target.value.replace(/[^\d]/g, ""))
                        }
                        placeholder="Ex. 800"
                      />
                    </div>
                  )}
                  <p className="text-white/80">Un des champs suffit.</p>
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-2.5" role="group" aria-label="État du bien">
                  {CONDITIONS.map((item, index) => (
                    <button
                      key={item.value}
                      id={index === 0 ? "lead-first-field" : undefined}
                      type="button"
                      className="choice-btn"
                      aria-pressed={data.condition === item.value}
                      onClick={() =>
                        autoAdvance(() => update("condition", item.value))
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="grid gap-2.5" role="group" aria-label="Échéance">
                  {TIMELINES.map((item, index) => (
                    <button
                      key={item.value}
                      id={index === 0 ? "lead-first-field" : undefined}
                      type="button"
                      className="choice-btn"
                      aria-pressed={data.timeline === item.value}
                      onClick={() =>
                        autoAdvance(() => update("timeline", item.value))
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {step === 6 && (
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lead-first-field" className="field-label">
                        Prénom
                      </label>
                      <input
                        id="lead-first-field"
                        className="field-input"
                        autoComplete="given-name"
                        value={data.firstName}
                        onChange={(event) => update("firstName", event.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="field-label">
                        Nom
                      </label>
                      <input
                        id="lastName"
                        className="field-input"
                        autoComplete="family-name"
                        value={data.lastName}
                        onChange={(event) => update("lastName", event.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="field-label">
                      E-mail
                    </label>
                    <input
                      id="email"
                      className="field-input"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={data.email}
                      onChange={(event) => update("email", event.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="field-label">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      className="field-input"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={data.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      placeholder="027 322 10 25"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="field-label">
                      Adresse du bien
                    </label>
                    <input
                      id="address"
                      className="field-input"
                      autoComplete="street-address"
                      value={data.address}
                      onChange={(event) => update("address", event.target.value)}
                      placeholder="Rue et numéro"
                    />
                    <p className="field-hint">Pour préparer la visite.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      id="consent"
                      type="checkbox"
                      className="mt-1 h-6 w-6 shrink-0 rounded-[4px] accent-brand"
                      checked={data.consent}
                      onChange={(event) => update("consent", event.target.checked)}
                    />
                    <label
                      htmlFor="consent"
                      className="hero-copy text-body text-white"
                    >
                      J’accepte que ACOR Immobilier Sàrl traite mon nom, mon e-mail,
                      mon téléphone et les informations sur le bien pour me
                      recontacter au sujet de cette estimation. Ces données ne sont
                      pas vendues. Je peux retirer mon consentement à tout moment.
                      Voir la{" "}
                      <a
                        href="/politique-de-confidentialite"
                        target="_blank"
                        rel="noopener"
                        className="font-medium underline underline-offset-4"
                      >
                        politique de confidentialité
                      </a>
                      .
                    </label>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p
                className="hero-copy mt-5 text-body font-medium text-white"
                role="alert"
              >
                L’envoi n’a pas abouti. Appelez le{" "}
                <a href={AGENCY.phoneHref} className="underline underline-offset-4">
                  {AGENCY.phoneDisplay}
                </a>
                . Vos informations sont encore dans le formulaire.
              </p>
            )}

            {(step > 1 || showNext) && (
              <div className="mt-6 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button type="button" className="btn-ghost self-center" onClick={goBack}>
                    Retour
                  </button>
                ) : (
                  <span />
                )}

                {showNext && (
                  <button
                    type="button"
                    className="btn-next w-full sm:w-auto"
                    onClick={goNext}
                    disabled={!canContinue(step, data)}
                  >
                    Suivant
                  </button>
                )}
              </div>
            )}

            {step === 6 && (
              <button
                type="submit"
                className="btn-submit mt-3"
                disabled={!canContinue(6, data) || sending}
              >
                {sending ? "Envoi en cours" : "Demander mon estimation"}
              </button>
            )}
          </form>
        </div>
        <p className="hero-copy mt-4 px-1 text-center text-[15px] leading-snug text-white/85">
          Vos données ne sont ni vendues ni transmises à d’autres agences.
        </p>
        <div className="flex justify-center">
          <GoogleRating />
        </div>
    </section>
  );
}
