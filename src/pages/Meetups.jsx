import React, { useState, useEffect } from 'react';
import { meetupAPI } from '../services/api';

const DEMO_MEETUPS = [
  {
    id: 1, title: 'Anxiety Support Circle', location_name: 'The Mindful Space, Bandra', city: 'Mumbai',
    description: 'A safe, anonymous group session for people managing anxiety. Share, listen, and heal together in a guided group setting.',
    scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 90, attendees: 5, max_attendees: 8, avg_rating: 4.8, review_count: 24,
    problem_type: 'anxiety', status: 'upcoming', icon: '🌀', accent: '#7c3aed',
  },
  {
    id: 2, title: 'Grief & Loss — Finding Light', location_name: 'Heal Hub, Koramangala', city: 'Bangalore',
    description: 'A compassionate gathering for those navigating loss. Share memories, find solidarity, and begin the journey back to hope.',
    scheduled_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 120, attendees: 3, max_attendees: 6, avg_rating: 4.9, review_count: 18,
    problem_type: 'grief_loss', status: 'upcoming', icon: '🕯️', accent: '#0891b2',
  },
  {
    id: 3, title: 'Confidence & Self-Worth Workshop', location_name: 'Online (Zoom)', city: 'Online',
    description: 'Interactive workshop to rebuild confidence through peer exercises, group sharing, and practical techniques.',
    scheduled_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 60, attendees: 11, max_attendees: 15, avg_rating: 4.7, review_count: 41,
    problem_type: 'lack_of_confidence', status: 'upcoming', icon: '🌱', accent: '#059669',
  },
];

const MEETUP_STYLES = `
  @media (prefers-reduced-motion: no-preference) {
    @keyframes meetAurora1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-40px) scale(1.12)} }
    @keyframes meetAurora2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,50px) scale(1.1)} }
    @keyframes meetAurora3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,20px) scale(1.08)} }
    @keyframes meetStar { 0%,100%{opacity:0.08;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.8)} }
  }
  @keyframes meetPulse { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0)} 50%{box-shadow:0 0 0 5px rgba(139,92,246,0.12)} }
  .meet-card { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease; }
  @media (hover: hover) { .meet-card:hover { transform: translateY(-5px); } }
`;

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function daysUntil(iso) {
  const diff = new Date(iso) - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

function SpotsBar({ current, max, accent }) {
  const pct = (current / max) * 100;
  const left = max - current;
  const isFull = left === 0;
  const isAlmostFull = left <= 2 && !isFull;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, letterSpacing: '0.06em', color: 'rgba(196,181,253,0.55)', textTransform: 'uppercase' }}>
          {current} joined
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: isFull ? '#ef4444' : isAlmostFull ? '#f59e0b' : 'rgba(196,181,253,0.55)' }}>
          {isFull ? 'Full' : `${left} spot${left !== 1 ? 's' : ''} left`}
        </span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4, transition: 'width 0.4s ease',
          width: `${pct}%`,
          background: isFull ? '#ef4444' : isAlmostFull ? '#f59e0b' : `linear-gradient(90deg, ${accent}, ${accent}90)`,
          boxShadow: `0 0 8px ${isFull ? '#ef4444' : accent}60`,
        }} />
      </div>
    </div>
  );
}

