import React, { useState, useEffect } from 'react';
import { meetupAPI } from '../services/api';
import Footer from '../components/Footer';

// ─── DEMO DATA (extended with premium fields) ───────────────────────────────
const DEMO_MEETUPS = [
  {
    id: 1,
    title: 'Anxiety Support Circle',
    location_name: 'The Mindful Space, Bandra',
    city: 'Mumbai',
    description: 'A safe, anonymous space to share, listen and learn tools to manage anxiety together.',
    scheduled_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 90,
    attendees: 5,
    max_attendees: 8,
    avg_rating: 4.8,
    review_count: 124,
    problem_type: 'anxiety',
    status: 'upcoming',
    icon: '🌀',
    accent: '#6D4AFF',
    spotsLeft: 3,
    tags: ['Anxiety', 'Supportive', 'Beginner Friendly'],
    host: { name: 'Priya', role: 'Wellness Coach', rating: 4.9, circles: 48, initials: 'P', color: '#6D4AFF' },
    energy: [
      { label: 'Anxious', pct: 42, color: '#A78BFA' },
      { label: 'Hopeful', pct: 31, color: '#34C38F' },
      { label: 'Calm', pct: 19, color: '#6D4AFF' },
      { label: 'Supported', pct: 8, color: '#F472B6' },
    ],
  },
  {
    id: 2,
    title: 'Grief & Loss — Finding Light',
    location_name: 'Heal Hub, Koramangala',
    city: 'Bangalore',
    description: 'A compassionate circle for those navigating loss. Share memories, find solidarity and begin the journey back to hope.',
    scheduled_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 120,
    attendees: 2,
    max_attendees: 6,
    avg_rating: 4.9,
    review_count: 86,
    problem_type: 'grief_loss',
    status: 'upcoming',
    icon: '🕯',
    accent: '#0891B2',
    spotsLeft: 4,
    tags: ['Grief', 'Healing', 'Gentle Space'],
    host: { name: 'Arjun', role: 'Grief Support Guide', rating: 4.8, circles: 32, initials: 'A', color: '#0891B2' },
    energy: [
      { label: 'Sad', pct: 38, color: '#A78BFA' },
      { label: 'Hopeful', pct: 36, color: '#34C38F' },
      { label: 'Calm', pct: 18, color: '#6D4AFF' },
      { label: 'Supported', pct: 8, color: '#F472B6' },
    ],
  },
  {
    id: 3,
    title: 'Confidence & Self-Worth Workshop',
    location_name: 'Online (Zoom)',
    city: 'Online',
    description: 'Interactive workshop to rebuild confidence through peer exercises, group sharing, and practical techniques.',
    scheduled_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 60,
    attendees: 11,
    max_attendees: 15,
    avg_rating: 4.7,
    review_count: 41,
    problem_type: 'lack_of_confidence',
    status: 'upcoming',
    icon: '🌱',
    accent: '#059669',
    spotsLeft: 4,
    tags: ['Confidence', 'Self-Worth', 'Interactive'],
    host: { name: 'Meera', role: 'Life Coach', rating: 4.7, circles: 27, initials: 'M', color: '#059669' },
    energy: [
      { label: 'Nervous', pct: 30, color: '#A78BFA' },
      { label: 'Hopeful', pct: 40, color: '#34C38F' },
      { label: 'Excited', pct: 22, color: '#6D4AFF' },
      { label: 'Ready', pct: 8, color: '#F472B6' },
    ],
  },
];

// ─── ANIMATION STYLES ───────────────────────────────────────────────────────
const MEETUP_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
  @keyframes mFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes mFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }
  .m-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .m-hover:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 36px rgba(109,74,255,0.14) !important; }
  .m-anim-1 { animation: mFadeUp 0.4s 0.05s ease both; }
  .m-anim-2 { animation: mFadeUp 0.4s 0.12s ease both; }
  .m-anim-3 { animation: mFadeUp 0.4s 0.19s ease both; }
  .m-pill-btn:hover { background: rgba(109,74,255,0.04) !important; }
  .m-nav-link { transition: background 0.15s ease, color 0.15s ease; cursor: pointer; }
  .m-nav-link:hover { background: rgba(109,74,255,0.04) !important; }
  .m-preview-btn:hover { background: rgba(109,74,255,0.06) !important; }
  @media (max-width: 768px) {
    .m-sidebar { display: none !important; }
    .m-right-sidebar { display: none !important; }
    .m-card-inner { flex-direction: column !important; }
    .m-energy-panel { width: 100% !important; margin-left: 0 !important; }
  }
