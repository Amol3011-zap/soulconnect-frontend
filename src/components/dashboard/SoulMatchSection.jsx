import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { matchAPI } from '../../services/api';
import MatchCard from './MatchCard';

/**
 * SoulMatchSection — "People Who Understand".
 *
 * Uses the real matching backend (POST /api/matches/find). No fabricated
 * users, scores, or activity: if the API returns nothing we render a
 * designed empty state instead of placeholder people.
 *
 * Connection model is mutual-consent (see spec): "Connect" sends a request
 * via matchAPI.acceptMatch and the conversation only opens once the other
 * person accepts. Nothing here reveals another user's private check-ins —
 * only the fields the matching endpoint already exposes.
 */

function SectionShell({ children, footer }) {
  return (
    <section aria-labelledby="soulmatch-heading" style={{ marginBottom: 34 }}>
      <header className="sc-section-head" style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 16, marginBottom: 16, flexWrap: 'wrap',
      }}>
        <div style={{ minWidth: 0 }}>
          <h2
            id="soulmatch-heading"
            style={{
              margin: 0, fontSize: 19, fontWeight: 700, color: '#F5F3FF',
              letterSpacing: '-0.02em', display: 'flex', alignItems: 'center',
              gap: 9, flexWrap: 'wrap',
            }}
          >
            <Heart size={19} strokeWidth={2} color="#A78BFA" aria-hidden="true" fill="#A78BFA" />
            People Who Understand
            {/* The backend matches on shared struggles + proximity (a scoring
                rule, not a model), so this is labelled "Smart", not "AI". */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(139,92,246,0.18)',
              border: '1px solid rgba(167,139,250,0.32)',
              fontSize: 11, fontWeight: 650, color: '#DDD6FE',
              letterSpacing: 0,
            }}>
              <Sparkles size={11} strokeWidth={2.2} aria-hidden="true" />
              Smart Matches
            </span>
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'rgba(196,181,253,0.62)', lineHeight: 1.5 }}>
            You&apos;re not alone. Here are people going through similar experiences.
          </p>
        </div>
        {footer}
      </header>
      {children}
    </section>
  );
}

function MatchSkeleton() {
  return (
    <div className="sc-match-grid" aria-hidden="true">
      {[0, 1, 2].map(i => (
        <div key={i} className="sc-match-card" style={{ minHeight: 250 }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
            <div className="sc-shimmer" style={{ width: 72, height: 72, borderRadius: '50%' }} />
            <div style={{ flex: 1, paddingTop: 8 }}>
              <div className="sc-shimmer" style={{ width: '60%', height: 14, borderRadius: 6 }} />
              <div className="sc-shimmer" style={{ width: '40%', height: 11, borderRadius: 6, marginTop: 9 }} />
            </div>
          </div>
          <div className="sc-shimmer" style={{ width: '100%', height: 11, borderRadius: 6, marginBottom: 8 }} />
          <div className="sc-shimmer" style={{ width: '80%', height: 11, borderRadius: 6, marginBottom: 20 }} />
          <div className="sc-shimmer" style={{ width: '100%', height: 40, borderRadius: 14 }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCheckIn, reason }) {
  return (
    <div
      className="sc-panel"
      style={{ padding: '34px 26px', textAlign: 'center' }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 58, height: 58, borderRadius: '50%', margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 30%, rgba(167,139,250,0.35), rgba(124,58,237,0.12))',
          border: '1px solid rgba(167,139,250,0.22)',
        }}
      >
        <Heart size={24} strokeWidth={1.8} color="#C4B5FD" />
      </div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#EDE9FE' }}>
        No matches yet 💜
      </h3>
      <p style={{
        margin: '9px auto 20px', maxWidth: 380, fontSize: 13.5,
        lineHeight: 1.65, color: 'rgba(196,181,253,0.62)',
      }}>
        {reason === 'auth'
          ? 'Sign in to find people who understand your journey.'
          : 'Your next check-in may help us find someone who understands your journey.'}
      </p>
      {reason !== 'auth' && (
        <button type="button" onClick={onCheckIn} className="sc-match-btn sc-match-btn--primary" style={{ maxWidth: 200, margin: '0 auto' }}>
          Check In
        </button>
      )}
    </div>
  );
}

export default function SoulMatchSection({ onCheckIn }) {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [dismissed, setDismissed] = useState(() => new Set());
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      let rows = [];
      let failure = null;

      try {
        const res = await matchAPI.findMatches();
        rows = Array.isArray(res?.data?.matches) ? res.data.matches : [];
      } catch (err) {
        // Never surface raw errors or sensitive detail to the UI.
        failure = err?.response?.status === 401 ? 'auth' : 'unavailable';
      }

      // Local development only: with no backend running there is nothing to
      // design against, so fall back to sample profiles. `import.meta.env.DEV`
      // is statically false in production builds, so this branch (and the
      // module it imports) is stripped out entirely.
      if (import.meta.env.DEV && rows.length === 0) {
        try {
          const { MOCK_MATCHES } = await import('./mockMatches.dev.js');
          rows = MOCK_MATCHES;
          failure = null;
          setIsMock(true);
        } catch { /* fixture missing — fall through to the empty state */ }
      }

      if (!alive) return;
      setReason(failure);
      setMatches(rows);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const handleConnect = useCallback(async (match) => {
    // Sample profiles have no server-side counterpart — don't call the API.
    if (isMock) {
      setDismissed(prev => new Set(prev).add(match.id));
      return;
    }
    setPendingId(match.id);
    try {
      await matchAPI.acceptMatch(match.id);
      // Request sent — remove from suggestions. The conversation only opens
      // once the other person accepts, so we do not navigate to a chat here.
      setDismissed(prev => new Set(prev).add(match.id));
    } catch {
      /* silent — no sensitive detail in errors */
    } finally {
      setPendingId(null);
    }
  }, [isMock]);

  const handleDismiss = useCallback((match) => {
    setDismissed(prev => new Set(prev).add(match.id));
  }, []);

  // Home is a preview only — the full experience lives at /soulmatch.
  const visible = matches.filter(m => !dismissed.has(m.id)).slice(0, 3);

  if (loading) {
    return <SectionShell><MatchSkeleton /></SectionShell>;
  }

  if (visible.length === 0) {
    return (
      <SectionShell>
        <EmptyState onCheckIn={onCheckIn} reason={reason} />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      footer={
        <button
          type="button"
          onClick={() => navigate('/soulmatch')}
          className="sc-link-btn"
        >
          View All <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      }
    >
      <div className="sc-match-grid">
        {visible.map((m, i) => (
          <MatchCard
            key={m.id}
            match={m}
            index={i}
            pending={pendingId === m.id}
            onConnect={handleConnect}
            onDismiss={handleDismiss}
          />
        ))}
      </div>

      <p style={{
        margin: '14px 0 0', fontSize: 11.5, color: 'rgba(196,181,253,0.45)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <ShieldCheck size={13} strokeWidth={2} aria-hidden="true" />
        Connecting sends a request. A conversation opens only if they accept.
      </p>

      {isMock && (
        <p style={{
          margin: '8px 0 0', fontSize: 11, fontWeight: 600,
          color: 'rgba(251,191,36,0.85)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <AlertTriangle size={12} strokeWidth={2.2} aria-hidden="true" />
          Sample profiles — dev build only, no backend connected.
        </p>
      )}
    </SectionShell>
  );
}
