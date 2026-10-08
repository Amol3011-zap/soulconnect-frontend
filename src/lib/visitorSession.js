/**
 * Anonymous visitor session tracking — feeds the (currently empty)
 * visitor_analytics table via POST /api/analytics/session/start and
 * /session/update. No PII: session_id is a random per-tab identifier
 * (not tied to any account, not persisted across tabs/browsers), and the
 * backend model itself only stores coarse device/browser info, UTM
 * params, referrer, and pages visited — see app/models.py VisitorAnalytics.
 */

const SESSION_ID_KEY = 'sc-visitor-session-id';
const INTERNAL_FLAG_KEY = 'sc_internal';

// Only these hosts are "real" production traffic. Dev servers (localhost,
// the Vite LAN host used for phone testing) and anything else must never
// reach visitor_analytics.
const TRACKED_HOSTNAMES = ['soulconnect.health', 'www.soulconnect.health'];

// Known non-human user agents. Not exhaustive — this is a cheap first
// filter, not a bot-detection system; the backend Origin check is the
// real boundary.
const BOT_UA_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|phantom|puppeteer|playwright|selenium|preview|facebookexternalhit|slackbot|discordbot|whatsapp|telegrambot|vercel-screenshot/i;

/**
 * Marks this browser as an internal/team visit (soulconnect.health/?internal=1).
 * Persists in localStorage so the flag survives across the session without
 * needing the query param on every page.
 */
export function initInternalFlag() {
  try {
    if (new URLSearchParams(window.location.search).get('internal') === '1') {
      localStorage.setItem(INTERNAL_FLAG_KEY, '1');
    }
  } catch {
    // storage blocked — fall through, isInternalVisitor() will just read false
  }
}

function isInternalVisitor() {
  try {
    return localStorage.getItem(INTERNAL_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

function isLikelyBot() {
  if (navigator.webdriver) return true;
  return BOT_UA_PATTERN.test(navigator.userAgent || '');
}

/**
 * Whether this page view should ever be sent to visitor_analytics.
 * Call before starting a session and before every flush.
 */
export function shouldTrack() {
  if (!TRACKED_HOSTNAMES.includes(window.location.hostname)) return false;
  if (isInternalVisitor()) return false;
  if (isLikelyBot()) return false;
  return true;
}

function getOrCreateSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    // Private browsing / storage blocked — fall back to an in-memory id
    // that just won't survive a reload. Tracking still works per-visit.
    return `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

function detectDeviceType() {
  const ua = navigator.userAgent || '';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone/i.test(ua)) return 'mobile';
  return 'desktop';
}

function detectBrowser() {
  const ua = navigator.userAgent || '';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  return 'Other';
}

function detectOS() {
  const ua = navigator.userAgent || '';
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac os x/i.test(ua)) return 'macOS';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ios/i.test(ua)) return 'iOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Other';
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
}

/**
 * Builds the session/start payload for a specific session_id. Callers
 * resolve the id once (getSessionId()) and pass it in here, rather than
 * each of start/update calling getOrCreateSessionId() independently — if
 * sessionStorage is blocked, two independent calls would each mint a
 * different random id and the backend could never match an update to its
 * session.
 */
export function buildSessionStartPayloadFor(sessionId) {
  return {
    session_id: sessionId,
    hostname: window.location.hostname,
    device_type: detectDeviceType(),
    browser: detectBrowser(),
    os: detectOS(),
    screen_resolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    referral_source: document.referrer || undefined,
    landing_page: window.location.pathname,
    ...getUtmParams(),
  };
}

export function getSessionId() {
  return getOrCreateSessionId();
}
