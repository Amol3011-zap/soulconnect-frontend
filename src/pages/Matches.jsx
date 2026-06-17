import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { useAuthStore } from '../store/auth';

// ── Data ─────────────────────────────────────────────────────────────────────

const DEMO_MATCHES = [
  { id: 101, name: 'Priya', age: 26, city: 'Mumbai', isDemo: true,
    primary_problem: 'anxiety', match_score: 94,
    match_reason: 'Both navigating social anxiety and overthinking spirals',
    secondary_problems: ['panic_attacks', 'sleep_problems'], avatar_color: '#8B5CF6' },
  { id: 102, name: 'Rohan', age: 29, city: 'Pune', isDemo: true,
    primary_problem: 'depression', match_score: 88,
    match_reason: 'Similar experiences with low motivation and isolation',
    secondary_problems: ['loneliness'], avatar_color: '#0EA5E9' },
  { id: 103, name: 'Aisha', age: 24, city: 'Bangalore', isDemo: true,
    primary_problem: 'loneliness', match_score: 82,
    match_reason: 'Both dealing with loneliness after a big life change',
    secondary_problems: ['lack_of_confidence'], avatar_color: '#10B981' },
  { id: 104, name: 'Dev', age: 31, city: 'Delhi', isDemo: true,
    primary_problem: 'work_career_stress', match_score: 79,
    match_reason: 'Both burned out from high-pressure work environments',
    secondary_problems: ['sleep_problems', 'anxiety'], avatar_color: '#F59E0B' },
];

const PROBLEM_META = {
  anxiety:               { label: 'Anxiety',       icon: '🌀', bg: '#F5F3FF', color: '#7C3AED' },
  depression:            { label: 'Depression',    icon: '💙', bg: '#EFF6FF', color: '#2563EB' },
  loneliness:            { label: 'Loneliness',    icon: '🕊️', bg: '#FAF5FF', color: '#9333EA' },
  work_career_stress:    { label: 'Work Stress',   icon: '⚡', bg: '#FFFBEB', color: '#D97706' },
  ptsd_trauma:           { label: 'Trauma',        icon: '🌿', bg: '#F0FDF4', color: '#059669' },
  grief_loss:            { label: 'Grief',         icon: '🕯️', bg: '#F8FAFC', color: '#475569' },
  relationship_breakup:  { label: 'Breakup',       icon: '💔', bg: '#FFF1F2', color: '#F43F5E' },
  panic_attacks:         { label: 'Panic Attacks', icon: '💓', bg: '#FDF2F8', color: '#EC4899' },
  ocd_intrusive_thoughts:{ label: 'OCD',           icon: '🔄', bg: '#EFF6FF', color: '#3B82F6' },
  lack_of_confidence:    { label: 'Confidence',    icon: '🌱', bg: '#F0FDF4', color: '#16A34A' },
  sleep_problems:        { label: 'Sleep',         icon: '🌙', bg: '#F5F3FF', color: '#7C3AED' },
  anger_management:      { label: 'Anger',         icon: '🔥', bg: '#FEF2F2', color: '#DC2626' },
  financial_stress:      { label: 'Financial',     icon: '💸', bg: '#FEFCE8', color: '#CA8A04' },
  marriage_problems:     { label: 'Marriage',      icon: '💑', bg: '#FAF5FF', color: '#9333EA' },
  family_relationships:  { label: 'Family',        icon: '🏡', bg: '#F0FDF4', color: '#059669' },
  trust_issues:          { label: 'Trust Issues',  icon: '🤝', bg: '#EFF6FF', color: '#2563EB' },
};

const DAILY_AFFIRMATIONS = [
  "I trust the timing of my life.",
  "I am worthy of deep, healing connection.",
  "Peace lives within me — I return to it now.",
  "My healing is sacred, and I honor every step.",
  "I am safe. I am loved. I belong here.",
  "Every breath I take is an act of self-love.",
  "I release what no longer serves my highest good.",
];