function MeetupCard({ meetup, joining, onJoin }) {
  const accent = meetup.accent || '#7c3aed';
  const pct = (meetup.attendees / meetup.max_attendees) * 100;
  const isFull = meetup.attendees >= meetup.max_attendees;
  const countdown = daysUntil(meetup.scheduled_time);

  return (
    <div className="meet-card" style={{
      background: 'rgb(7,2,20)',
      border: `1px solid ${accent}28`,
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: `0 0 0 1px ${accent}12, 0 20px 60px rgba(0,0,0,0.6)`,
      position: 'relative',
    }}>
      {/* Top accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

      {/* Inner glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 140,
        background: `radial-gradient(ellipse at 50% 0%, ${accent}10 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '22px 24px 0', position: 'relative' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            {/* Icon */}
            <div style={{
              width: 48, height: 48, borderRadius: 16, flexShrink: 0,
              background: `${accent}18`,
              border: `1px solid ${accent}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              boxShadow: `0 0 20px ${accent}20`,
            }}>{meetup.icon || '👥'}</div>

            <div>
              {/* Countdown badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 20, marginBottom: 6,
                background: `${accent}18`, border: `1px solid ${accent}35`,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}`, display: 'inline-block' }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>{countdown}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ebe4ff', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                {meetup.title}
              </h3>
            </div>
          </div>

          {/* Rating */}
          {meetup.avg_rating > 0 && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{meetup.avg_rating?.toFixed(1)}</div>
              <div style={{ fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.4)', marginTop: 2 }}>★ rated</div>
            </div>
          )}
        </div>

        {/* Location + duration dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
          {[
            { icon: '📍', text: meetup.location_name || meetup.city },
            { icon: '⏱', text: `${meetup.duration_minutes} min` },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 11 }}>{icon}</span>
              <span style={{ fontSize: 11, color: 'rgba(196,181,253,0.45)', letterSpacing: '0.02em' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Soul reading label */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.4)' }}>◆ About this circle</span>
        </div>

        {/* Description as hero italic */}
        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(235,228,255,0.65)', lineHeight: 1.75, margin: '0 0 20px' }}>
          "{meetup.description}"
        </p>

        {/* Date/Time stat */}
        <div style={{ display: 'flex', gap: 20, paddingBottom: 18, borderBottom: `1px solid ${accent}18` }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(196,181,253,0.3)', marginBottom: 4 }}>Date & Time</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(235,228,255,0.75)' }}>{formatDate(meetup.scheduled_time)}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(196,181,253,0.3)', marginBottom: 4 }}>Spots</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(235,228,255,0.75)' }}>{meetup.attendees}/{meetup.max_attendees} joined</div>
          </div>
        </div>

        {/* Spots bar */}
        <div style={{ paddingTop: 16, paddingBottom: 4 }}>
          <SpotsBar current={meetup.attendees || 0} max={meetup.max_attendees || 8} accent={accent} />
        </div>
      </div>

      {/* CTA bar */}
      <button
        onClick={() => onJoin(meetup.id)}
        disabled={joining === meetup.id || isFull}
        style={{
          width: '100%', padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          borderTop: `1px solid ${accent}20`,
          cursor: isFull ? 'default' : 'pointer',
          transition: 'background 0.2s ease',
          opacity: isFull ? 0.5 : 1,
        }}
        onMouseEnter={e => { if (!isFull) e.currentTarget.style.background = `${accent}14`; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(235,228,255,0.55)' }}>
          {joining === meetup.id ? 'Joining...' : isFull ? 'Full — Join Waitlist' : 'Reserve My Spot'}
        </span>
        <span style={{ fontSize: 20, color: '#a78bfa', lineHeight: 1 }}>
          {joining === meetup.id ? '⋯' : '→'}
        </span>
      </button>
    </div>
  );
}

