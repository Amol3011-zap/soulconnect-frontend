import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, ArrowRight, CalendarDays } from 'lucide-react';
import { sessionAPI, healerAPI } from '../../services/api';

/**
 * Upcoming Session card.
 *
 * Uses the real GET /api/sessions/my-sessions endpoint and resolves the
 * practitioner's name via healerAPI.getHealer. No placeholder practitioner is
 * ever rendered: with nothing scheduled we show an honest empty state.
 */

function formatWhen(iso) {
  if (!iso) return null;
  const when = new Date(iso);
  if (Number.isNaN(when.getTime())) return null;

  const now = new Date();
  const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const days = Math.round((startOfDay(when) - startOfDay(now)) / 86400000);

  const time = when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Tomorrow, ${time}`;
  return `${when.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}, ${time}`;
}

function initialsOf(name) {
  if (!name) return '·';
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function Shell({ children, action }) {
  return (
    <section className="sc-panel rs-card" aria-labelledby="upcoming-session-heading">
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12,
      }}>
        <h2 id="upcoming-session-heading" className="rs-card-title">
          <CalendarDays size={15} strokeWidth={2} color="#A78BFA" aria-hidden="true" />
          Upcoming Session
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export default function UpcomingSessionCard() {
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', session: null, healer: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await sessionAPI.mySessions();
        if (!alive) return;

        const now = Date.now();
        const upcoming = (res?.data?.sessions || [])
          .filter(s => {
            const t = new Date(s.scheduled_time).getTime();
            return Number.isFinite(t) && t > now && s.status !== 'cancelled';
          })
          .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time))[0];

        if (!upcoming) {
          setState({ status: 'empty', session: null, healer: null });
          return;
        }

        // Resolve the practitioner separately; the sessions payload has only an id.
        let healer = null;
        try {
          const h = await healerAPI.getHealer(upcoming.healer_id);
          healer = h?.data || null;
        } catch { /* name is optional — the session still renders without it */ }

        if (alive) setState({ status: 'ready', session: upcoming, healer });
      } catch {
        if (alive) setState({ status: 'error', session: null, healer: null });
      }
    })();
    return () => { alive = false; };
  }, []);

  if (state.status === 'loading') {
    return (
      <Shell>
        <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="sc-shimmer" style={{ width: 44, height: 44, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="sc-shimmer" style={{ width: '62%', height: 12, borderRadius: 6 }} />
            <div className="sc-shimmer" style={{ width: '42%', height: 10, borderRadius: 5, marginTop: 8 }} />
          </div>
        </div>
      </Shell>
    );
  }

  if (state.status !== 'ready') {
    return (
      <Shell>
        <p className="rs-muted" style={{ margin: '0 0 12px' }}>
          {state.status === 'error'
            ? 'Could not load your sessions right now.'
            : 'Nothing scheduled yet.'}
        </p>
        <button type="button" className="rs-btn rs-btn--ghost" onClick={() => navigate('/professionals')}>
          Explore Professionals <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </Shell>
    );
  }

  const { session, healer } = state;
  const name = healer?.name || healer?.full_name || 'Your practitioner';
  const title = healer?.title || healer?.specialization || healer?.specialty || null;
  const when = formatWhen(session.scheduled_time);

  return (
    <Shell
      action={
        <button type="button" className="rs-link" onClick={() => navigate('/professionals')}>
          View All
        </button>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span
          aria-hidden="true"
          style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(145deg, #A78BFA, #7C3AED)',
            boxShadow: '0 4px 14px rgba(124,58,237,0.42), inset 0 1px 0 rgba(255,255,255,0.28)',
            color: '#fff', fontSize: 15, fontWeight: 700,
          }}
        >
          {initialsOf(healer?.name || healer?.full_name)}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: 14, fontWeight: 700, color: '#F5F3FF',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}
          </p>
          {title && (
            <p className="rs-muted" style={{
              margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {title}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        {when && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(226,222,255,0.78)' }}>
            <CalendarDays size={13} strokeWidth={2} aria-hidden="true" />
            {when}
          </span>
        )}
        <button
          type="button"
          className="rs-icon-btn"
          onClick={() => navigate('/professionals')}
          aria-label={`Open your session with ${name}`}
        >
          <Video size={17} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </Shell>
  );
}
