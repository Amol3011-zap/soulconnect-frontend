import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Heart, Sparkles, ArrowRight, ShieldCheck, AlertTriangle,
  Inbox, Users, MessageCircle, Clock,
} from 'lucide-react';

import SoulMatchCard from '../components/soulmatch/SoulMatchCard';
import MatchDetailPanel from '../components/soulmatch/MatchDetailPanel';
import SoulMatchStyles from '../components/soulmatch/soulmatchStyles';
import { STRUGGLES, SUPPORT_NEEDS, CONVERSATION_STARTERS } from '../components/soulmatch/soulmatchOptions';
import {
  getSoulMatches, getConnectionRequests, getConnections, sendConnectionRequest,
} from '../components/soulmatch/soulmatchData';

const TABS = [
  { id: 'matches',     label: 'Matches',     Icon: Sparkles },
  { id: 'requests',    label: 'Requests',    Icon: Inbox },
  { id: 'connections', label: 'Connections', Icon: Users },
];

function toggle(set, id) {
  const next = new Set(set);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
}

/* ── Chip group ─────────────────────────────────────────────── */
function ChipGroup({ legend, hint, options, selected, onToggle }) {
  return (
    <fieldset className="sm-fieldset">
      <legend className="sm-legend">{legend}</legend>
      {hint && <p className="sm-hint">{hint}</p>}
      <div className="sm-chips">
        {options.map(opt => {
          const on = selected.has(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={on}
              className={`sm-chip${on ? ' is-on' : ''}`}
              onClick={() => onToggle(opt.id)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ── Skeletons ──────────────────────────────────────────────── */
function CardSkeletons({ count = 3 }) {
  return (
    <div className="sm-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sm-card" style={{ minHeight: 280 }}>
          <div className="sm-shimmer" style={{ width: 72, height: 72, borderRadius: '50%' }} />
          <div className="sm-shimmer" style={{ width: '55%', height: 14, borderRadius: 6, marginTop: 14 }} />
          <div className="sm-shimmer" style={{ width: '35%', height: 11, borderRadius: 5, marginTop: 9 }} />
          <div className="sm-shimmer" style={{ width: '100%', height: 11, borderRadius: 5, marginTop: 18 }} />
          <div className="sm-shimmer" style={{ width: '80%', height: 11, borderRadius: 5, marginTop: 8 }} />
          <div className="sm-shimmer" style={{ width: '100%', height: 44, borderRadius: 14, marginTop: 20 }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, body, actionLabel, onAction }) {
  return (
    <div className="sm-empty">
      <div className="sm-empty-icon" aria-hidden="true">{icon}</div>
      <h3 className="sm-empty-title">{title}</h3>
      <p className="sm-empty-body">{body}</p>
      {actionLabel && (
        <button type="button" className="sm-btn sm-btn--primary sm-empty-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function SoulMatch() {
  const navigate = useNavigate();

  const [tab, setTab] = useState('matches');
  const [struggles, setStruggles] = useState(() => new Set());
  const [needs, setNeeds] = useState(() => new Set());

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState(null);
  const [isMock, setIsMock] = useState(false);

  const [dismissed, setDismissed] = useState(() => new Set());
  const [requested, setRequested] = useState(() => new Set());
  const [pendingId, setPendingId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState('');

  const [requests, setRequests] = useState(null);
  const [requestsUnsupported, setRequestsUnsupported] = useState(false);
  const [connections, setConnections] = useState(null);
  const [connectionsLimited, setConnectionsLimited] = useState(false);

  const preferences = useMemo(() => ({
    struggles: [...struggles],
    needs: [...needs],
  }), [struggles, needs]);

  const load = useCallback(async (prefs) => {
    setLoading(true);
    const res = await getSoulMatches(prefs);
    setMatches(res.matches);
    setFailure(res.error);
    setIsMock(res.isMock);
    setLoading(false);
  }, []);

  useEffect(() => { load({}); }, [load]);

  useEffect(() => {
    if (tab !== 'requests' || requests !== null) return;
    getConnectionRequests().then(r => {
      setRequests(r.requests);
      setRequestsUnsupported(Boolean(r.unsupported));
    });
  }, [tab, requests]);

  useEffect(() => {
    if (tab !== 'connections' || connections !== null) return;
    getConnections().then(r => {
      setConnections(r.connections);
      setConnectionsLimited(Boolean(r.limited));
    });
  }, [tab, connections]);

  const handleConnect = useCallback(async (match) => {
    if (isMock) {
      setRequested(prev => new Set(prev).add(match.id));
      setNotice('Request sent. A conversation opens only if they accept.');
      setDetail(null);
      return;
    }
    setPendingId(match.id);
    try {
      await sendConnectionRequest(match.id);
      setRequested(prev => new Set(prev).add(match.id));
      setNotice('Request sent. A conversation opens only if they accept.');
      setDetail(null);
    } catch {
      setNotice('Could not send that request. Please try again.');
    } finally {
      setPendingId(null);
    }
  }, [isMock]);

  const handleDismiss = useCallback((m) => {
    setDismissed(prev => new Set(prev).add(m.id));
  }, []);

  const handleSafety = useCallback((m) => {
    setNotice(`You can block or report ${m.name} from their profile.`);
    setDetail(m);
  }, []);

  const visible = matches.filter(m => !dismissed.has(m.id));

  return (
    <>
      <SoulMatchStyles />

      <main className="sm-page">
        {/* ── Hero ── */}
        <header className="sm-hero">
          <div className="sm-hero-copy">
            <p className="sm-eyebrow">
              <Heart size={13} strokeWidth={2} fill="currentColor" aria-hidden="true" />
              SoulMatch
            </p>
            <h1 className="sm-title">Find someone who understands.</h1>
            <p className="sm-sub">Real people. Similar experiences. Meaningful connections.</p>
            <p className="sm-whisper">
              Sometimes you don&apos;t need advice.<br />You just need someone who gets it.
            </p>
          </div>
          <div className="sm-hero-art" aria-hidden="true">
            <div className="sm-orb sm-orb--a" />
            <div className="sm-orb sm-orb--b" />
            <div className="sm-orb sm-orb--c" />
          </div>
        </header>

        {/* ── Tabs ── */}
        <div className="sm-tabs" role="tablist" aria-label="SoulMatch sections">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              id={`sm-tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`sm-panel-${id}`}
              className={`sm-tab${tab === id ? ' is-on' : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={15} strokeWidth={2} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {notice && (
          <p className="sm-notice" role="status">{notice}</p>
        )}

        {/* ── Matches ── */}
        {tab === 'matches' && (
          <section id="sm-panel-matches" role="tabpanel" aria-labelledby="sm-tab-matches">
            <div className="sm-setup">
              <ChipGroup
                legend="What are you going through right now?"
                hint="Choose what feels most relevant. You can choose more than one."
                options={STRUGGLES}
                selected={struggles}
                onToggle={id => setStruggles(s => toggle(s, id))}
              />
              <ChipGroup
                legend="What are you looking for?"
                options={SUPPORT_NEEDS}
                selected={needs}
                onToggle={id => setNeeds(s => toggle(s, id))}
              />
              <button
                type="button"
                className="sm-btn sm-btn--primary sm-find-btn"
                onClick={() => load(preferences)}
              >
                Find My SoulMatches
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            <h2 className="sm-section-title">Your SoulMatches</h2>
            <p className="sm-section-sub">People who may understand what you&apos;re going through.</p>

            {loading ? (
              <CardSkeletons />
            ) : visible.length === 0 ? (
              <EmptyState
                icon={<Heart size={26} strokeWidth={1.8} color="#C4B5FD" />}
                title="Your SoulMatch circle is still growing 💜"
                body={failure === 'auth'
                  ? 'Sign in to find people who may understand your journey.'
                  : 'Keep checking in. As our community grows, we\'ll help you discover people who may understand your journey.'}
                actionLabel={failure === 'auth' ? null : 'Check In'}
                onAction={() => navigate('/home')}
              />
            ) : (
              <>
                <div className="sm-grid">
                  {visible.map((m, i) => (
                    <SoulMatchCard
                      key={m.id}
                      match={m}
                      index={i}
                      pending={pendingId === m.id}
                      requested={requested.has(m.id)}
                      onConnect={handleConnect}
                      onDismiss={handleDismiss}
                      onView={setDetail}
                      onSafety={handleSafety}
                    />
                  ))}
                </div>
                <p className="sm-safety-note">
                  <ShieldCheck size={13} strokeWidth={2} aria-hidden="true" />
                  Connecting sends a request. A conversation opens only if they accept.
                </p>
                {isMock && (
                  <p className="sm-dev-note">
                    <AlertTriangle size={12} strokeWidth={2.2} aria-hidden="true" />
                    Sample profiles — dev build only, no backend connected.
                  </p>
                )}
              </>
            )}
          </section>
        )}

        {/* ── Requests ── */}
        {tab === 'requests' && (
          <section id="sm-panel-requests" role="tabpanel" aria-labelledby="sm-tab-requests">
            <h2 className="sm-section-title">Connection requests</h2>
            <p className="sm-section-sub">People who&apos;d like to connect with you.</p>

            {requests === null ? (
              <CardSkeletons count={2} />
            ) : requests.length === 0 ? (
              <EmptyState
                icon={<Inbox size={26} strokeWidth={1.8} color="#C4B5FD" />}
                title="No connection requests yet."
                body="When someone asks to connect, their request will appear here."
              />
            ) : (
              <div className="sm-list">
                {requests.map(r => (
                  <article key={r.id} className="sm-card sm-card--row">
                    <h3 className="sm-card-name">Someone understands your journey 💜</h3>
                    <p className="sm-card-quote">&ldquo;{r.note}&rdquo;</p>
                    <ul className="sm-tags">
                      {r.tags.map(t => <li key={t}>{t}</li>)}
                    </ul>
                    <div className="sm-card-actions">
                      <button type="button" className="sm-btn sm-btn--primary"
                        onClick={() => { setRequests(list => list.filter(x => x.id !== r.id)); setNotice('Connection accepted.'); }}>
                        Accept
                      </button>
                      <button type="button" className="sm-btn sm-btn--ghost"
                        onClick={() => setRequests(list => list.filter(x => x.id !== r.id))}>
                        Not Now
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {requestsUnsupported && requests?.length === 0 && (
              <p className="sm-dev-note">
                <AlertTriangle size={12} strokeWidth={2.2} aria-hidden="true" />
                Incoming requests need a backend endpoint that doesn&apos;t exist yet.
              </p>
            )}
          </section>
        )}

        {/* ── Connections ── */}
        {tab === 'connections' && (
          <section id="sm-panel-connections" role="tabpanel" aria-labelledby="sm-tab-connections">
            <h2 className="sm-section-title">Your connections</h2>
            <p className="sm-section-sub">People you&apos;ve mutually connected with.</p>

            {connections === null ? (
              <CardSkeletons count={2} />
            ) : connections.length === 0 ? (
              <EmptyState
                icon={<Users size={26} strokeWidth={1.8} color="#C4B5FD" />}
                title="Your meaningful connections will appear here."
                body="Once you and someone else both agree to connect, you'll find them here."
              />
            ) : (
              <div className="sm-list">
                {connections.map(c => (
                  <article key={c.id} className="sm-card sm-card--row">
                    <h3 className="sm-card-name">{c.name || 'Connection'}</h3>
                    <p className="sm-card-loc">
                      <Clock size={11} strokeWidth={2} aria-hidden="true" />
                      {c.connectedAt ? new Date(c.connectedAt).toLocaleDateString() : 'Recently connected'}
                    </p>
                    {(c.tags || [c.problem].filter(Boolean)).length > 0 && (
                      <ul className="sm-tags">
                        {(c.tags || [c.problem]).filter(Boolean).map(t => <li key={t}>{t}</li>)}
                      </ul>
                    )}
                    <div className="sm-starters">
                      <p className="sm-starters-title">Not sure how to start?</p>
                      {CONVERSATION_STARTERS.slice(0, 2).map(s => (
                        <span key={s} className="sm-starter">{s}</span>
                      ))}
                    </div>
                    <div className="sm-card-actions">
                      <button type="button" className="sm-btn sm-btn--primary" onClick={() => navigate('/messages')}>
                        <MessageCircle size={15} strokeWidth={2} aria-hidden="true" />
                        Open Conversation
                      </button>
                      <button type="button" className="sm-btn sm-btn--quiet"
                        onClick={() => setNotice('You can block, report or disconnect from a conversation.')}>
                        Disconnect
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {connectionsLimited && connections?.length > 0 && (
              <p className="sm-dev-note">
                <AlertTriangle size={12} strokeWidth={2.2} aria-hidden="true" />
                Match history doesn&apos;t include the other person&apos;s profile yet, so these show limited detail.
              </p>
            )}
          </section>
        )}

        <p className="sm-safety-note sm-safety-note--foot">
          <ShieldCheck size={13} strokeWidth={2} aria-hidden="true" />
          Your safety matters. You can block or report anyone at any time.
        </p>
      </main>

      {detail && (
        <MatchDetailPanel
          match={detail}
          requested={requested.has(detail.id)}
          onClose={() => setDetail(null)}
          onConnect={handleConnect}
          onReport={m => { setNotice(`Thanks — reporting ${m.name} has been noted.`); setDetail(null); }}
          onBlock={m => { setDismissed(p => new Set(p).add(m.id)); setNotice(`${m.name} has been blocked.`); setDetail(null); }}
        />
      )}
    </>
  );
}