export default function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [filter, setFilter] = useState('All');

  const FILTERS = ['All', 'Online', 'Mumbai', 'Delhi', 'Bangalore'];

  const STARS = Array.from({ length: 22 }, (_, i) => ({
    l: `${(i * 19 + 3) % 100}%`, t: `${(i * 27 + 5) % 100}%`,
    s: [1, 1.5, 2][i % 3], c: ['#a78bfa','#c4b5fd','#ffffff'][i % 3], d: (i * 0.28) % 3,
  }));

  useEffect(() => { fetchMeetups(); }, []);

  const fetchMeetups = async () => {
    try {
      const response = await meetupAPI.listMeetups();
      const data = response.data.meetups || [];
      setMeetups(data.length > 0 ? data : DEMO_MEETUPS);
    } catch {
      setMeetups(DEMO_MEETUPS);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (meetupId) => {
    setJoining(meetupId);
    try {
      await meetupAPI.joinMeetup(meetupId);
      setMeetups(prev => prev.map(m => m.id === meetupId ? { ...m, attendees: m.attendees + 1 } : m));
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(null);
    }
  };

  const filtered = filter === 'All'
    ? meetups
    : meetups.filter(m => (m.city || '').toLowerCase().includes(filter.toLowerCase()) || filter === 'Online' && (m.location_name || '').toLowerCase().includes('online'));

  return (
    <>
      <style>{MEETUP_STYLES}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #030009 0%, #0a0225 50%, #040112 100%)', position: 'relative', overflow: 'hidden' }}>

        {/* Aurora + stars background */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(8,145,178,0.16) 0%, transparent 70%)', animation: 'meetAurora1 20s ease-in-out infinite', filter: 'blur(70px)' }} />
          <div style={{ position: 'absolute', top: '35%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)', animation: 'meetAurora2 24s ease-in-out infinite', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '5%', right: '25%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)', animation: 'meetAurora3 28s ease-in-out infinite', filter: 'blur(80px)' }} />
          {STARS.map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p.l, top: p.t, width: p.s, height: p.s, borderRadius: '50%', background: p.c, animation: `meetStar ${2.5 + i % 3 * 0.5}s ease-in-out ${p.d}s infinite` }} />
          ))}
        </div>

        {/* ── HERO ── */}
        <div style={{ position: 'relative', zIndex: 1, padding: '60px 24px 50px', textAlign: 'center', borderBottom: '1px solid rgba(124,58,237,0.12)' }}>
          <div style={{ fontSize: 13, letterSpacing: '0.5em', color: 'rgba(139,92,246,0.3)', marginBottom: 28 }}>◆ ✦ ◆</div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 40, marginBottom: 20, background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.3)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0891b2', boxShadow: '0 0 8px #0891b2', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0891b2' }}>Small Groups · Safe Space</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px', color: '#ebe4ff' }}>
            Peer Support{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #e9d5ff 40%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Circles</span>
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(196,181,253,0.6)', maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Intimate group sessions of 6–15 people. Anonymous, judgment-free, facilitated by trained hosts.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
            {[['8 max', 'Per Group'], ['Anonymous', 'Always'], ['Free', 'To Join']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(196,181,253,0.4)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px 60px', position: 'relative', zIndex: 1 }}>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 32, scrollbarWidth: 'none' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flexShrink: 0, padding: '8px 20px', borderRadius: 40, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                background: filter === f ? 'linear-gradient(135deg, #0891b2, #2563eb)' : 'rgba(255,255,255,0.04)',
                color: filter === f ? '#fff' : 'rgba(196,181,253,0.5)',
                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: filter === f ? '0 0 20px rgba(8,145,178,0.35)' : 'none',
              }}>{f}</button>
            ))}
          </div>

          {/* Cards */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ borderRadius: 24, height: 260, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filtered.map(meetup => (
                <MeetupCard key={meetup.id} meetup={meetup} joining={joining} onJoin={handleJoin} />
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🌌</div>
                  <p style={{ color: 'rgba(196,181,253,0.4)', fontSize: 14 }}>No meetups found for this location yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Host CTA */}
          <div style={{
            marginTop: 48, borderRadius: 24, padding: '32px 36px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
            background: 'rgba(6,1,18,0.85)', backdropFilter: 'blur(30px)',
            border: '1px solid rgba(8,145,178,0.2)',
            boxShadow: '0 0 60px rgba(8,145,178,0.08)',
          }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.5)', marginBottom: 8 }}>◆ For Facilitators</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ebe4ff', margin: '0 0 6px' }}>Want to host a circle?</h3>
              <p style={{ fontSize: 13, color: 'rgba(196,181,253,0.5)', margin: 0 }}>Become a certified SoulConnect facilitator and create healing spaces in your community.</p>
            </div>
            <button style={{
              flexShrink: 0, padding: '12px 24px', borderRadius: 14, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #0891b2, #2563eb)', color: '#fff', border: 'none',
              cursor: 'pointer', boxShadow: '0 0 24px rgba(8,145,178,0.4)',
            }}>Apply Now →</button>
          </div>
        </div>
      </div>
    </>
  );
}
