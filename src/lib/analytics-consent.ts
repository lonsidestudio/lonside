export const CONSENT_KEY = 'lonside-cookie-consent';
export const CONSENT_EVENT = 'lonside-consent-change';

export function hasAnalyticsConsent(): boolean {
  try {
    const state = JSON.parse(window.localStorage.getItem(CONSENT_KEY) ?? 'null');
    return state?.accepted === true && state?.analytics === true;
  } catch {
    // Unavailable storage or malformed preferences must never enable tracking.
    return false;
  }
}

export function subscribeToConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) onChange();
  };
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
