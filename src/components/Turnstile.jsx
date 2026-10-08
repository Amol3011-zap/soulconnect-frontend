import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   Cloudflare Turnstile.

   Chosen over reCAPTCHA deliberately: Turnstile is invisible for most people,
   and it does not send your users' behaviour to an advertising graph. For a
   mental health platform that matters, because "who signed up for the app about
   depression" is exactly the inference that must never leave our systems.

   DEV / MOCK MODE
   With no VITE_TURNSTILE_SITE_KEY set, this falls back to Cloudflare's public
   test key, which always passes. So mock signups work locally with no setup.

   PRODUCTION
   Set VITE_TURNSTILE_SITE_KEY. The token this returns MUST be verified
   server-side via /siteverify before the account is created. A token that is
   never checked by the backend protects nothing at all.
   ───────────────────────────────────────────────────────────────────────────── */

// Cloudflare's documented "always passes" test key.
const TEST_SITE_KEY = '1x00000000000000000000AA';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function Turnstile({ onVerify, onExpire, theme = 'light' }) {
  const holder = useRef(null);
  const widgetId = useRef(null);
  const [failed, setFailed] = useState(false);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || TEST_SITE_KEY;
  const usingTestKey = siteKey === TEST_SITE_KEY;

  useEffect(() => {
    if (usingTestKey && import.meta.env.PROD) {
      // Loud, because shipping the test key means the check is decorative.
      console.warn('[Turnstile] No VITE_TURNSTILE_SITE_KEY set. Using the test key, which always passes.');
    }

    let cancelled = false;

    const render = () => {
      if (cancelled || !holder.current || widgetId.current !== null) return;
      try {
        widgetId.current = window.turnstile.render(holder.current, {
          sitekey: siteKey,
          theme,
          callback: (token) => onVerify?.(token),
          'expired-callback': () => onExpire?.(),
          'error-callback': () => setFailed(true),
        });
      } catch {
        setFailed(true);
      }
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      const onLoad = () => render();
      script.addEventListener('load', onLoad);
      // Script already cached and loaded before the listener attached.
      if (window.turnstile) render();
      return () => {
        cancelled = true;
        script.removeEventListener('load', onLoad);
      };
    }

    return () => { cancelled = true; };
  }, [siteKey, theme]);

  // Remove the widget on unmount so re-mounting the step does not stack widgets.
  useEffect(() => () => {
    if (widgetId.current !== null && window.turnstile?.remove) {
      try { window.turnstile.remove(widgetId.current); } catch { /* already gone */ }
    }
  }, []);

  // If Cloudflare cannot be reached, do not trap the person on the form.
  // Rate limiting on the backend is still in place.
  if (failed) {
    onVerify?.('turnstile-unavailable');
    return null;
  }

  return <div ref={holder} style={{ marginBottom: 14 }} />;
}
