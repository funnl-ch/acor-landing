export function scrollToLeadForm() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const section = document.getElementById("estimation");
  section?.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });

  const focusField = () => {
    document.getElementById("lead-first-field")?.focus({ preventScroll: true });
  };

  if (reduced) {
    focusField();
    return;
  }

  window.setTimeout(focusField, 450);
}