const QUOTES = [
  { text: "Peace comes from within.\nYou do not find it outside.", author: "Buddha" },
  { text: "You yourself deserve your love and affection\nas much as anybody in the entire universe.", author: "Buddha" },
  { text: "The present moment is the door to all moments.\nStep through it with courage.", author: "Thich Nhất Hạnh" },
  { text: "In the middle of difficulty\nlies opportunity to grow.", author: "Rumi" },
  { text: "Your task is not to seek for love,\nbut to find the barriers within yourself.", author: "Rumi" },
];

// ── Illustrations ─────────────────────────────────────────────────────────────

const HERO_PHOTO = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80';

function GoldenMandala() {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true"
      style={{ position: 'absolute', right: -10, top: -10, width: 260, height: 260, opacity: 0.82 }}>
      <defs>
        <linearGradient id="gGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>

      {/* Outer rings */}
      <circle cx="120" cy="120" r="108" fill="none" stroke="url(#gGold)" strokeWidth="0.6" opacity="0.55" />
      <circle cx="120" cy="120" r="92"  fill="none" stroke="url(#gGold)" strokeWidth="0.4" opacity="0.45" strokeDasharray="3 6" />

      {/* 12 outer dots */}
      {Array.from({length:12}, (_,i) => {
        const a = i * 30 * Math.PI / 180;
        return <circle key={i} cx={120 + 108*Math.cos(a)} cy={120 + 108*Math.sin(a)} r="2.8" fill="url(#gGold)" opacity="0.75" />;
      })}

      {/* Flower of life — 6 petals + center */}
      {[0,60,120,180,240,300].map((deg,i) => {
        const a = deg * Math.PI / 180;
        return <circle key={i} cx={120 + 42*Math.cos(a)} cy={120 + 42*Math.sin(a)} r="42" fill="none" stroke="url(#gGold)" strokeWidth="0.9" opacity="0.62" />;
      })}
      <circle cx="120" cy="120" r="42" fill="none" stroke="url(#gGold)" strokeWidth="0.9" opacity="0.62" />

      {/* Radial lines */}
      {[0,30,60,90,120,150].map((deg,i) => {
        const a = deg * Math.PI / 180;
        return (
          <line key={i}
            x1={120 - 86*Math.cos(a)} y1={120 - 86*Math.sin(a)}
            x2={120 + 86*Math.cos(a)} y2={120 + 86*Math.sin(a)}
            stroke="url(#gGold)" strokeWidth="0.45" opacity="0.38" />
        );
      })}

      {/* Inner circles */}
      <circle cx="120" cy="120" r="22" fill="none" stroke="url(#gGold)" strokeWidth="1.3" opacity="0.88" />
      <circle cx="120" cy="120" r="9"  fill="url(#gGold)" opacity="0.65" />
      <circle cx="120" cy="120" r="3.5" fill="white" opacity="0.9" />

      {/* 8 inner dots */}
      {Array.from({length:8}, (_,i) => {
        const a = i * 45 * Math.PI / 180;
        return <circle key={i} cx={120 + 22*Math.cos(a)} cy={120 + 22*Math.sin(a)} r="1.5" fill="url(#gGold)" opacity="0.8" />;
      })}
    </svg>
  );
}

