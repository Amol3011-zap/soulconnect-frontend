import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { buildSessionStartPayload, getSessionId } from '../lib/visitorSession';

const UPDATE_INTERVAL_MS = 30_000;

/**
 * Anonymous visitor session tracking for the visitor_analytics table.
 * Starts a session once per tab, accumulates visited pages as the route
 * changes, and periodically flushes duration/pages/click-event updates.
 * Every network call is fire-and-forget (analyticsAPI already swallows
 * errors) — tracking must never affect the app's actual functionality.
 */
export function useVisitorTracking() {
  const location = useLocation();
  const startedRef = useRef(false);
  const pagesRef = useRef([]);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      analyticsAPI.sessionStart(buildSessionStartPayload());
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
      analyticsAPI.sessionUpdate({
        session_id: getSessionId(),
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
