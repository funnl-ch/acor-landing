declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

export function trackLead(): void {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") {
    return;
  }

  window.oaiq("measure", "registration_completed", {
    type: "customer_action",
    amount: 0,
    currency: "USD",
  });
}