`;

// ─── UTILITIES ───────────────────────────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  });
}

function daysUntil(iso) {
  const diff = new Date(iso) - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Starting Today';
  if (days === 1) return 'Starting Tomorrow';
  return `Starting in ${days} Days`;
}

function SpotsBar({ current, max, accent }) {
  const pct = (current / max) * 100;
  const left = max - current;
  const isFull = left === 0;
  const isAlmostFull = left <= 2 && !isFull;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{current} joined</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: isFull ? '#EF4444' : isAlmostFull ? '#F59E0B' : '#6B7280' }}>
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

// ─── DOUGHNUT CHART ──────────────────────────────────────────────────────────
function EnergyChart({ segments }) {
  const r = 40;
  const cx = 55;
  const cy = 55;
  const circumference = 2 * Math.PI * r; // ≈ 251.33
  let cumulative = 0;

  return (
    <div>
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Background track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F0FF" strokeWidth={16} />
        {segments.map((seg, i) => {
          const dashLen = (seg.pct / 100) * circumference;
          const dashGap = circumference - dashLen;
          // rotate so each segment starts after the previous one
          // SVG stroke starts at 3 o'clock; rotate -90 to start at top
          const rotationDeg = -90 + (cumulative / 100) * 360;
          cumulative += seg.pct;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={16}
              strokeDasharray={`${dashLen} ${dashGap}`}
              strokeDashoffset={0}
              strokeLinecap="butt"
              transform={`rotate(${rotationDeg}, ${cx}, ${cy})`}
            />
          );
        })}
        {/* Center text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1A1333">Energy</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize="8" fill="#6B7280">Now</text>
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: '#4B5563', fontWeight: 500 }}>{seg.label}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1A1333' }}>{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PREMIUM CIRCLE CARD ─────────────────────────────────────────────────────
function PremiumCircleCard({ meetup, joining, onJoin, onPreview }) {
  const accent = meetup.accent || '#6D4AFF';
  const isFull = meetup.attendees >= meetup.max_attendees;
  const countdown = daysUntil(meetup.scheduled_time);
  const spotsLeft = meetup.spotsLeft ?? (meetup.max_attendees - meetup.attendees);
  const host = meetup.host || { name: 'Host', role: 'Facilitator', rating: 4.8, circles: 10, initials: 'H', color: accent };
  const energy = meetup.energy || [];
  const tags = meetup.tags || [];

  // Generate pseudo avatars for "joined by" section
  const avatarColors = ['#6D4AFF', '#34C38F', '#F472B6', '#F5B841', '#0891B2'];

  return (
    <div
      className="m-hover"
      style={{
        background: '#FFFFFF',
        borderRadius: 24,
        border: '1px solid rgba(109,74,255,0.1)',
        boxShadow: '0 2px 20px rgba(109,74,255,0.07)',
        overflow: 'hidden',
        marginBottom: 20,
      }}
    >
      {/* Top accent strip */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />

      {/* Card inner */}
      <div className="m-card-inner" style={{ display: 'flex', padding: 24 }}>

        {/* ── LEFT CONTENT ── */}
        <div style={{ flex: 1 }}>
          {/* Top row: icon + meta */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
            {/* Icon */}
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: `linear-gradient(135deg, ${accent}20, ${accent}10)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              {meetup.icon || '🫂'}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Countdown + rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 20,
                  background: `${accent}15`, border: `1px solid ${accent}30`,
                  fontSize: 10, fontWeight: 700, color: accent,
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: accent, display: 'inline-block',
                    animation: 'mPulse 2s ease-in-out infinite',
                  }} />
                  {countdown}
                </span>
                {meetup.avg_rating > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>
                    ⭐ {meetup.avg_rating?.toFixed(1)}
                    <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: 11 }}> ({meetup.review_count})</span>
                  </span>
                )}
              </div>
              {/* Title */}
              <h3 style={{
                fontSize: 20, fontWeight: 800, color: '#1A1333',
                fontFamily: 'Playfair Display, Georgia, serif',
                lineHeight: 1.2, margin: 0,
              }}>
                {meetup.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: '0 0 14px' }}>
            {meetup.description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {tags.map((tag, i) => (
                <span key={i} style={{
                  background: 'rgba(109,74,255,0.06)', color: '#6D4AFF',
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
              📍 {meetup.location_name || meetup.city}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
              ⏱ {meetup.duration_minutes} min
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
              📅 {formatDate(meetup.scheduled_time)}
            </span>
          </div>

          {/* Bottom row: host / avatars / actions */}
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
            marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(109,74,255,0.06)',
          }}>

            {/* Hosted by */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${host.color || accent}, ${host.color || accent}99)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 700,
              }}>
                {host.initials}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1333', lineHeight: 1.2 }}>{host.name}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.2 }}>{host.role}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                  <span style={{ fontSize: 11, color: '#1A1333' }}>⭐{host.rating}</span>
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>· Hosted {host.circles} circles</span>
                </div>
              </div>
            </div>

            {/* Joined by avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length]}, ${avatarColors[(i + 2) % avatarColors.length]}80)`,
                  border: '2px solid white',
                  marginLeft: i === 0 ? 0 : -8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 9, fontWeight: 700,
                  zIndex: 5 - i,
                  position: 'relative',
                }} />
              ))}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(109,74,255,0.1)',
                border: '2px solid white',
                marginLeft: -8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6D4AFF', fontSize: 9, fontWeight: 700,
              }}>
                +3
              </div>
              <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 8 }}>
                {meetup.attendees} joined
              </span>
            </div>

            {/* Right: spots + action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexWrap: 'wrap' }}>
              {/* Spots badge */}
              {!isFull && spotsLeft > 0 && (
                <span style={{
                  background: 'rgba(245,184,65,0.1)', color: '#D97706',
                  border: '1px solid rgba(245,184,65,0.3)',
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                }}>
                  {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                </span>
              )}

              {/* Preview button */}
              <button
                className="m-preview-btn"
                onClick={() => onPreview && onPreview(meetup)}
                style={{
                  border: '1.5px solid rgba(109,74,255,0.3)', color: '#6D4AFF',
                  background: 'transparent', borderRadius: 10,
                  padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                Preview Circle
              </button>

              {/* Bookmark */}
              <button style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(109,74,255,0.06)',
                border: 'none', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                🔖
              </button>

              {/* Join button */}
              <button
                onClick={() => onJoin(meetup.id)}
                disabled={joining === meetup.id || isFull}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: isFull ? '#F5F3FF' : 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                  color: isFull ? '#9CA3AF' : '#fff',
                  border: isFull ? '1px solid #EDE9FE' : 'none',
                  borderRadius: 10, padding: '9px 16px',
                  fontSize: 13, fontWeight: 700, cursor: isFull ? 'default' : 'pointer',
                  boxShadow: isFull ? 'none' : '0 4px 14px rgba(109,74,255,0.35)',
                  opacity: joining === meetup.id ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <span>👥</span>
                {joining === meetup.id ? 'Joining…' : isFull ? 'Circle Full' : 'Join Circle'}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT ENERGY PANEL ── */}
        {energy.length > 0 && (
          <div
            className="m-energy-panel"
            style={{
              width: 200, flexShrink: 0, marginLeft: 24,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '4px 0',
            }}
          >
            <div style={{
              fontSize: 12, fontWeight: 700, color: '#6B7280',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: 12, alignSelf: 'flex-start',
            }}>
              Current Energy
            </div>
            <EnergyChart segments={energy} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SIMPLIFIED CARD FOR REMAINING API MEETUPS ───────────────────────────────
function MeetupCard({ meetup, joining, onJoin, onPreview }) {
  const accent = meetup.accent || '#6D4AFF';
  const isFull = meetup.attendees >= meetup.max_attendees;
  const countdown = daysUntil(meetup.scheduled_time);

  return (
    <div
      className="m-hover"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(109,74,255,0.1)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(109,74,255,0.08)',
        marginBottom: 20,
      }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: `${accent}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>
            {meetup.icon || '🫂'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
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
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1F2937', margin: 0, lineHeight: 1.25 }}>
              {meetup.title}
            </h3>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
            📍 {meetup.location_name || meetup.city}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
            ⏱ {meetup.duration_minutes} min
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6B7280' }}>
            📅 {formatDate(meetup.scheduled_time)}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7, margin: '0 0 16px' }}>
          {meetup.description}
        </p>
        <div style={{ marginBottom: 16 }}>
          <SpotsBar current={meetup.attendees || 0} max={meetup.max_attendees || 8} accent={accent} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => onPreview && onPreview(meetup)}
            style={{
              padding: '10px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
              border: '1.5px solid rgba(109,74,255,0.3)', color: '#6D4AFF',
              background: 'transparent', cursor: 'pointer',
            }}
          >
            Preview
          </button>
          <button
            onClick={() => onJoin(meetup.id)}
            disabled={joining === meetup.id || isFull}
            style={{
              flex: 1, padding: '12px 20px', borderRadius: 14,
              fontSize: 13, fontWeight: 700,
              background: isFull ? '#F5F3FF' : `linear-gradient(135deg, ${accent}, ${accent}bb)`,
              color: isFull ? '#9CA3AF' : '#fff',
              border: isFull ? '1px solid #EDE9FE' : 'none',
              cursor: isFull ? 'default' : 'pointer',
              boxShadow: isFull ? 'none' : `0 4px 14px ${accent}35`,
              opacity: joining === meetup.id ? 0.7 : 1,
            }}
          >
            {joining === meetup.id ? 'Joining…' : isFull ? 'Circle Full — Join Waitlist' : '🫂  Join This Circle'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PREVIEW MODAL ───────────────────────────────────────────────────────────
function PreviewModal({ circle, onClose, onJoin, joining }) {
  if (!circle) return null;
  const steps = [
    { icon: '🌿', title: 'Opening Check-In', desc: 'Everyone shares how they\'re feeling right now' },
    { icon: '📊', title: 'Mood Poll', desc: 'Anonymous group energy check' },
    { icon: '🧘', title: 'Breathing Exercise', desc: '2-minute grounding together' },
    { icon: '💬', title: 'Sharing Round', desc: 'Each person shares at their own comfort level' },
    { icon: '🪞', title: 'Reflection', desc: 'Group insights and takeaways' },
    { icon: '🌟', title: 'Closing Intention', desc: 'A word or intention to carry forward' },
  ];
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,19,51,0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 28,
          maxWidth: 520, width: '100%',
          padding: 32, position: 'relative',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(109,74,255,0.08)',
            border: 'none', cursor: 'pointer',
            fontSize: 16, color: '#6B7280',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Header */}
        <h2 style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: 20, fontWeight: 800, color: '#1A1333',
          margin: '0 0 6px',
        }}>
          What happens inside?
        </h2>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>
          {circle.title} · {circle.duration_minutes} min
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                color: 'white', fontSize: 10, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2,
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{step.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1333' }}>{step.title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 28 }}>
          <button
            onClick={() => { onJoin(circle.id); onClose(); }}
            disabled={joining === circle.id}
            style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
              color: 'white', fontSize: 14, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(109,74,255,0.35)',
              opacity: joining === circle.id ? 0.7 : 1,
            }}
          >
            {joining === circle.id ? 'Joining…' : 'Join This Circle'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', margin: '10px 0 0' }}>
            🔒 This is a safe, anonymous space
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [filter, setFilter] = useState('all');
  const [previewCircle, setPreviewCircle] = useState(null);

  const FILTER_PILLS = [
    { id: 'all', label: 'All Circles' },
    { id: 'today', label: '⚡ Starting Today' },
    { id: 'anxiety', label: '😰 Anxiety & Stress' },
    { id: 'relationships', label: '💔 Relationships' },
    { id: 'grief', label: '🌿 Grief & Loss' },
    { id: 'spiritual', label: '✨ Spiritual Growth' },
    { id: 'burnout', label: '🔥 Burnout' },
    { id: 'mindfulness', label: '🧘 Mindfulness' },
  ];

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
      setMeetups(prev => prev.map(m =>
        m.id === meetupId ? { ...m, attendees: m.attendees + 1 } : m,
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(null);
    }
  };

  // Premium hardcoded cards (always shown)
  const PREMIUM_CARDS = [DEMO_MEETUPS[0], DEMO_MEETUPS[1]];

  // Remaining API meetups (exclude the 2 premium ones by ID)
  const premiumIds = new Set(PREMIUM_CARDS.map(c => c.id));
  const remainingMeetups = meetups.filter(m => !premiumIds.has(m.id));

  // Filter remaining
  const filteredRemaining = filter === 'all'
    ? remainingMeetups
    : remainingMeetups.filter(m => {
        if (filter === 'today') {
          const diff = new Date(m.scheduled_time) - Date.now();
          return diff >= 0 && diff < 24 * 60 * 60 * 1000;
        }
        return (m.problem_type || '').toLowerCase().includes(filter) ||
          (m.city || '').toLowerCase().includes(filter);
      });

  return (
    <>
      <style>{MEETUP_STYLES}</style>

      {/* ── PREVIEW MODAL ── */}
      {previewCircle && (
        <PreviewModal
          circle={previewCircle}
          onClose={() => setPreviewCircle(null)}
          onJoin={handleJoin}
          joining={joining}
        />
      )}

      {/* ── OUTER SHELL ── */}
      <div style={{
        display: 'flex', marginTop: 64,
        minHeight: 'calc(100vh - 64px)',
        background: '#FAF7FF',
        fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
      }}>

        {/* ══════════════════════════════════════════
            LEFT SIDEBAR
        ══════════════════════════════════════════ */}
        <div
          className="m-sidebar"
          style={{
            width: 240, background: '#FFFFFF',
            borderRight: '1px solid rgba(109,74,255,0.1)',
            position: 'sticky', top: 64,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto', flexShrink: 0,
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Logo row */}
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(109,74,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              {/* Lotus SVG */}
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <ellipse cx="13" cy="18" rx="5" ry="7" fill="#6D4AFF" opacity="0.85" transform="rotate(0,13,13)" />
                <ellipse cx="13" cy="18" rx="5" ry="7" fill="#6D4AFF" opacity="0.7" transform="rotate(60,13,13)" />
                <ellipse cx="13" cy="18" rx="5" ry="7" fill="#6D4AFF" opacity="0.7" transform="rotate(120,13,13)" />
                <ellipse cx="13" cy="18" rx="5" ry="7" fill="#A78BFA" opacity="0.6" transform="rotate(180,13,13)" />
                <ellipse cx="13" cy="18" rx="5" ry="7" fill="#A78BFA" opacity="0.6" transform="rotate(240,13,13)" />
                <ellipse cx="13" cy="18" rx="5" ry="7" fill="#A78BFA" opacity="0.6" transform="rotate(300,13,13)" />
                <circle cx="13" cy="13" r="4" fill="#F5B841" />
              </svg>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#1A1333', lineHeight: 1 }}>SoulConnect</div>
                <div style={{ fontSize: 9, color: '#6B7280', letterSpacing: '0.15em', marginTop: 2 }}>Heal · Connect · Grow</div>
              </div>
            </div>

            {/* Create / Join button */}
            <button style={{
              width: '100%',
              background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
              color: 'white', fontSize: 13, fontWeight: 700,
              borderRadius: 12, padding: '12px', border: 'none',
              boxShadow: '0 4px 16px rgba(109,74,255,0.3)',
              marginBottom: 8, cursor: 'pointer',
            }}>
              + Create / Join Circle
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ padding: '8px 8px 0' }}>
            {[
              { icon: '🔍', label: 'Discover Circles', active: true },
              { icon: '👥', label: 'My Circles', active: false },
              { icon: '📅', label: 'Upcoming Sessions', active: false },
              { icon: '🔖', label: 'Saved Circles', active: false },
              { icon: '🗺', label: 'My Journey', active: false },
            ].map((item, i) => (
              <div
                key={i}
                className="m-nav-link"
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', borderRadius: 10,
                  fontSize: 13, fontWeight: 500,
                  color: item.active ? '#6D4AFF' : '#4B5563',
                  background: item.active ? 'rgba(109,74,255,0.08)' : 'transparent',
                  borderLeft: item.active ? '3px solid #6D4AFF' : '3px solid transparent',
                  marginBottom: 2,
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Find Your Perfect Circle card */}
          <div style={{
            margin: '12px 12px 0',
            background: 'rgba(109,74,255,0.06)',
            border: '1px solid rgba(109,74,255,0.15)',
            borderRadius: 16, padding: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1333', marginBottom: 6 }}>
              Find Your Perfect Circle
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.55 }}>
              Answer a few simple questions and we'll recommend circles perfect for you.
            </div>
            <button style={{
              width: '100%', marginTop: 12,
              background: 'rgba(109,74,255,0.12)', color: '#6D4AFF',
              border: '1px solid rgba(109,74,255,0.25)', borderRadius: 10,
              padding: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              ✦ Find My Circle
            </button>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Wellness card */}
          <div style={{
            margin: 12, flexShrink: 0,
            background: 'linear-gradient(135deg, #EDE5FF, #DDD0FF)',
            borderRadius: 20, padding: '20px 16px',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#3D2B8E', lineHeight: 1.3, marginBottom: 6 }}>
                You don't have to heal alone.
              </div>
              <div style={{ fontSize: 12, color: 'rgba(61,43,142,0.7)', lineHeight: 1.5 }}>
                Real people. Real conversations. Real healing.
              </div>
            </div>
            {/* Meditation silhouette */}
            <svg
              width="70" height="70" viewBox="0 0 70 70"
              style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.8 }}
            >
              {/* Lotus petals behind */}
              <ellipse cx="35" cy="55" rx="14" ry="8" fill="rgba(167,139,250,0.4)" transform="rotate(-30,35,55)" />
              <ellipse cx="35" cy="55" rx="14" ry="8" fill="rgba(167,139,250,0.4)" />
              <ellipse cx="35" cy="55" rx="14" ry="8" fill="rgba(167,139,250,0.4)" transform="rotate(30,35,55)" />
              {/* Glow */}
              <circle cx="35" cy="38" r="14" fill="rgba(167,139,250,0.2)" />
              {/* Body: lotus legs */}
              <ellipse cx="35" cy="56" rx="14" ry="6" fill="#6D4AFF" opacity="0.6" />
              {/* Torso */}
              <rect x="29" y="38" width="12" height="18" rx="5" fill="#6D4AFF" opacity="0.6" />
              {/* Head */}
              <circle cx="35" cy="32" r="7" fill="#6D4AFF" opacity="0.6" />
              {/* Arms */}
              <path d="M29 46 Q20 50 22 56" stroke="#6D4AFF" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none" />
              <path d="M41 46 Q50 50 48 56" stroke="#6D4AFF" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none" />
            </svg>
          </div>

          {/* User profile */}
          <div style={{
            borderTop: '1px solid rgba(109,74,255,0.08)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5B841, #F97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              AS
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1333' }}>Community Host</div>
              <div style={{ fontSize: 11, color: '#6D4AFF', cursor: 'pointer' }}>View profile ›</div>
            </div>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 18, color: '#6B7280', padding: '0 4px',
            }}>
              ⋯
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MAIN CONTENT AREA
        ══════════════════════════════════════════ */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 60px' }}>

          {/* ── HERO SECTION ── */}
          <div
            className="m-anim-1"
            style={{
              marginTop: 20,
              borderRadius: 24, overflow: 'hidden',
              marginBottom: 24,
              border: '1px solid rgba(109,74,255,0.12)',
              boxShadow: '0 2px 20px rgba(109,74,255,0.08)',
              display: 'grid',
              gridTemplateColumns: '55% 45%',
              minHeight: 260,
              background: 'linear-gradient(135deg, #FFFDFE 0%, #F8F4FF 40%, #F0EAFF 100%)',
            }}
          >
            {/* Left: headline + stats */}
            <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(28px, 2.8vw, 42px)', fontWeight: 800,
                fontFamily: 'Playfair Display, Georgia, serif',
                color: '#1A1333', lineHeight: 1.15, margin: '0 0 12px',
              }}>
                You Don't Have To<br />Heal Alone
              </h1>
              <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 420, lineHeight: 1.6, margin: '0 0 28px' }}>
                Join small, safe circles of people who understand exactly what you're going through.
              </p>
              {/* Stats row */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { icon: '👥', value: '1,247', label: 'Active members today' },
                  { icon: '🌍', value: '87', label: 'Circles this week' },
                  { icon: '💜', value: '14,000+', label: 'Conversations shared' },
                ].map((stat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(109,74,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}>
                      {stat.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1333', lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: community circle illustration */}
            <div style={{
              background: 'linear-gradient(160deg, #EDE5FF 0%, #DDD0FF 40%, #C4B5FD 60%, #F0EAFF 100%)',
              position: 'relative', overflow: 'hidden',
            }}>
              <svg viewBox="0 0 500 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
                {/* Mandala rings */}
                {[30, 60, 90, 120, 150, 180].map((r, i) => (
                  <circle key={i} cx="250" cy="140" r={r} fill="none" stroke="rgba(109,74,255,0.15)" strokeWidth="1" />
                ))}
                {/* Spokes */}
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i * 30) * Math.PI / 180;
                  return (
                    <line key={i}
                      x1="250" y1="140"
                      x2={250 + 180 * Math.cos(angle)}
                      y2={140 + 180 * Math.sin(angle)}
                      stroke="rgba(109,74,255,0.1)" strokeWidth="1"
                    />
                  );
                })}
                {/* Radial glow ellipse */}
                <ellipse cx="250" cy="155" rx="100" ry="60"
                  fill="rgba(255,220,180,0.35)" />

                {/* Figure 1 — left (lotus position) */}
                <g transform="translate(175, 148)">
                  {/* Legs ellipse */}
                  <ellipse cx="0" cy="20" rx="18" ry="9" fill="#3D2B8E" opacity="0.85" />
                  {/* Torso */}
                  <rect x="-8" y="4" width="16" height="18" rx="6" fill="#3D2B8E" opacity="0.85" />
                  {/* Head */}
                  <circle cx="0" cy="-2" r="9" fill="#3D2B8E" opacity="0.85" />
                  {/* Arms */}
                  <path d="M-8 14 Q-18 18 -16 24" stroke="#3D2B8E" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
                  <path d="M8 14 Q18 18 16 24" stroke="#3D2B8E" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
                </g>

                {/* Figure 2 — center (slightly taller, hair bun) */}
                <g transform="translate(250, 110)">
                  {/* Legs */}
                  <ellipse cx="0" cy="26" rx="20" ry="10" fill="#3D2B8E" opacity="0.9" />
                  {/* Torso */}
                  <rect x="-9" y="6" width="18" height="22" rx="7" fill="#3D2B8E" opacity="0.9" />
                  {/* Head */}
                  <circle cx="0" cy="0" r="10" fill="#3D2B8E" opacity="0.9" />
                  {/* Hair bun */}
                  <circle cx="0" cy="-10" r="5" fill="#3D2B8E" opacity="0.75" />
                  {/* Arms */}
                  <path d="M-9 18 Q-20 22 -18 28" stroke="#3D2B8E" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
                  <path d="M9 18 Q20 22 18 28" stroke="#3D2B8E" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
                </g>

                {/* Figure 3 — right (mirror of figure 1) */}
                <g transform="translate(325, 148)">
                  <ellipse cx="0" cy="20" rx="18" ry="9" fill="#3D2B8E" opacity="0.85" />
                  <rect x="-8" y="4" width="16" height="18" rx="6" fill="#3D2B8E" opacity="0.85" />
                  <circle cx="0" cy="-2" r="9" fill="#3D2B8E" opacity="0.85" />
                  <path d="M-8 14 Q-18 18 -16 24" stroke="#3D2B8E" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
                  <path d="M8 14 Q18 18 16 24" stroke="#3D2B8E" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
                </g>

                {/* Lotus petals at base */}
                {[-40, -20, 0, 20, 40].map((offset, i) => (
                  <ellipse key={i} cx={250 + offset} cy="240" rx="16" ry="22"
                    fill="rgba(196,181,253,0.3)"
                    transform={`rotate(${offset * 1.5}, ${250 + offset}, 240)`} />
                ))}

                {/* Golden particle dots */}
                {[
                  [140, 80], [340, 70], [200, 50], [300, 95], [160, 170],
                  [370, 160], [220, 210], [280, 215], [130, 130], [380, 100],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#F5B841"
                    opacity="0.7"
                    style={{ animation: `mFloat ${2 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                  />
                ))}

                {/* Bottom glow */}
                <ellipse cx="250" cy="260" rx="200" ry="40" fill="rgba(196,181,253,0.25)" />
              </svg>
            </div>
          </div>

          {/* ── CATEGORY FILTER BAR ── */}
          <div
            className="m-anim-2"
            style={{
              marginBottom: 20,
              position: 'sticky', top: 64,
              background: 'rgba(250,247,255,0.97)',
              backdropFilter: 'blur(12px)',
              padding: '12px 0',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center' }}>
              {FILTER_PILLS.map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setFilter(pill.id)}
                  style={{
                    flexShrink: 0,
                    padding: '8px 18px', borderRadius: 50,
                    fontSize: 13, fontWeight: 600,
                    whiteSpace: 'nowrap', cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: filter === pill.id ? '#6D4AFF' : 'white',
                    color: filter === pill.id ? 'white' : '#4B5563',
                    border: filter === pill.id ? '1.5px solid #6D4AFF' : '1.5px solid rgba(109,74,255,0.2)',
                  }}
                >
                  {pill.label}
                </button>
              ))}
              <button style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                background: 'white', border: '1.5px solid rgba(109,74,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, cursor: 'pointer', color: '#6B7280',
              }}>
                ›
              </button>
            </div>
          </div>

          {/* ── LOADING STATE ── */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[1, 2].map(i => (
                <div key={i} style={{
                  borderRadius: 24, height: 260, background: '#FFFFFF',
                  border: '1px solid rgba(109,74,255,0.1)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
              ))}
            </div>
          ) : (
            <div className="m-anim-3">
              {/* ── PREMIUM HARDCODED CARDS ── */}
              {PREMIUM_CARDS.map(card => (
                <PremiumCircleCard
                  key={card.id}
                  meetup={card}
                  joining={joining}
                  onJoin={handleJoin}
                  onPreview={setPreviewCircle}
                />
              ))}

              {/* ── REMAINING API MEETUPS ── */}
              {filteredRemaining.map(meetup => (
                <MeetupCard
                  key={meetup.id}
                  meetup={meetup}
                  joining={joining}
                  onJoin={handleJoin}
                  onPreview={setPreviewCircle}
                />
              ))}

              {filteredRemaining.length === 0 && PREMIUM_CARDS.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
                  <p style={{ color: '#9CA3AF', fontSize: 14 }}>No circles found for this filter yet.</p>
                </div>
              )}
            </div>
          )}

          {/* ── TRUST SECTION ── */}
          <div style={{
            marginTop: 8, marginBottom: 24,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          }}>
            {[
              { icon: '🛡', title: '100% Anonymous', desc: 'Your privacy is always protected' },
              { icon: '👥', title: 'Trained Hosts', desc: 'Led by experienced facilitators' },
              { icon: '🔒', title: 'Safe & Secure', desc: 'A space of trust, respect and kindness' },
              { icon: '💜', title: 'Everyone Welcome', desc: 'All emotions. All stories. All hearts.' },
            ].map((item, i) => (
              <div
                key={i}
                className="m-hover"
                style={{
                  background: 'white', borderRadius: 16,
                  border: '1px solid rgba(109,74,255,0.1)',
                  padding: 16, textAlign: 'center',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(109,74,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, margin: '0 auto 10px',
                }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1333', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT SIDEBAR
        ══════════════════════════════════════════ */}
        <div
          className="m-right-sidebar"
          style={{
            width: 280, flexShrink: 0,
            padding: '20px 16px',
            background: 'transparent',
          }}
        >
          <div style={{ position: 'sticky', top: 84 }}>

            {/* Card 1 — How Circles Work */}
            <div style={{
              background: 'white', borderRadius: 20,
              border: '1px solid rgba(109,74,255,0.1)',
              padding: 20, marginBottom: 16,
              boxShadow: '0 2px 16px rgba(109,74,255,0.07)',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1333', marginBottom: 4 }}>
                How Circles Work
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14 }}>Simple. Safe. Meaningful.</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '👥', title: 'Join a small group', desc: '6–15 people in a circle' },
                  { icon: '🎯', title: 'Guided by trained hosts', desc: 'Safe, supportive & judgment-free' },
                  { icon: '💜', title: 'Share, listen, heal', desc: 'At your own pace' },
                  { icon: '🌟', title: 'Leave feeling lighter', desc: 'You\'re not alone' },
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(109,74,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, flexShrink: 0,
                    }}>
                      {step.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1333', lineHeight: 1.2 }}>{step.title}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, fontSize: 13, color: '#6D4AFF', fontWeight: 600, cursor: 'pointer' }}>
                Learn more →
              </div>
            </div>

            {/* Card 2 — Testimonial */}
            <div style={{
              background: 'white', borderRadius: 20,
              border: '1px solid rgba(109,74,255,0.1)',
              padding: 20, marginBottom: 16,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 6 }}>
                Real People. Real Impact.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13 }}>⭐⭐⭐⭐⭐</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>4.9 (1,247 reviews)</span>
              </div>
              <div style={{ position: 'relative', paddingLeft: 4 }}>
                <span style={{
                  fontSize: 36, lineHeight: 1, color: '#A78BFA',
                  fontFamily: 'Georgia, serif', display: 'block', marginBottom: -10,
                }}>
                  "
                </span>
                <p style={{
                  fontSize: 14, color: '#4B5563',
                  fontStyle: 'italic', lineHeight: 1.7,
                  margin: '0 0 16px',
                }}>
                  I felt understood for the first time in a long time. This circle changed me.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #34C38F, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 12, fontWeight: 700,
                  }}>
                    N
                  </div>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Neha, Circle Member</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['‹', '›'].map((arrow, i) => (
                    <button key={i} style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(109,74,255,0.08)',
                      border: 'none', cursor: 'pointer',
                      fontSize: 14, color: '#6D4AFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {arrow}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3 — Crisis Support */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(244,114,182,0.06), rgba(255,200,210,0.08))',
              border: '1px solid rgba(244,114,182,0.2)',
              borderRadius: 20, padding: 18,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#BE185D', marginBottom: 6 }}>
                Need Immediate Support?
              </div>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 6px', lineHeight: 1.55 }}>
                If you're in emotional distress, help is available.
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 14px', lineHeight: 1.55 }}>
                You are not alone. We are here for you.
              </p>
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F472B6, #EC4899)',
                color: 'white', fontSize: 13, fontWeight: 700,
                borderRadius: 12, padding: 10, border: 'none', cursor: 'pointer',
              }}>
                📞 View Crisis Resources
              </button>
            </div>

          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
