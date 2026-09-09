/**
 * SoulMatch data layer.
 *
 * One place where the page talks to the backend, so the future matching
 * engine can grow behind this interface without touching the UI.
 *
 * Backend reality today (see app/routes/matching.py):
 *   - POST /matches/find     → real recommendations
 *   - POST /matches/accept   → creates an ACTIVE match immediately
 *   - GET  /matches/history  → past matches, but WITHOUT the other user's
 *                              identity, so connections render with limited info
 *   - (no endpoint for incoming connection requests)
 */
import { matchAPI } from '../../services/api';

/** Backend `match_score` is a 0-200 point total, NOT a percentage. */
export const MAX_MATCH_SCORE = 200;

export function scoreToPercent(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return null;
  return Math.min(100, Math.max(0, Math.round((score / MAX_MATCH_SCORE) * 100)));
}

/**
 * Fetch recommended matches.
 *
 * `preferences` ({ struggles: string[], needs: string[] }) is accepted now and
 * forwarded once the backend supports filtering; today /matches/find derives
 * recommendations from the user's stored profile, so it is sent for free.
 */
export async function getSoulMatches(preferences = {}) {
  let rows = [];
  let error = null;

  try {
    const res = await matchAPI.findMatches(preferences);
    rows = Array.isArray(res?.data?.matches) ? res.data.matches : [];
  } catch (err) {
    error = err?.response?.status === 401 ? 'auth' : 'unavailable';
  }

  // Local development only. `import.meta.env.DEV` is statically false in
  // production builds, so this branch and its fixture are stripped out.
  if (import.meta.env.DEV && rows.length === 0) {
    try {
      const { MOCK_SOULMATCHES } = await import('./soulmatch.mock.dev.js');
      return { matches: MOCK_SOULMATCHES, error: null, isMock: true };
    } catch { /* no fixture — fall through to the empty state */ }
  }

  return { matches: rows, error, isMock: false };
}

/**
 * Send a connection request.
 *
 * NOTE: the current backend marks the match ACTIVE straight away rather than
 * creating a pending request the other person can accept. The UI reports
 * "request sent" and does not open a conversation, so it never claims a
 * consent step the server has not actually enforced.
 */
export async function sendConnectionRequest(userId) {
  await matchAPI.acceptMatch(userId);
}

/**
 * Incoming connection requests.
 *
 * No endpoint exists yet. Returns an empty list rather than inventing people,
 * so the Requests tab renders its honest empty state.
 */
export async function getConnectionRequests() {
  if (import.meta.env.DEV) {
    try {
      const { MOCK_REQUESTS } = await import('./soulmatch.mock.dev.js');
      return { requests: MOCK_REQUESTS, error: null, isMock: true };
    } catch { /* fall through */ }
  }
  return { requests: [], error: null, isMock: false, unsupported: true };
}

/**
 * Accepted connections, from real match history.
 *
 * /matches/history does not return the other participant's name or id, so
 * cards show the shared problem and date rather than a person. Flagged via
 * `limited` so the UI can say so instead of rendering blanks.
 */
export async function getConnections() {
  try {
    const res = await matchAPI.getHistory();
    const rows = Array.isArray(res?.data?.matches) ? res.data.matches : [];
    const active = rows.filter(m => m.status === 'active' || m.status === 'completed');

    if (import.meta.env.DEV && active.length === 0) {
      try {
        const { MOCK_CONNECTIONS } = await import('./soulmatch.mock.dev.js');
        return { connections: MOCK_CONNECTIONS, error: null, isMock: true, limited: false };
      } catch { /* fall through */ }
    }

    return {
      connections: active.map(m => ({
        id: m.id,
        problem: m.problem,
        connectedAt: m.matched_at,
        status: m.status,
      })),
      error: null,
      isMock: false,
      limited: true,
    };
  } catch (err) {
    return {
      connections: [],
      error: err?.response?.status === 401 ? 'auth' : 'unavailable',
      isMock: false,
      limited: true,
    };
  }
}