function ZenStones() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" style={{ width: 170, height: 170, flexShrink: 0 }}>
      {/* Glow behind */}
      <ellipse cx="100" cy="168" rx="72" ry="18" fill="rgba(186,230,253,0.35)" />

      {/* Stone 5 — base (widest) */}
      <ellipse cx="100" cy="155" rx="55" ry="24" fill="#94A3B8" />
      <ellipse cx="97"  cy="145" rx="53" ry="15" fill="#CBD5E1" opacity="0.6" />

      {/* Stone 4 */}
      <ellipse cx="100" cy="120" rx="42" ry="20" fill="#7B91B0" />
      <ellipse cx="97"  cy="111" rx="40" ry="12" fill="#93B4D0" opacity="0.6" />

      {/* Stone 3 */}
      <ellipse cx="100" cy="88" rx="32" ry="17" fill="#8B8FC4" />
      <ellipse cx="98"  cy="79" rx="30" ry="11" fill="#A5A9D8" opacity="0.6" />

      {/* Stone 2 */}
      <ellipse cx="100" cy="60" rx="23" ry="13" fill="#7C6FE8" />
      <ellipse cx="98"  cy="53" rx="22" ry="8"  fill="#9C91F0" opacity="0.6" />

      {/* Stone 1 — top */}
      <ellipse cx="100" cy="43" rx="13" ry="8" fill="#6D5EF5" opacity="0.85" />

      {/* Left leaf */}
      <path d="M50,92 Q28,74 34,46 Q48,64 50,92 Z" fill="rgba(110,231,183,0.62)" />
      <line x1="50" y1="92" x2="36" y2="56" stroke="rgba(5,150,105,0.45)" strokeWidth="0.9" />
      {/* Small left leaf */}
      <path d="M62,158 Q52,143 62,127 Q65,143 62,158 Z" fill="rgba(167,243,208,0.48)" />

      {/* Right leaf */}
      <path d="M150,87 Q172,69 166,41 Q152,59 150,87 Z" fill="rgba(110,231,183,0.62)" />
      <line x1="150" y1="87" x2="164" y2="51" stroke="rgba(5,150,105,0.45)" strokeWidth="0.9" />
      {/* Small right leaf */}
      <path d="M138,158 Q148,143 138,127 Q135,143 138,158 Z" fill="rgba(167,243,208,0.48)" />

      {/* Water ripples */}
      <ellipse cx="100" cy="170" rx="58" ry="9" fill="none" stroke="rgba(147,197,253,0.45)" strokeWidth="0.9" />
      <ellipse cx="100" cy="174" rx="70" ry="11" fill="none" stroke="rgba(147,197,253,0.28)" strokeWidth="0.7" />
    </svg>
  );
}

