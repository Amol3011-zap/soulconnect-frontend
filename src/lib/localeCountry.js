/**
 * Best-effort country hint from the browser's language preference
 * (e.g. "en-IN" -> "IN"). This is a locale setting the user already
 * configured in their OS/browser, not a location lookup — never uses
 * GPS or IP. Returns null if no region subtag is present.
 */
export function getLocaleCountryHint() {
  if (typeof navigator === 'undefined') return null;
  const locale = navigator.language || navigator.languages?.[0];
  if (!locale) return null;
  const match = locale.match(/-([A-Z]{2})$/i);
  return match ? match[1].toUpperCase() : null;
}
