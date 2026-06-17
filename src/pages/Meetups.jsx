import React, { useState, useEffect } from 'react';
import { meetupAPI } from '../services/api';

const DEMO_MEETUPS = [
  {
    id: 1, title: 'Anxiety Support Circle', location_name: 'The Mindful Space, Bandra', city: 'Mumbai',
    description: 'A safe, anonymous group session for people managing anxiety. Share, listen, and heal together in a guided group setting.',
    scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 90, attendees: 5, max_attendees: 8, avg_rating: 4.8, review_count: 24,
    problem_type: 'anxiety', status: 'upcoming', icon: '🌀', accent: '#6D5EF5',
  },
  {
    id: 2, title: 'Grief & Loss — Finding Light', location_name: 'Heal Hub, Koramangala', city: 'Bangalore',
    description: 'A compassionate gathering for those navigating loss. Share memories, find solidarity, and begin the journey back to hope.',
    scheduled_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 120, attendees: 3, max_attendees: 6, avg_rating: 4.9, review_count: 18,
    problem_type: 'grief_loss', status: 'upcoming', icon: '🕯️', accent: '#0891B2',
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
  .meet-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  @media (hover: hover) { .meet-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(109,94,245,0.14) !important; } }
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
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>
          {current} joined
        </span>
        <span style={{ fontSize: 12, fontWeight: 700,
          color: isFull ? '#EF4444' : isAlmostFull ? '#F59E0B' : '#6B7280' }}>
          {isFull ? 'Full' : `${left} spot${left !== 1 ? 's' : ''} left`}
        </span>
      </div>
      <div style={{ height: 5, background: '#F5F3FF', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4, transition: 'width 0.4s ease',
          width: `${pct}%`,
          background: isFull ? '#EF4444' : isAlmostFull ? '#F59E0B' : `linear-gradient(90deg, ${accent}, ${accent}bb)`,
        }} />
      </div>
    </div>
  );
}

function MeetupCard({ meetup, joining, onJoin }) {
  const accent = meetup.accent || '#6D5EF5';
  const isFull = meetup.attendees >= meetup.max_attendees;
  const countdown = daysUntil(meetup.scheduled_time);

  return (
    <div className="meet-card" style={{
      background: '#FFFFFF',
      border: '1px solid #EDE9FE',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(109,94,245,0.08)',
    }}>
      {/* Top gradient accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
          {/* Icon */}
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: `${accent}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>{meetup.icon || '🫂'}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Countdown badge + rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 10px', borderRadius: 20,
                background: `${accent}15`, border: `1px solid ${accent}30`,
                fontSize: 10, fontWeight: 700, color: accent,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }} />
                {countdown}
              </span>
              {meetup.avg_rating > 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>
                  ★ {meetup.avg_rating?.toFixed(1)}
                  <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: 11 }}> ({meetup.review_count})</span>
                </span>
              )}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F2937', margin: 0, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
              {meetup.title}
            </h3>
          </div>
        </div>

        {/* Meta — location + duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
            <span>📍</span> {meetup.location_name || meetup.city}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
            <span>⏱</span> {meetup.duration_minutes} min
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
            <span>📅</span> {formatDate(meetup.scheduled_time)}
          </span>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7, margin: '0 0 16px' }}>
          {meetup.description}
        </p>

        {/* Spots bar */}
        <div style={{ marginBottom: 16 }}>
          <SpotsBar current={meetup.attendees || 0} max={meetup.max_attendees || 8} accent={accent} />
        </div>

        {/* CTA button */}
        <button
          onClick={() => onJoin(meetup.id)}
          disabled={joining === meetup.id || isFull}
          style={{
            width: '100%', padding: '12px 20px', borderRadius: 14,
            fontSize: 13, fontWeight: 700,
            background: isFull
              ? '#F5F3FF'
              : `linear-gradient(135deg, ${accent}, ${accent}bb)`,
            color: isFull ? '#9CA3AF' : '#fff',
            border: isFull ? '1px solid #EDE9FE' : 'none',
            cursor: isFull ? 'default' : 'pointer',
            boxShadow: isFull ? 'none' : `0 4px 14px ${accent}35`,
            transition: 'all 0.2s',
            opacity: joining === meetup.id ? 0.7 : 1,
          }}
        >
          {joining === meetup.id ? 'Joining…' : isFull ? 'Circle Full — Join Waitlist' : '🫂  Join This Circle'}
        </button>
      </div>
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

      <div style={{ minHeight: '100vh', background: '#FAFAFD' }}>

        {/* ── HERO ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1E40AF, #4C3DB8, #6D5EF5)',
          padding: 'clamp(32px,5vw,56px) clamp(20px,4vw,48px)',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          borderRadius: '0 0 32px 32px',
          marginBottom: 32,
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
            <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
              {Array.from({ length: 6 }, (_, i) => {
                const a = (i * 60) * Math.PI / 180;
                return <circle key={i} cx={400 + 80 * Math.cos(a)} cy={100 + 80 * Math.sin(a)} r="80" fill="none" stroke="white" strokeWidth="0.8" />;
              })}
              <circle cx="400" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.8" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 40, marginBottom: 16,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7DD3A0', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff' }}>Small Groups · Safe Space</span>
            </div>

            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 12px', color: '#FFFFFF' }}>
              Peer Support Circles
            </h1>

            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.7 }}>
              Intimate group sessions of 6–15 people. Anonymous, judgment-free, facilitated by trained hosts.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
              {[['8 max', 'Per Group'], ['Anonymous', 'Always'], ['Free', 'To Join']].map(([val, label], i) => (
                <div key={label} style={{
                  textAlign: 'center', padding: '0 24px',
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,3vw,32px) 80px' }}>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24, scrollbarWidth: 'none' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flexShrink: 0, padding: '8px 20px', borderRadius: 40, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                background: filter === f ? 'linear-gradient(135deg,#6D5EF5,#8B5CF6)' : '#FFFFFF',
                color: filter === f ? '#fff' : '#6B7280',
                border: filter === f ? 'none' : '1px solid #EDE9FE',
                boxShadow: filter === f ? '0 4px 14px rgba(109,94,245,0.3)' : '0 1px 4px rgba(109,94,245,0.06)',
              }}>{f}</button>
            ))}
          </div>

          {/* Cards */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ borderRadius: 20, height: 220, background: '#FFFFFF', border: '1px solid #EDE9FE', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map(meetup => (
                <MeetupCard key={meetup.id} meetup={meetup} joining={joining} onJoin={handleJoin} />
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
                  <p style={{ color: '#9CA3AF', fontSize: 14 }}>No circles found for this location yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Host CTA */}
          <div style={{
            marginTop: 40, borderRadius: 20, padding: '28px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
            background: 'linear-gradient(135deg, #F0F9FF, #DBEAFE)',
            border: '1px solid #BFDBFE',
          }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3B82F6', marginBottom: 8, fontWeight: 700 }}>✦ For Facilitators</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1F2937', margin: '0 0 5px' }}>Want to host a circle?</h3>
              <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Become a certified SoulConnect facilitator and create healing spaces in your community.</p>
            </div>
            <button style={{
              flexShrink: 0, padding: '12px 24px', borderRadius: 14, fontSize: 12, fontWeight: 700,
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: '#fff', border: 'none',
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
              whiteSpace: 'nowrap',
            }}>Apply Now →</button>
          </div>
        </div>
      </div>
    </>
  );
}