function LotusIcon({ size = 18, color = '#8B5CF6' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"
      style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12,21 C12,21 4,16 4,10 C4,7 7,5 10,6.3 C11,4 13,4 14,6.3 C17,5 20,7 20,10 C20,16 12,21 12,21 Z"
        fill={`${color}22`} stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12,21 C12,21 8,14.5 8,10 C8,8 10,7 12,8.2 C14,7 16,8 16,10 C16,14.5 12,21 12,21 Z"
        fill={`${color}35`} stroke={color} strokeWidth="0.9" strokeLinejoin="round" />
      <line x1="12" y1="21" x2="12" y2="8" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// ── CompatRing ────────────────────────────────────────────────────────────────
function CompatRing({ score, color }) {
  const r = 18, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 46, height: 46, flexShrink: 0 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 46 46">
        <circle cx="23" cy="23" r={r} fill="none" stroke="#F0EEFF" strokeWidth="3.2" />
        <circle cx="23" cy="23" r={r} fill="none" stroke={color || '#8B5CF6'} strokeWidth="3.2"
          strokeDasharray={`${circ * Math.min(score / 100, 1)} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: color || '#8B5CF6', lineHeight: 1 }}>{score}%</span>
      </div>
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, sublabel, iconBg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: '#FFFFFF', borderRadius: 20, padding: '22px 22px 18px',
        boxShadow: hovered ? '0 10px 36px rgba(0,0,0,0.09)' : '0 2px 18px rgba(0,0,0,0.05)',
        flex: 1, minWidth: 0,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: iconBg || '#F5F3FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, marginBottom: 14,
      }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#1A1F36', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{sublabel}</div>
    </div>
  );
}

// ── MatchCard ─────────────────────────────────────────────────────────────────
function MatchCard({ match, onConnect, connecting }) {
  const prob = PROBLEM_META[match.primary_problem] || { label: 'Peer Support', icon: '🤝', bg: '#F5F3FF', color: '#8B5CF6' };
  const isConnecting = connecting === match.id;
  const initial = match.name?.[0]?.toUpperCase() || '?';
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: '#FFFFFF', borderRadius: 20, overflow: 'hidden',
        boxShadow: hovered ? '0 14px 44px rgba(0,0,0,0.09)' : '0 2px 18px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.24s ease, box-shadow 0.24s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Soft top accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${match.avatar_color}, ${match.avatar_color}70)` }} />

      <div style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>

          {/* Avatar — rounded square */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: `linear-gradient(135deg, ${match.avatar_color}, ${match.avatar_color}90)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: '#fff',
            }}>{initial}</div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 13, height: 13, borderRadius: '50%',
              background: '#10B981', border: '2.5px solid #fff',
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 5px', fontSize: 16, fontWeight: 700, color: '#1A1F36' }}>{match.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {match.age && <span style={{ fontSize: 12, color: '#9CA3AF' }}>{match.age} yrs</span>}
              {match.city && (
                <>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#E5E7EB', display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>{match.city}</span>
                </>
              )}
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#E5E7EB', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: '#10B981', fontWeight: 500 }}>● Online now</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <CompatRing score={match.match_score} color={match.avatar_color} />
            <div style={{ fontSize: 9, color: '#C4B5FD', fontWeight: 600, letterSpacing: '0.06em', marginTop: 2, textTransform: 'uppercase' }}>match</div>
          </div>
        </div>

        {match.match_reason && (
          <p style={{
            margin: '0 0 14px', fontSize: 13, fontStyle: 'italic',
            color: '#6B7280', lineHeight: 1.75,
            padding: '10px 14px', borderRadius: 12,
            background: '#FAFAFF',
          }}>
            "{match.match_reason}"
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: prob.bg, color: prob.color,
          }}>{prob.icon} {prob.label}</span>
          {(match.secondary_problems || []).slice(0, 2).map(p => {
            const info = PROBLEM_META[p];
            return info ? (
              <span key={p} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', borderRadius: 20, fontSize: 11,
                background: '#F8F9FC', color: '#9CA3AF',
              }}>{info.icon} {info.label}</span>
            ) : null;
          })}
        </div>

        <button
          onClick={() => onConnect(match)}
          disabled={isConnecting}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: 14,
            fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
            background: isConnecting
              ? '#F8F9FC'
              : `linear-gradient(135deg, ${match.avatar_color}, ${match.avatar_color}CC)`,
            color: isConnecting ? '#9CA3AF' : '#fff',
            border: 'none', cursor: isConnecting ? 'default' : 'pointer',
            boxShadow: isConnecting ? 'none' : `0 5px 18px ${match.avatar_color}40`,
            transition: 'all 0.2s ease',
          }}
        >
          {isConnecting ? 'Connecting…' : '💫  Connect Soul'}
        </button>
      </div>
    </div>
  );
}

// ── Featured Support Circle ────────────────────────────────────────────────────
function FeaturedCircle() {
  const navigate = useNavigate();
  const AVATAR_COLORS = ['#8B5CF6','#10B981','#F59E0B','#0EA5E9','#EC4899'];
  const INITIALS      = ['P','R','A','D','S'];
  const now = new Date();
  const timeLabel = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();

  return (
    <div style={{
      background: 'linear-gradient(140deg, #EDF5FF 0%, #E8F0FF 40%, #EEF1FF 100%)',
      borderRadius: 24, padding: '36px 40px',
      boxShadow: '0 4px 32px rgba(99,102,241,0.08)',
      display: 'flex', gap: 32, alignItems: 'center',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Subtle orb */}
      <div style={{
        position: 'absolute', bottom: -60, left: '40%',
        width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left content */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>

        {/* TODAY tag — matches reference */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px', borderRadius: 20,
          background: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(139,92,246,0.2)',
          marginBottom: 18,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', letterSpacing: '0.06em' }}>
            TODAY · {timeLabel}
          </span>
        </div>

        <h3 style={{
          fontSize: 24, fontWeight: 800, color: '#111827',
          margin: '0 0 14px', letterSpacing: '-0.02em',
          fontFamily: '"Playfair Display", Georgia, serif',
        }}>Anxiety Support Circle</h3>

        {/* Participant avatars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ display: 'flex' }}>
            {AVATAR_COLORS.slice(0, 3).map((c, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, ${c}, ${c}AA)`,
                border: '2.5px solid white',
                marginLeft: i > 0 ? -10 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}>{INITIALS[i]}</div>
            ))}
          </div>
          <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>+5 others healing together</span>
        </div>

        <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.75, margin: '0 0 20px', maxWidth: 380 }}>
          A safe space to share, breathe, and heal together.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 15 }}>⏱</span>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>60 min</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 15 }}>👥</span>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>8 / 12 joined</span>
          </div>
        </div>

        {/* Outlined button — matches reference */}
        <button
          onClick={() => navigate('/groups')}
          style={{
            padding: '12px 32px', borderRadius: 14, fontSize: 13, fontWeight: 700,
            background: '#FFFFFF',
            color: '#374151',
            border: '1.5px solid #D1D5DB',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
        >
          Join Circle
        </button>
      </div>

      {/* Right: Zen stones illustration */}
      <div className="hidden md:flex" style={{ flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
        <ZenStones />
      </div>
    </div>
  );
}

// ── SuggestedCard ─────────────────────────────────────────────────────────────
function SuggestedCard({ title, date, time, participants, icon, iconBg, iconColor, buttonColor }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: '#FFFFFF', borderRadius: 20, padding: '22px',
        boxShadow: hovered ? '0 12px 36px rgba(0,0,0,0.09)' : '0 2px 16px rgba(0,0,0,0.05)',
        flex: 1, minWidth: 0,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 14,
        background: iconBg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 22, marginBottom: 16,
      }}>{icon}</div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1A1F36', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
        {title}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>📅 {date}</span>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>🕐 {time}</span>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>👥 {participants}</span>
      </div>

      <button
        onClick={() => navigate('/meetups')}
        style={{
          width: '100%', padding: '11px 16px', borderRadius: 12,
          fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
          background: iconBg, color: iconColor || buttonColor,
          transition: 'opacity 0.18s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Reserve Spot
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Matches() {
  const [matches, setMatches]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [toast, setToast]           = useState(null);
  const navigate                    = useNavigate();
  const { user }                    = useAuthStore();

  // Inject Playfair Display
  useEffect(() => {
    if (!document.getElementById('sc-playfair')) {
      const link = document.createElement('link');
      link.id   = 'sc-playfair';
      link.rel  = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => { fetchMatches(); }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res  = await matchAPI.findMatches();
      const real = res.data.matches || [];
      setMatches(real.length > 0 ? real : DEMO_MATCHES);
    } catch {
      setMatches(DEMO_MATCHES);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (match) => {
    setConnecting(match.id);
    if (match.isDemo) {
      setTimeout(() => navigate('/chat', { state: { matchId: match.id } }), 500);
      return;
    }
    try {
      const res    = await matchAPI.acceptMatch(match.id);
      const chatId = res.data?.match_id || match.id;
      showToast('Connected! Opening chat…');
      setTimeout(() => navigate(`/chat/${chatId}`), 900);
    } catch {
      showToast('Could not connect. Try again.');
      setConnecting(null);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const today     = new Date();
  const hour      = today.getHours();
  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const greeting  = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const quote     = QUOTES[today.getDate() % QUOTES.length];
  const affirmation = DAILY_AFFIRMATIONS[today.getDate() % DAILY_AFFIRMATIONS.length];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FC', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Global styles */}
      <style>{`
        @keyframes scFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sc-fade { animation: scFadeUp 0.45s ease both; }
        .sc-fade-2 { animation: scFadeUp 0.45s 0.08s ease both; }
        .sc-fade-3 { animation: scFadeUp 0.45s 0.16s ease both; }
        .sc-fade-4 { animation: scFadeUp 0.45s 0.24s ease both; }
        .sc-fade-5 { animation: scFadeUp 0.45s 0.32s ease both; }
        .sc-fade-6 { animation: scFadeUp 0.45s 0.40s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .sc-fade, .sc-fade-2, .sc-fade-3, .sc-fade-4, .sc-fade-5, .sc-fade-6 { animation: none; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, padding: '12px 28px',
          background: '#1A1F36', borderRadius: 14, color: '#fff',
          fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          letterSpacing: '0.01em',
        }}>{toast}</div>
      )}

      {/* ── 1. HERO CARD — full width ────────────────────────────────────── */}
      <div className="sc-fade" style={{
        position: 'relative', height: 200,
        backgroundImage: `url(${HERO_PHOTO})`,
        backgroundSize: 'cover', backgroundPosition: 'center 60%',
        marginBottom: 0,
        overflow: 'hidden',
      }}>
        {/* Soft left-to-right frosted overlay so text is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(255,251,255,0.88) 0%, rgba(255,251,255,0.62) 45%, rgba(255,251,255,0.15) 72%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Text — left, centred in max-width container */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 36px' }}>
            <div style={{ maxWidth: 430 }}>
              <p style={{ margin: '0 0 7px', fontSize: 11, fontWeight: 700, color: '#7C5CBF', letterSpacing: '0.13em', textTransform: 'uppercase' }}>
                {greeting}, {firstName} 🙏
              </p>
              <p style={{
                margin: '0 0 9px',
                fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                fontSize: 'clamp(16px, 1.8vw, 21px)',
                fontStyle: 'italic', color: '#1E1B4B', lineHeight: 1.6,
                whiteSpace: 'pre-line',
              }}>
                {quote.text}
              </p>
              <p style={{
                margin: 0,
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 13, color: '#7C5CBF', fontWeight: 600,
              }}>
                — {quote.author}
              </p>
            </div>
          </div>
        </div>

        {/* Sacred geometry mandala — right */}
        <div style={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}>
          <GoldenMandala />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 100px' }}>

        {/* ── 2. STATS ROW ─────────────────────────────────────────────────── */}
        <div className="sc-fade-2" style={{ display: 'flex', gap: 14, marginBottom: 36, overflowX: 'auto', paddingBottom: 4 }}>
          <StatCard icon="🫂" value="8"  label="Circles Joined"     sublabel="Keep showing up"    iconBg="#EDE9FE" />
          <StatCard icon="✨" value="24" label="People Connected"   sublabel="Beautiful souls"    iconBg="#DBEAFE" />
          <StatCard icon="🧘" value="12" label="Sessions Attended"  sublabel="You're growing"     iconBg="#D1FAE5" />
          <StatCard icon="🌱" value="27" label="Days on Journey"    sublabel="Keep going"         iconBg="#FED7AA" />
        </div>

        {/* ── 3. CONTINUE YOUR JOURNEY ─────────────────────────────────────── */}
        <div className="sc-fade-3" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
            <LotusIcon size={20} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1F36', margin: 0, letterSpacing: '-0.02em',
              fontFamily: '"Playfair Display", Georgia, serif' }}>
              Continue your journey
            </h2>
          </div>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 22px 29px' }}>A healing space waiting for your return</p>
        </div>

        {/* ── 4. FEATURED SUPPORT CIRCLE ───────────────────────────────────── */}
        <div className="sc-fade-3" style={{ marginBottom: 36 }}>
          <FeaturedCircle />
        </div>

        {/* ── 5. SUGGESTED FOR YOU ─────────────────────────────────────────── */}
        <div className="sc-fade-4" style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <LotusIcon size={18} color="#F59E0B" />
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1F36', margin: 0, letterSpacing: '-0.01em' }}>
                  Suggested for you
                </h2>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>Curated healing experiences</p>
              </div>
            </div>
            <Link to="/meetups" style={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6', textDecoration: 'none',
              padding: '6px 14px', borderRadius: 10, background: '#F5F3FF', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#EDE9FE'}
              onMouseLeave={e => e.currentTarget.style.background = '#F5F3FF'}
            >
              See all →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <SuggestedCard
              title="Letting Go Workshop"
              date="Sat, Jun 21"
              time="10:00 AM IST"
              participants="14 / 20 joined"
              icon="🍂"
              iconBg="#FFF7ED"
              iconColor="#D97706"
            />
            <SuggestedCard
              title="Self Love Circle"
              date="Sun, Jun 22"
              time="6:00 PM IST"
              participants="8 / 15 joined"
              icon="💗"
              iconBg="#FDF2F8"
              iconColor="#EC4899"
            />
            <SuggestedCard
              title="Forgiveness Healing"
              date="Mon, Jun 23"
              time="7:30 PM IST"
              participants="6 / 12 joined"
              icon="🌸"
              iconBg="#F5F3FF"
              iconColor="#8B5CF6"
            />
          </div>
        </div>

        {/* ── 6. DAILY AFFIRMATION ─────────────────────────────────────────── */}
        <div className="sc-fade-5" style={{
          background: 'linear-gradient(135deg, #EAF3FF 0%, #E6EEFF 55%, #EEF2FF 100%)',
          borderRadius: 24, padding: '36px 40px',
          marginBottom: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          boxShadow: '0 4px 22px rgba(99,102,241,0.07)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Soft orb decoration */}
          <div style={{
            position: 'absolute', right: 60, top: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.13em', textTransform: 'uppercase' }}>
              ✦ Affirmation for you
            </p>
            <p style={{
              margin: '0 0 24px',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(20px, 2.2vw, 28px)',
              color: '#1A1F36', fontStyle: 'italic', lineHeight: 1.45, fontWeight: 600,
            }}>
              "{affirmation}"
            </p>
            <button
              style={{
                padding: '13px 30px', borderRadius: 14, fontSize: 13, fontWeight: 700,
                background: 'linear-gradient(135deg, #8B5CF6, #6D5EF5)',
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 6px 22px rgba(139,92,246,0.3)',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(139,92,246,0.38)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(139,92,246,0.3)'; }}
            >
              🔁 Repeat Today
            </button>
          </div>

          <div style={{ fontSize: 80, flexShrink: 0, opacity: 0.55, position: 'relative', zIndex: 1 }}>🪷</div>
        </div>

        {/* ── 7. SOUL MATCHES ──────────────────────────────────────────────── */}
        <div className="sc-fade-6">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <LotusIcon size={20} color="#10B981" />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1F36', margin: 0, letterSpacing: '-0.02em',
                fontFamily: '"Playfair Display", Georgia, serif' }}>
                Your Soul Matches
              </h2>
            </div>
            <div style={{
              padding: '5px 16px', borderRadius: 20,
              background: '#F0FDF4', fontSize: 12, fontWeight: 700, color: '#10B981',
            }}>
              {matches.length} matched
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 22px 29px' }}>
            Kindred spirits who truly understand your journey
          </p>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  height: 190, borderRadius: 20,
                  background: 'linear-gradient(90deg, #f0f0f5 25%, #f8f8fc 50%, #f0f0f5 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.6s ease-in-out infinite',
                }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {matches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onConnect={handleConnect}
                  connecting={connecting}
                />
              ))}

              {/* Privacy note */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 18px', borderRadius: 16,
                background: '#FAFAFF',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
                <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF', lineHeight: 1.65 }}>
                  All matches are completely anonymous. Your personal details are never shared with anyone.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
