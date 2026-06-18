import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

// ── Static Data (preserved) ───────────────────────────────────────────────────
const QUOTES = [
  { text: "Small moments of peace create lasting transformation.", author: "Thich Nhất Hạnh" },
  { text: "You yourself deserve love as much as anybody in the entire universe.", author: "Buddha" },
  { text: "The present moment is the only door to healing.", author: "Eckhart Tolle" },
  { text: "Within you, there is a stillness and a sanctuary.", author: "Hermann Hesse" },
  { text: "Your healing is not linear. Honor every step.", author: "Unknown" },
  { text: "What you seek is seeking you.", author: "Rumi" },
  { text: "Healing takes courage, and we all have courage.", author: "Tori Amos" },
];

const AFFIRMATIONS = [
  "I trust the timing of my life.",
  "I am worthy of deep, healing connection.",
  "Peace lives within me — I return to it now.",
  "My healing is sacred and I honor every step.",
  "I am safe. I am loved. I belong here.",
  "Every breath I take is an act of self-love.",
  "I release what no longer serves my highest good.",
];

const STAGES = [
  { emoji: '🌱', name: 'Awareness',     stage: 1, done: true,    locked: false, current: false, desc: 'Awakening to the journey'  },
  { emoji: '🌙', name: 'Healing',        stage: 2, done: false,   locked: false, current: true,  desc: 'Processing and releasing'  },
  { emoji: '🌿', name: 'Growth',         stage: 3, done: false,   locked: true,  current: false, desc: 'Expanding your awareness'  },
  { emoji: '🦋', name: 'Transformation', stage: 4, done: false,   locked: true,  current: false, desc: 'Becoming your true self'   },
  { emoji: '⭐', name: 'Awakening',      stage: 5, done: false,   locked: true,  current: false, desc: 'Living in alignment'       },
];

const CHALLENGES = [
  { icon: '💨', name: '3-Min Breathing',  pts: 30,  done: true,  streak: 'Day 7 streak 🔥', color: '#0891B2' },
  { icon: '📔', name: 'Gratitude Journal', pts: 50, done: false, streak: 'Tap to start',     color: '#D97706' },
  { icon: '🎧', name: '5-Min Meditation',  pts: 70, done: false, streak: 'Tap to start',     color: '#4F46E5' },
];

// ── Lotus SVG Icon ─────────────────────────────────────────────────────────────
function LotusIcon() {
  return (
    <svg viewBox="0 0 32 32" style={{ width: 28, height: 28 }} aria-hidden="true">
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(-45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(90,16,18)" />
      <circle cx="16" cy="17" r="3.5" fill="#F5B841" opacity="0.9" />
      <circle cx="16" cy="17" r="2" fill="#FFD77A" />
    </svg>
  );
}

// ── Bell Icon ──────────────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: 'none', stroke: 'rgba(255,255,255,0.65)', strokeWidth: 1.8 }}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <div style={{
        position: 'absolute', top: -2, right: -2,
        width: 8, height: 8, borderRadius: '50%',
        background: '#FF8C42',
        border: '1.5px solid rgba(8,2,20,0.9)',
      }} />
    </div>
  );
}

// ── Diya/Candle SVG ───────────────────────────────────────────────────────────
function DiyaIcon() {
  return (
    <svg viewBox="0 0 60 70" style={{ width: 52, height: 60 }} aria-hidden="true">
      {/* Mandala ring behind */}
      <circle cx="30" cy="42" r="22" fill="none" stroke="rgba(200,100,30,0.2)" strokeWidth="6" />
      <circle cx="30" cy="42" r="16" fill="none" stroke="rgba(200,100,30,0.12)" strokeWidth="3" />
      {/* Bowl / diya base */}
      <ellipse cx="30" cy="50" rx="16" ry="6" fill="#C06010" />
      <path d="M14,50 Q16,58 30,60 Q44,58 46,50 Z" fill="#A04A08" />
      <ellipse cx="30" cy="50" rx="16" ry="5" fill="#D4720A" />
      <ellipse cx="30" cy="49" rx="10" ry="3.5" fill="#E8861A" />
      {/* Wick */}
      <line x1="30" y1="46" x2="30" y2="36" stroke="#8B5A1A" strokeWidth="1.5" />
      {/* Flame */}
      <ellipse cx="30" cy="30" rx="5" ry="8" fill="rgba(255,200,60,0.9)" />
      <ellipse cx="30" cy="32" rx="3.5" ry="5.5" fill="rgba(255,140,30,0.95)" />
      <ellipse cx="30" cy="34" rx="2" ry="3" fill="rgba(255,80,10,0.8)" />
      <ellipse cx="30" cy="28" rx="2" ry="3.5" fill="rgba(255,240,120,0.95)" />
      {/* Glow around flame */}
      <ellipse cx="30" cy="30" rx="9" ry="12" fill="rgba(255,180,60,0.12)" />
    </svg>
  );
}

