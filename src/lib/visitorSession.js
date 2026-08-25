/**
 * Anonymous visitor session tracking — feeds the (currently empty)
 * visitor_analytics table via POST /api/analytics/session/start and
 * /session/update. No PII: session_id is a random per-tab identifier
 * (not tied to any account, not persisted across tabs/browsers), and the
 * backend model itself only stores coarse device/browser info, UTM
 * params, referrer, and pages visited — see app/models.py VisitorAnalytics.
 */

const SESSION_ID_KEY = 'sc-visitor-session-id';

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

export function buildSessionStartPayload() {
  return {
    session_id: getOrCreateSessionId(),
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
