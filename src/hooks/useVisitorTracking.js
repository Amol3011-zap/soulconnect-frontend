import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { getSessionId, initInternalFlag, shouldTrack, buildSessionStartPayloadFor } from '../lib/visitorSession';

const UPDATE_INTERVAL_MS = 30_000;

/**
 * Anonymous visitor session tracking for the visitor_analytics table.
 * Starts a session once per tab, accumulates visited pages as the route
 * changes, and periodically flushes duration/pages/click-event updates.
 * Every network call is fire-and-forget (analyticsAPI already swallows
 * errors) — tracking must never affect the app's actual functionality.
 *
 * Skipped entirely for: non-production hostnames (localhost/LAN dev),
 * ?internal=1 visitors (flag persists via localStorage), bot-like user
 * agents / navigator.webdriver, and tabs that are backgrounded on load
 * (a session only starts once the tab is actually visible).
 */
export function useVisitorTracking() {
  const location = useLocation();
  const startedRef = useRef(false);
  const pagesRef = useRef([]);
  const startTimeRef = useRef(Date.now());
  // getSessionId() falls back to a fresh random id whenever sessionStorage
  // is blocked (private browsing, storage disabled) since nothing persists
  // it — called twice independently that would mean session/start and
  // session/update disagree on session_id and the backend can never match
  // the update to its session. Read it once per mount and reuse it.
  const sessionIdRef = useRef(null);
  if (sessionIdRef.current === null) sessionIdRef.current = getSessionId();

  useEffect(() => {
    initInternalFlag();
  }, []);

  useEffect(() => {
    if (startedRef.current || !shouldTrack()) return;

    const start = () => {
      if (startedRef.current || !shouldTrack()) return;
      startedRef.current = true;
      startTimeRef.current = Date.now();
      analyticsAPI.sessionStart(buildSessionStartPayloadFor(sessionIdRef.current));
    };

    if (document.visibilityState === 'visible') {
      start();
    } else {
      // Backgrounded tab (e.g. opened in a background tab, or a prerender) —
      // only start counting once a person actually looks at it.
      const onVisible = () => {
        if (document.visibilityState === 'visible') {
          start();
          document.removeEventListener('visibilitychange', onVisible);
        }
      };
      document.addEventListener('visibilitychange', onVisible);
      return () => document.removeEventListener('visibilitychange', onVisible);
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (pagesRef.current[pagesRef.current.length - 1] !== path) {
      pagesRef.current = [...pagesRef.current, path].slice(-50); // cap growth on very long sessions
    }
  }, [location.pathname]);

  useEffect(() => {
    const flush = () => {
      if (!startedRef.current) return; // never started (filtered out, or still backgrounded)
      analyticsAPI.sessionUpdate({
        session_id: sessionIdRef.current,
        pages_viewed: pagesRef.current,
        session_duration_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };

    const interval = setInterval(flush, UPDATE_INTERVAL_MS);
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', flush);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
