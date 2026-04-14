const CLARITY_PROJECT_ID = "wb3f26in8e";
const CLARITY_SCRIPT_ID = "ms-clarity";
const CLARITY_STORAGE_KEY = "firmascope-clarity-consent";

type ClarityConsentState = "granted" | "denied";
type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

const ensureClarityQueue = () => {
  if (!isBrowser()) {
    return;
  }

  if (window.clarity) {
    return;
  }

  const clarity: ClarityFn = ((...args: unknown[]) => {
    clarity.q = clarity.q || [];
    clarity.q.push(args);
  }) as ClarityFn;

  window.clarity = clarity;
};

export const initClarity = (projectId = CLARITY_PROJECT_ID) => {
  if (!isBrowser() || !projectId) {
    return;
  }

  ensureClarityQueue();

  const existingScript =
    document.getElementById(CLARITY_SCRIPT_ID) ??
    document.querySelector(`script[src="https://www.clarity.ms/tag/${projectId}"]`);

  if (existingScript) {
    return;
  }

  const script = document.createElement("script");
  script.id = CLARITY_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
};

export const setClarityTag = (key: string, value: string | string[]) => {
  if (!isBrowser() || !window.clarity) {
    return;
  }

  window.clarity("set", key, value);
};

export const applyClarityConsent = (state: ClarityConsentState) => {
  if (!isBrowser() || !window.clarity) {
    return;
  }

  window.clarity("consentv2", {
    ad_Storage: state,
    analytics_Storage: state,
  });
};

export const readClarityConsent = (): ClarityConsentState | null => {
  if (!isBrowser()) {
    return null;
  }

  const storedValue = window.localStorage.getItem(CLARITY_STORAGE_KEY);
  if (storedValue === "granted" || storedValue === "denied") {
    return storedValue;
  }

  return null;
};

export const persistClarityConsent = (state: ClarityConsentState) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CLARITY_STORAGE_KEY, state);
  applyClarityConsent(state);
};

export type { ClarityConsentState };
