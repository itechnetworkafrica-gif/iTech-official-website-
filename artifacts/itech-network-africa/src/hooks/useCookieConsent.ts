import { useState, useEffect } from 'react';

export type CookiePreferences = {
  analytics:    boolean;
  functionality: boolean;
  marketing:    boolean;
};

export type ConsentState = {
  decided: boolean;
  preferences: CookiePreferences;
};

const STORAGE_KEY = 'itech_cookie_consent_v1';

const DEFAULTS: CookiePreferences = {
  analytics:    false,
  functionality: false,
  marketing:    false,
};

function load(): ConsentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ConsentState;
  } catch {}
  return { decided: false, preferences: DEFAULTS };
}

function save(state: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(load);

  const acceptAll = () => {
    const next: ConsentState = {
      decided: true,
      preferences: { analytics: true, functionality: true, marketing: true },
    };
    save(next);
    setConsent(next);
  };

  const rejectAll = () => {
    const next: ConsentState = {
      decided: true,
      preferences: DEFAULTS,
    };
    save(next);
    setConsent(next);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    const next: ConsentState = { decided: true, preferences: prefs };
    save(next);
    setConsent(next);
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsent({ decided: false, preferences: DEFAULTS });
  };

  return { consent, acceptAll, rejectAll, savePreferences, resetConsent };
}