// ── Meditation Scene (right side of Hero) ────────────────────────────────────
function MeditationScene() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: 280,
      borderRadius: '0 20px 20px 0',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #2A1060 0%, #6B2060 35%, #C44B20 65%, #8B3050 100%)',
    }}>
      {/* Central glowing orb */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -52%)',
        width: 280, height: 280,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,180,60,0.7) 0%, rgba(255,80,20,0.4) 30%, transparent 65%)',
        filter: 'blur(10px)',
        animation: 'pulseGlow 3s ease-in-out infinite',
      }} />

      {/* Sacred geometry SVG */}
      <svg
        viewBox="0 0 400 340"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="skyGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="rgba(255,160,60,0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="400" height="340" fill="url(#skyGrad)" />

        {/* 7 concentric circles */}
        {[40, 80, 120, 160, 200, 240, 280].map((r, i) => (
          <circle
            key={i}
            cx="200" cy="150"
            r={r}
            fill="none"
            stroke="rgba(255,180,60,0.25)"
            strokeWidth="0.8"
          />
        ))}

        {/* 8 radiating lines, 120px long */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45 - 90) * Math.PI / 180;
          return (
            <line
              key={i}
              x1="200" y1="150"
              x2={200 + 120 * Math.cos(angle)}
              y2={150 + 120 * Math.sin(angle)}
              stroke="rgba(255,180,60,0.15)"
              strokeWidth="1"
            />
          );
        })}

        {/* Mountain silhouette behind figure */}
        <polygon
          points="80,280 155,195 200,230 245,185 320,280"
          fill="rgba(8,2,20,0.55)"
        />

        {/* Tree foliage left */}
        <ellipse cx="55" cy="240" rx="38" ry="55" fill="rgba(5,1,15,0.7)" />
        <ellipse cx="75" cy="260" rx="28" ry="40" fill="rgba(5,1,15,0.6)" />
        <rect x="68" y="280" width="10" height="30" fill="rgba(5,1,15,0.6)" />

        {/* Tree foliage right */}
        <ellipse cx="345" cy="240" rx="38" ry="55" fill="rgba(5,1,15,0.7)" />
        <ellipse cx="325" cy="260" rx="28" ry="40" fill="rgba(5,1,15,0.6)" />
        <rect x="322" y="280" width="10" height="30" fill="rgba(5,1,15,0.6)" />

        {/* Meditating figure silhouette in lotus position */}
        {/* Body base / crossed legs */}
        <ellipse cx="200" cy="278" rx="48" ry="14" fill="#0D0320" />
        {/* Left knee */}
        <ellipse cx="165" cy="270" rx="30" ry="12" fill="#0D0320" transform="rotate(-10,165,270)" />
        {/* Right knee */}
        <ellipse cx="235" cy="270" rx="30" ry="12" fill="#0D0320" transform="rotate(10,235,270)" />
        {/* Torso */}
        <ellipse cx="200" cy="248" rx="22" ry="26" fill="#0D0320" />
        {/* Left arm resting */}
        <path d="M178,258 Q158,265 162,278" fill="none" stroke="#0D0320" strokeWidth="12" strokeLinecap="round" />
        {/* Right arm resting */}
        <path d="M222,258 Q242,265 238,278" fill="none" stroke="#0D0320" strokeWidth="12" strokeLinecap="round" />
        {/* Neck */}
        <rect x="194" y="222" width="12" height="14" rx="6" fill="#0D0320" />
        {/* Head */}
        <circle cx="200" cy="214" r="16" fill="#0D0320" />
        {/* Hair bun */}
        <ellipse cx="200" cy="200" rx="8" ry="6" fill="#0D0320" />
        <circle cx="200" cy="196" r="4" fill="#0D0320" />

        {/* Water / lake reflection */}
        <rect x="0" y="295" width="400" height="45" fill="url(#waterGrad)" opacity="0.7" />
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(100,20,80,0.6)" />
          </linearGradient>
        </defs>

        {/* Floating light particles */}
        {[
          { cx: 140, cy: 190, r: 2.5, color: 'rgba(255,220,80,0.8)' },
          { cx: 265, cy: 175, r: 2,   color: 'rgba(255,200,60,0.7)' },
          { cx: 175, cy: 160, r: 1.8, color: 'rgba(255,240,140,0.6)' },
          { cx: 230, cy: 195, r: 2.2, color: 'rgba(255,180,60,0.75)' },
          { cx: 155, cy: 215, r: 1.5, color: 'rgba(255,140,80,0.6)' },
          { cx: 250, cy: 210, r: 1.8, color: 'rgba(255,220,100,0.65)' },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.color}>
            <animate attributeName="cy" values={`${p.cy};${p.cy - 14};${p.cy}`} dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

// ── Nav Link Component ────────────────────────────────────────────────────────
function NavLink({ label, icon, active, to, onClick }) {
  return (
    <Link
      to={to || '#'}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '0 4px', height: 64,
        fontSize: 13, fontWeight: active ? 700 : 500,
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        textDecoration: 'none',
        borderBottom: active ? '2px solid #7C3AED' : '2px solid transparent',
        transition: 'color 0.2s, border-color 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </Link>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Matches() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const today = new Date();
  const affirmation = AFFIRMATIONS[today.getDate() % AFFIRMATIONS.length];

  // Bokeh orb data
  const orangeOrbs = [
    { top: '62%',  left: '2%',   width: 340, height: 260, blur: 48, opacity: 0.5 },
    { top: '80%',  left: '18%',  width: 220, height: 180, blur: 36, opacity: 0.4 },
    { top: '45%',  left: '-4%',  width: 280, height: 200, blur: 42, opacity: 0.38 },
    { top: '88%',  left: '38%',  width: 200, height: 160, blur: 30, opacity: 0.35 },
  ];
  const purpleOrbs = [
    { top: '5%',   left: '55%',  width: 380, height: 300, blur: 55, opacity: 0.35 },
    { top: '20%',  left: '78%',  width: 260, height: 220, blur: 44, opacity: 0.3  },
    { top: '-4%',  left: '35%',  width: 300, height: 240, blur: 50, opacity: 0.28 },
    { top: '50%',  left: '88%',  width: 220, height: 180, blur: 40, opacity: 0.3  },
  ];
  const goldenDots = [
    { top: '12%', left: '8%',  size: 10, opacity: 0.45 },
    { top: '32%', left: '92%', size: 8,  opacity: 0.38 },
    { top: '55%', left: '15%', size: 14, opacity: 0.32 },
    { top: '70%', left: '82%', size: 9,  opacity: 0.5  },
    { top: '18%', left: '68%', size: 12, opacity: 0.35 },
    { top: '85%', left: '55%', size: 8,  opacity: 0.42 },
    { top: '40%', left: '48%', size: 10, opacity: 0.3  },
    { top: '92%', left: '12%', size: 13, opacity: 0.36 },
  ];

  // Soul matches data
  const soulMatches = [
    { name: 'Moon_42',     stage: 'Stage 2 · Healing', initial: 'M', color: '#7C3AED', online: true  },
    { name: 'StarLight_7', stage: 'Stage 3 · Growth',  initial: 'S', color: '#F5B841', online: true  },
    { name: 'Lotus_88',    stage: 'Stage 2 · Healing', initial: 'L', color: '#34C38F', online: true  },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
      color: '#F1EEF9',
      position: 'relative',
      overflowX: 'hidden',
    }}>

      {/* ── Animations ── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -52%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%, -52%) scale(1.06); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes livePulse {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%       { transform: scale(1.6); opacity: 0.4; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .sc-anim-1 { animation: fadeUp 0.5s 0.00s ease both; }
        .sc-anim-2 { animation: fadeUp 0.5s 0.08s ease both; }
        .sc-anim-3 { animation: fadeUp 0.5s 0.16s ease both; }
        .sc-anim-4 { animation: fadeUp 0.5s 0.24s ease both; }
        .sc-anim-5 { animation: fadeUp 0.5s 0.32s ease both; }
        .sc-anim-6 { animation: fadeUp 0.5s 0.40s ease both; }
        .sc-hover:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.35); }
        .sc-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        @media (max-width: 960px) {
          .sc-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .sc-two-col    { grid-template-columns: 1fr !important; }
          .sc-three-col  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .sc-three-col  { grid-template-columns: 1fr !important; }
          .sc-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sc-anim-1, .sc-anim-2, .sc-anim-3,
          .sc-anim-4, .sc-anim-5, .sc-anim-6 { animation: none !important; }
        }
      `}</style>

      {/* ══ FIXED BACKGROUND ══ */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(160deg, #0D0320 0%, #1A0845 40%, #0D0220 100%)',
      }}>
        {/* Orange / amber bokeh orbs */}
        {orangeOrbs.map((o, i) => (
          <div key={`o-${i}`} style={{
            position: 'absolute',
            top: o.top, left: o.left,
            width: o.width, height: o.height,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(255,140,50,${o.opacity}) 0%, transparent 70%)`,
            filter: `blur(${o.blur}px)`,
            animation: `float ${7 + i * 1.8}s ${i * 1.2}s ease-in-out infinite`,
          }} />
        ))}
        {/* Purple bokeh orbs */}
        {purpleOrbs.map((o, i) => (
          <div key={`p-${i}`} style={{
            position: 'absolute',
            top: o.top, left: o.left,
            width: o.width, height: o.height,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(140,60,255,${o.opacity}) 0%, transparent 70%)`,
            filter: `blur(${o.blur}px)`,
            animation: `float ${8 + i * 1.5}s ${i * 0.9}s ease-in-out infinite`,
          }} />
        ))}
        {/* Large ambient center glow */}
        <div style={{
          position: 'absolute',
          top: '20%', left: '20%',
          width: '60%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(100,50,200,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Golden bokeh dots */}
        {goldenDots.map((d, i) => (
          <div key={`d-${i}`} style={{
            position: 'absolute',
            top: d.top, left: d.left,
            width: d.size, height: d.size,
            borderRadius: '50%',
            background: 'rgba(245,184,65,0.85)',
            opacity: d.opacity,
            animation: `float ${5 + i * 0.8}s ${i * 0.7}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 64, zIndex: 50,
        background: 'rgba(8,2,20,0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(120,70,220,0.2)',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(16px, 3vw, 40px)',
        gap: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 32, flexShrink: 0 }}>
          <LotusIcon />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              SoulConnect
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', fontWeight: 500 }}>
              HEAL · CONNECT · GROW
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
          <NavLink label="Matches"    icon="🌙" active={true}  to="/matches"    />
          <NavLink label="Circles"    icon="🌀" active={false} to="/groups"     />
          <NavLink label="Healers"    icon="🧘" active={false} to="/healers"    />
          <NavLink label="Journal"    icon="📔" active={false} to="/journal"    />
          <NavLink label="Meditations" icon="✨" active={false} to="/meditations" />
          <NavLink label="Messages"   icon="💬" active={false} to="/messages"   />
        </div>

        {/* Right: bell + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <BellIcon />
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
            cursor: 'pointer',
            border: '2px solid rgba(120,70,220,0.4)',
          }}>
            U
          </div>
        </div>
      </nav>

      {/* ══ SCROLLABLE CONTENT ══ */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(16px, 2.5vw, 28px)',
        paddingTop: 88,
        paddingBottom: 60,
      }}>

        {/* ════════════════════════════════════════
            HERO CARD
        ════════════════════════════════════════ */}
        <div className="sc-anim-1" style={{
          background: 'linear-gradient(135deg, #0F0535 0%, #1A0A3E 60%, #0C0228 100%)',
          border: '1px solid rgba(120,70,220,0.4)',
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 16,
          display: 'grid',
          gridTemplateColumns: '55% 45%',
          minHeight: 320,
        }}>
          {/* Left Column */}
          <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, color: '#F5B841',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '5px 14px', borderRadius: 20,
              border: '1px solid rgba(245,184,65,0.4)',
              background: 'rgba(245,184,65,0.1)',
              marginBottom: 18,
              alignSelf: 'flex-start',
            }}>
              ✦ YOUR DAILY INTENTION
            </div>

            {/* Headline */}
            <h1 style={{
              margin: '0 0 10px',
              fontSize: 38, fontWeight: 800, lineHeight: 1.2,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}>
              Your healing journey
            </h1>
            <h1 style={{
              margin: '0 0 16px',
              fontSize: 38, fontWeight: 700, lineHeight: 1.2,
              color: '#A78BFA',
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
            }}>
              continues today.
            </h1>

            {/* Quote */}
            <p style={{
              margin: '0 0 24px',
              fontSize: 14, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 400,
            }}>
              "I am safe. I am loved. I belong here."
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <button
                onClick={() => navigate('/meetups')}
                style={{
                  padding: '12px 24px', borderRadius: 12,
                  fontSize: 14, fontWeight: 700,
                  background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(124,58,237,0.45)',
                  letterSpacing: '-0.01em',
                }}>
                Continue Your Journey →
              </button>
              <button
                onClick={() => navigate('/mood')}
                style={{
                  padding: '12px 24px', borderRadius: 12,
                  fontSize: 14, fontWeight: 700,
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                }}>
                Today's Challenge
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { icon: '🔥', val: String(user?.streak || 7),   label: 'Day Streak'  },
                { icon: '🌙', val: 'Stage 2',                    label: 'Healing'     },
                { icon: '⚡', val: '847',                        label: 'Soul Points' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Meditation Scene */}
          <MeditationScene />
        </div>

        {/* ════════════════════════════════════════
            4 STATS CARDS ROW
        ════════════════════════════════════════ */}
        <div className="sc-anim-2 sc-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 16,
          marginBottom: 16,
        }}>

          {/* Card 1 — Day Streak */}
          <div className="sc-hover" style={{
            background: 'linear-gradient(135deg, #1A0842, #2A1060)',
            border: '1px solid rgba(120,70,220,0.35)',
            borderRadius: 18, padding: 22,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ marginBottom: 8 }}>
              <DiyaIcon />
            </div>
            <div style={{
              fontSize: 40, fontWeight: 800, color: '#F5B841', lineHeight: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(245,184,65,0.5)',
            }}>
              {user?.streak || 7}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
              Day Healing Streak
            </div>
            {/* Gold progress bar */}
            <div style={{
              width: '100%', height: 4,
              background: 'rgba(245,184,65,0.15)',
              borderRadius: 4, marginBottom: 8, overflow: 'hidden',
            }}>
              <div style={{
                width: '50%', height: '100%',
                background: 'linear-gradient(90deg, #F5B841, #FFD77A, #F5B841)',
                backgroundSize: '200% auto',
                borderRadius: 4,
                animation: 'shimmer 2.5s linear infinite',
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>🔥 Best: 14 days</div>
          </div>

          {/* Card 2 — Souls Healing */}
          <div className="sc-hover" style={{
            background: 'linear-gradient(135deg, #0A1A30, #0C2040)',
            border: '1px solid rgba(0,180,150,0.3)',
            borderRadius: 18, padding: 22,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Globe icon */}
            <div style={{ fontSize: 24, marginBottom: 8 }}>🌍</div>
            <div style={{
              fontSize: 40, fontWeight: 800, color: '#00D4AA', lineHeight: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(0,212,170,0.5)',
            }}>
              1,247
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>
              Souls healing right now
            </div>
            {/* Avatar row + LIVE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {[
                { bg: 'linear-gradient(135deg,#7C3AED,#5B21B6)', z: 4 },
                { bg: 'linear-gradient(135deg,#F5B841,#D97706)', z: 3 },
                { bg: 'linear-gradient(135deg,#00D4AA,#059669)', z: 2 },
                { bg: 'linear-gradient(135deg,#EC4899,#BE185D)', z: 1 },
              ].map((av, i) => (
                <div key={i} style={{
                  width: 24, height: 24,
                  borderRadius: '50%',
                  background: av.bg,
                  border: '2px solid rgba(10,26,48,0.9)',
                  marginLeft: i > 0 ? -6 : 0,
                  zIndex: av.z,
                  position: 'relative',
                }} />
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 10 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#00D4AA',
                  animation: 'livePulse 1.5s ease-in-out infinite',
                }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#00D4AA', letterSpacing: '0.05em' }}>LIVE</span>
              </div>
            </div>
          </div>

          {/* Card 3 — Soul Points */}
          <div className="sc-hover" style={{
            background: 'linear-gradient(135deg, #1A0842, #2A1060)',
            border: '1px solid rgba(120,70,220,0.35)',
            borderRadius: 18, padding: 22,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <div style={{
              fontSize: 40, fontWeight: 800, color: '#A78BFA', lineHeight: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(167,139,250,0.5)',
            }}>
              847
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Soul Points</div>
            {/* Progress bar */}
            <div style={{
              width: '100%', height: 4,
              background: 'rgba(167,139,250,0.15)',
              borderRadius: 4, marginBottom: 6, overflow: 'hidden',
            }}>
              <div style={{
                width: '65%', height: '100%',
                background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                borderRadius: 4,
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Level 3 · 153 pts to Level 4</div>
          </div>

          {/* Card 4 — Healing Sessions */}
          <div className="sc-hover" style={{
            background: 'linear-gradient(135deg, #1A0842, #2A1060)',
            border: '1px solid rgba(120,70,220,0.35)',
            borderRadius: 18, padding: 22,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🧘</div>
            <div style={{
              fontSize: 40, fontWeight: 800, color: '#FF8C42', lineHeight: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(255,140,66,0.5)',
            }}>
              3
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Healing Sessions</div>
            {/* 8 pill segments */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: i === 0 ? 'rgba(255,140,66,0.45)'
                    : i === 1 ? 'rgba(255,140,66,0.45)'
                    : i === 2 ? '#FF8C42'
                    : 'rgba(255,255,255,0.1)',
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>This week: +2 from last</div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            TWO-COLUMN: Soul Journey + Daily Challenges
        ════════════════════════════════════════ */}
        <div className="sc-anim-3 sc-two-col" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 16, marginBottom: 16,
        }}>

          {/* LEFT — Soul Journey */}
          <div style={{
            background: 'linear-gradient(135deg, #0F0530, #1A0A3E)',
            border: '1px solid rgba(120,70,220,0.3)',
            borderRadius: 20, padding: 24,
          }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>✨ Soul Journey</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Stage 2 of 5 · Healing</div>
            </div>

            {/* Stages */}
            <div style={{ position: 'relative' }}>
              {/* Vertical connector line */}
              <div style={{
                position: 'absolute',
                left: 19, top: 30, bottom: 30,
                width: 2,
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0,
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {STAGES.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    position: 'relative', zIndex: 1,
                    padding: '8px 0',
                  }}>
                    {/* Stage circle */}
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                      background: s.done
                        ? 'linear-gradient(135deg, #34C38F, #10B981)'
                        : s.current
                          ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(91,33,182,0.3))'
                          : 'rgba(255,255,255,0.05)',
                      border: s.done
                        ? '2px solid #34C38F'
                        : s.current
                          ? '2px solid #7C3AED'
                          : '2px solid rgba(255,255,255,0.1)',
                      boxShadow: s.current ? '0 0 18px rgba(124,58,237,0.6)' : 'none',
                      opacity: s.locked ? 0.45 : 1,
                    }}>
                      {s.done ? '✓' : s.locked ? '🔒' : s.emoji}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700,
                        color: s.locked ? 'rgba(255,255,255,0.35)' : '#fff',
                      }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
                    </div>

                    {/* Status badge */}
                    {s.done && (
                      <div style={{ fontSize: 16, color: '#34C38F', fontWeight: 700 }}>✓</div>
                    )}
                    {s.current && (
                      <div style={{
                        fontSize: 10, fontWeight: 700, color: '#A78BFA',
                        background: 'rgba(124,58,237,0.2)',
                        padding: '3px 9px', borderRadius: 20,
                        border: '1px solid rgba(124,58,237,0.4)',
                        whiteSpace: 'nowrap',
                      }}>
                        You are here
                      </div>
                    )}
                    {s.locked && (
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>🔒</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* View Full Journey */}
            <button
              onClick={() => navigate('/meetups')}
              style={{
                marginTop: 20, width: '100%',
                padding: '11px', borderRadius: 12,
                fontSize: 13, fontWeight: 700,
                background: 'transparent', color: '#A78BFA',
                border: '1px solid rgba(124,58,237,0.35)',
                cursor: 'pointer',
              }}>
              View Full Journey
            </button>
          </div>

          {/* RIGHT — Daily Challenges */}
          <div style={{
            background: 'linear-gradient(135deg, #0A1225, #0F1A35)',
            border: '1px solid rgba(60,100,200,0.3)',
            borderRadius: 20, padding: 24,
          }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>⚡ Daily Challenges</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                Complete 3 challenges to earn 150 Soul Points
              </div>
            </div>

            {/* Challenge rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {CHALLENGES.map((ch, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 14, borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: ch.done ? '#34C38F' : 'transparent',
                    border: `2px solid ${ch.done ? '#34C38F' : 'rgba(255,255,255,0.3)'}`,
                    fontSize: 11, fontWeight: 700, color: '#fff',
                  }}>
                    {ch.done && '✓'}
                  </div>

                  {/* Icon square */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    background: `${ch.color}22`,
                    border: `1px solid ${ch.color}44`,
                  }}>
                    {ch.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: ch.done ? '#fff' : 'rgba(255,255,255,0.8)',
                    }}>
                      {ch.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{ch.streak}</div>
                  </div>

                  {/* Points badge */}
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '4px 10px', borderRadius: 20,
                    background: ch.done ? 'rgba(245,184,65,0.18)' : 'rgba(255,255,255,0.05)',
                    color: ch.done ? '#F5B841' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${ch.done ? 'rgba(245,184,65,0.35)' : 'rgba(255,255,255,0.1)'}`,
                    whiteSpace: 'nowrap',
                  }}>
                    +{ch.pts} pts
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
              1 of 3 completed · 120 pts remaining
            </div>

            <button
              onClick={() => navigate('/mood')}
              style={{
                background: 'none', border: 'none',
                fontSize: 13, fontWeight: 700, color: '#A78BFA',
                cursor: 'pointer', padding: 0,
              }}>
              View All Challenges →
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            SOUL MATCHES SECTION
        ════════════════════════════════════════ */}
        <div className="sc-anim-4" style={{ marginBottom: 16 }}>
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                🌙 Your Soul Matches
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                People who truly understand your journey
              </div>
            </div>
            <button
              onClick={() => navigate('/matches')}
              style={{
                background: 'none', border: 'none',
                fontSize: 13, fontWeight: 700, color: '#A78BFA',
                cursor: 'pointer', padding: 0,
              }}>
              See All →
            </button>
          </div>

          {/* 3 match cards */}
          <div className="sc-three-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {soulMatches.map((m, i) => (
              <div key={i} className="sc-hover" style={{
                background: 'linear-gradient(135deg, #130545, #1E0B52)',
                border: '1px solid rgba(120,70,220,0.2)',
                borderRadius: 18, padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 800, color: '#fff',
                    }}>
                      {m.initial}
                    </div>
                    {/* Online dot */}
                    <div style={{
                      position: 'absolute', bottom: 1, right: 1,
                      width: 11, height: 11, borderRadius: '50%',
                      background: m.online ? '#34C38F' : '#6B7280',
                      border: '2px solid #130545',
                    }} />
                  </div>
                  {/* Info */}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{m.stage}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
