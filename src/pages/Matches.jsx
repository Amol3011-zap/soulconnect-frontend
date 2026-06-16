import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';

const DEMO_MATCHES = [
  {
    id: 101, name: 'Priya', age: 26, city: 'Mumbai', isDemo: true,
    primary_problem: 'anxiety', match_score: 94,
    match_reason: 'Both navigating social anxiety and overthinking spirals',
    secondary_problems: ['panic_attacks', 'sleep_problems'],
  },
  {
    id: 102, name: 'Rohan', age: 29, city: 'Pune', isDemo: true,
    primary_problem: 'depression', match_score: 88,
    match_reason: 'Similar experiences with low motivation and isolation',
    secondary_problems: ['loneliness'],
  },
  {
    id: 103, name: 'Aisha', age: 24, city: 'Bangalore', isDemo: true,
    primary_problem: 'loneliness', match_score: 82,
    match_reason: 'Both dealing with loneliness after a big life change',
    secondary_problems: ['lack_of_confidence'],
  },
  {
    id: 104, name: 'Dev', age: 31, city: 'Delhi', isDemo: true,
    primary_problem: 'work_career_stress', match_score: 79,
    match_reason: 'Both burned out from high-pressure work environments',
    secondary_problems: ['sleep_problems', 'anxiety'],
  },
];

const PROBLEM_META = {
  anxiety:                  { label: 'Anxiety',        icon: '🌀', color: '#a78bfa' },
  depression:               { label: 'Depression',     icon: '💙', color: '#818cf8' },
  loneliness:               { label: 'Loneliness',     icon: '🕊️', color: '#c4b5fd' },
  work_career_stress:       { label: 'Work Stress',    icon: '⚡', color: '#fbbf24' },
  ptsd_trauma:              { label: 'Trauma',         icon: '🌿', color: '#6ee7b7' },
  grief_loss:               { label: 'Grief',          icon: '🕯️', color: '#94a3b8' },
  relationship_breakup:     { label: 'Breakup',        icon: '💔', color: '#fda4af' },
  panic_attacks:            { label: 'Panic Attacks',  icon: '💓', color: '#f9a8d4' },
  ocd_intrusive_thoughts:   { label: 'OCD',            icon: '🔄', color: '#7dd3fc' },
  lack_of_confidence:       { label: 'Confidence',     icon: '🌱', color: '#86efac' },
  sleep_problems:           { label: 'Sleep',          icon: '🌙', color: '#a5b4fc' },
  anger_management:         { label: 'Anger',          icon: '🔥', color: '#fca5a5' },
  financial_stress:         { label: 'Financial',      icon: '💸', color: '#fcd34d' },
  phobias:                  { label: 'Phobias',        icon: '😨', color: '#c084fc' },
  self_harm:                { label: 'Self-Harm',      icon: '🆘', color: '#f87171' },
  divorce:                  { label: 'Divorce',        icon: '📋', color: '#94a3b8' },
  marriage_problems:        { label: 'Marriage',       icon: '💑', color: '#d8b4fe' },
  family_relationships:     { label: 'Family',         icon: '🏡', color: '#6ee7b7' },
  trust_issues:             { label: 'Trust Issues',   icon: '🤝', color: '#7dd3fc' },
  health_anxiety:           { label: 'Health Anxiety', icon: '🏥', color: '#7dd3fc' },
  eating_disorders:         { label: 'Eating',         icon: '🍃', color: '#86efac' },
  bullying_harassment:      { label: 'Bullying',       icon: '😠', color: '#fca5a5' },
  identity_sexual_orientation: { label: 'Identity',   icon: '🌈', color: '#c084fc' },
  addiction_substance_abuse:{ label: 'Addiction',      icon: '⚕️', color: '#6ee7b7' },
};

const AVATAR_GRADS = [
  'linear-gradient(135deg, #7c3aed, #c026d3)',
  'linear-gradient(135deg, #b45309, #d97706)',
  'linear-gradient(135deg, #0e7490, #6d28d9)',
  'linear-gradient(135deg, #be123c, #7c3aed)',
];

const AFFIRMATIONS = [
  '"The universe brought you here for a reason. Trust the process."',
  '"Your pain is valid. Your healing is real. Your story matters."',
  '"Every soul here has walked a hard road. You are in sacred company."',
  '"You are not alone. You are exactly where you need to be."',
  '"Healing begins the moment you reach out. You already took that step."',
];

// ── Keyframe styles injected once ─────────────────────────────────────────────
const STYLE_TAG = `
  @keyframes starPulse {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(1.6); }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-18px) scale(1.04); }
  }
  @keyframes shimmerLine {
    0% { opacity: 0.3; }
    50% { opacity: 0.9; }
    100% { opacity: 0.3; }
  }
  @keyframes ringPulse {
    0%, 100% { box-shadow: 0 0 0 0px rgba(212,175,55,0.0); }
    50% { box-shadow: 0 0 0 6px rgba(212,175,55,0.12); }
  }
  @keyframes cardGlow {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
`;

// ── Sacred Geometry SVG — Flower of Life ──────────────────────────────────────
function SacredGeometry() {
  const cx = 500, cy = 220;
  const petalAngles = [0, 60, 120, 180, 240, 300];
  const rings = [40, 80, 120, 160, 210];
  const spokeAngles = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 440"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.06 }}
    >
      {rings.map(r => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke="#d4af37" strokeWidth="0.6" fill="none" />
      ))}
      {petalAngles.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={`p${deg}`}
            cx={cx + 80 * Math.cos(rad)}
            cy={cy + 80 * Math.sin(rad)}
            r={80}
            stroke="#d4af37"
            strokeWidth="0.4"
            fill="none"
          />
        );
      })}
      {spokeAngles.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={`s${deg}`}
            x1={cx + 40 * Math.cos(rad)} y1={cy + 40 * Math.sin(rad)}
            x2={cx + 210 * Math.cos(rad)} y2={cy + 210 * Math.sin(rad)}
            stroke="#d4af37" strokeWidth="0.3"
          />
        );
      })}
      {Array.from({ length: 24 }, (_, i) => {
        const rad = (i * 15 * Math.PI) / 180;
        return (
          <circle
            key={`d${i}`}
            cx={cx + 210 * Math.cos(rad)}
            cy={cy + 210 * Math.sin(rad)}
            r="2"
            fill="#d4af37"
            fillOpacity="0.8"
          />
        );
      })}
      <circle cx={cx} cy={cy} r="8" stroke="#d4af37" strokeWidth="1" fill="none" />
      <circle cx={cx} cy={cy} r="2.5" fill="#d4af37" fillOpacity="0.6" />
    </svg>
  );
}

// ── Floating star particles ────────────────────────────────────────────────────
const PARTICLES = [
  { l: '7%',  t: '12%', s: 2,   delay: 0 },
  { l: '15%', t: '68%', s: 1.5, delay: 0.8 },
  { l: '23%', t: '38%', s: 1,   delay: 1.6 },
  { l: '33%', t: '9%',  s: 2.5, delay: 0.4 },
  { l: '43%', t: '78%', s: 1.5, delay: 2.2 },
  { l: '53%', t: '22%', s: 2,   delay: 1.0 },
  { l: '63%', t: '58%', s: 1,   delay: 2.8 },
  { l: '72%', t: '6%',  s: 2.5, delay: 0.2 },
  { l: '81%', t: '73%', s: 1.5, delay: 1.4 },
  { l: '89%', t: '35%', s: 2,   delay: 3.0 },
  { l: '95%', t: '16%', s: 1,   delay: 0.6 },
  { l: '4%',  t: '50%', s: 1.5, delay: 2.0 },
  { l: '49%', t: '48%', s: 1,   delay: 1.2 },
  { l: '69%', t: '84%', s: 2,   delay: 2.6 },
];

function Particles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.l,
            top: p.t,
            width: p.s,
            height: p.s,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#c4b5fd' : '#ffffff',
            animation: `starPulse ${2.5 + (i % 3) * 0.5}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

// ── Soul Compatibility Arc (semi-circle) ──────────────────────────────────────
function SoulCompatibilityArc({ score }) {
  const gold   = '#d4af37';
  const lav    = '#a78bfa';
  const slate  = '#64748b';
  const color  = score >= 85 ? gold : score >= 70 ? lav : slate;

  // SVG arc math — semi-circle (180°)
  const R = 26;
  const W = 64, H = 38; // viewBox — only top half needed
  const cx = W / 2, cy = H;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const arcX = (deg) => cx + R * Math.cos(toRad(deg));
  const arcY = (deg) => cy + R * Math.sin(toRad(deg));

  // full track: 180° → 0° (left to right top half)
  const trackD = `M ${arcX(180)} ${arcY(180)} A ${R} ${R} 0 0 1 ${arcX(0)} ${arcY(0)}`;

  // filled portion
  const fillDeg = 180 - (score / 100) * 180; // goes from 180° down to 0°
  const fillD = score > 0
    ? `M ${arcX(180)} ${arcY(180)} A ${R} ${R} 0 ${score >= 50 ? 1 : 0} 1 ${arcX(fillDeg)} ${arcY(fillDeg)}`
    : '';

  return (
    <div style={{ position: 'relative', width: 64, height: 42, flexShrink: 0 }}>
      <svg width={W} height={H + 4} viewBox={`0 0 ${W} ${H + 4}`} style={{ overflow: 'visible' }}>
        {/* Track */}
        <path d={trackD} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" strokeLinecap="round" />
        {/* Fill */}
        {score > 0 && (
          <path d={fillD} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"
            style={{ filter: score >= 85 ? `drop-shadow(0 0 4px ${color}80)` : 'none' }} />
        )}
        {/* Score text */}
        <text x={cx} y={H - 2} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={color}
          style={{ fontFamily: 'system-ui, sans-serif' }}>
          {score}%
        </text>
      </svg>
    </div>
  );
}

// ── Match Card ─────────────────────────────────────────────────────────────────
function MatchCard({ match, index, onConnect, connecting }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered]   = useState(false);

  const prob    = PROBLEM_META[match.primary_problem] || { label: 'Peer Support', icon: '🤝', color: '#a78bfa' };
  const accent  = prob.color;
  const grad    = AVATAR_GRADS[index % AVATAR_GRADS.length];
  const initial = match.name?.[0]?.toUpperCase() || '?';
  const isConnecting = connecting === match.id;

  const cardStyle = {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${hovered ? accent + '55' : accent + '22'}`,
    boxShadow: hovered
      ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accent}30, 0 0 40px ${accent}10`
      : `0 8px 40px rgba(0,0,0,0.45)`,
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.35s ease',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top gradient accent bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(to right, transparent, ${accent}1a, ${accent}40, ${accent}1a, transparent)`,
        animation: 'shimmerLine 3s ease-in-out infinite',
      }} />

      {/* Per-card colour wash at top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 80,
        background: `linear-gradient(180deg, ${accent}0d 0%, transparent 100%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '20px 22px 22px', position: 'relative', zIndex: 1 }}>

        {/* Avatar + name + arc row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>

          {/* Avatar with pulsing glow ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {/* Outer glow halo */}
            <div style={{
              position: 'absolute',
              inset: -4,
              borderRadius: 20,
              background: accent,
              opacity: hovered ? 0.2 : 0.08,
              filter: 'blur(10px)',
              transition: 'opacity 0.35s',
            }} />
            <div style={{
              position: 'relative',
              width: 60,
              height: 60,
              borderRadius: 16,
              background: grad,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              boxShadow: `0 4px 20px rgba(0,0,0,0.45), 0 0 0 2px ${accent}33`,
              animation: 'ringPulse 3s ease-in-out infinite',
            }}>
              {initial}
            </div>
            {/* Online dot */}
            <div style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 13,
              height: 13,
              borderRadius: '50%',
              background: '#34d399',
              border: '2px solid #030009',
            }} />
          </div>

          {/* Name + city */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1.2, margin: 0 }}>
                  {match.name || 'Anonymous'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                  {match.age && (
                    <span style={{ fontSize: 12, color: 'rgba(196,181,253,0.65)' }}>{match.age} yrs</span>
                  )}
                  {match.city && (
                    <>
                      <span style={{ color: 'rgba(196,181,253,0.2)', fontSize: 8 }}>●</span>
                      <span style={{ fontSize: 12, color: 'rgba(196,181,253,0.65)' }}>📍 {match.city}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Soul Compatibility Arc — top right of name block */}
              <SoulCompatibilityArc score={match.match_score || 0} />
            </div>
          </div>
        </div>

        {/* Problem tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, padding: '5px 11px', borderRadius: 20,
            fontWeight: 600, letterSpacing: '0.02em',
            background: `${accent}1a`,
            color: accent,
            border: `1px solid ${accent}38`,
            backdropFilter: 'blur(8px)',
          }}>
            {prob.icon} {prob.label}
          </span>
          {(match.secondary_problems || []).slice(0, 2).map(p => {
            const info = PROBLEM_META[p];
            return info ? (
              <span key={p} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, padding: '5px 10px', borderRadius: 20,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(196,181,253,0.65)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}>
                {info.icon} {info.label}
              </span>
            ) : null;
          })}
        </div>

        {/* Match reason — gold-left-bordered soul reading */}
        {match.match_reason && (
          <div style={{
            borderRadius: '0 12px 12px 0',
            borderLeft: '2px solid rgba(212,175,55,0.5)',
            background: 'rgba(212,175,55,0.05)',
            padding: '12px 14px',
            marginBottom: 18,
            display: 'flex',
            gap: 10,
            backdropFilter: 'blur(6px)',
          }}>
            <span style={{ color: '#d4af37', fontSize: 14, lineHeight: 1.8, flexShrink: 0 }}>✦</span>
            <p style={{ margin: 0, fontSize: 12, fontStyle: 'italic', lineHeight: 1.75, color: 'rgba(221,214,254,0.72)' }}>
              "{match.match_reason}"
            </p>
          </div>
        )}

        {/* Expandable story */}
        {match.problem_context && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, color: '#d4af37',
                marginBottom: 10, padding: 0,
              }}>
              {expanded ? '▲ Less' : '▼ Their story'}
            </button>
            {expanded && (
              <p style={{
                fontSize: 12, fontStyle: 'italic', lineHeight: 1.7,
                marginBottom: 16, padding: '12px 14px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(196,181,253,0.65)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                "{match.problem_context}"
              </p>
            )}
          </>
        )}

        {/* Sacred CTA */}
        <button
          onClick={() => onConnect(match)}
          disabled={isConnecting}
          onMouseEnter={e => {
            if (!isConnecting) {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(168,85,247,0.55), 0 4px 30px rgba(0,0,0,0.4)';
              e.currentTarget.style.transform = 'scale(1.01)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(168,85,247,0.35), 0 4px 24px rgba(0,0,0,0.35)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          style={{
            width: '100%',
            height: 50,
            borderRadius: 16,
            border: 'none',
            cursor: isConnecting ? 'default' : 'pointer',
            background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 50%, #a855f7 100%)',
            boxShadow: '0 0 30px rgba(168,85,247,0.35), 0 4px 24px rgba(0,0,0,0.35)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'box-shadow 0.3s ease, transform 0.2s ease',
            opacity: isConnecting ? 0.65 : 1,
          }}>
          {isConnecting ? (
            <>
              <span style={{
                width: 14, height: 14,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite',
              }} />
              Opening chat...
            </>
          ) : (
            <>
              <span style={{ fontSize: 15 }}>💬</span>
              Begin Conversation
            </>
          )}
        </button>
      </div>

      {/* Bottom shimmer line */}
      <div style={{
        height: 1,
        background: `linear-gradient(to right, transparent, ${accent}30, rgba(212,175,55,0.2), ${accent}30, transparent)`,
      }} />
    </div>
  );
}

// ── Main Matches Page ──────────────────────────────────────────────────────────
export default function Matches() {
  const [matches, setMatches]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [toast, setToast]           = useState(null);
  const [affirmation]               = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const navigate                    = useNavigate();

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
      const res   = await matchAPI.acceptMatch(match.id);
      const chatId = res.data?.match_id || match.id;
      showToast('✅ Connected! Opening chat...');
      setTimeout(() => navigate(`/chat/${chatId}`), 900);
    } catch {
      showToast('❌ Could not connect. Try again.');
      setConnecting(null);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const hour        = new Date().getHours();
  const greeting    = hour < 5 ? 'Still awake' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = hour < 5 ? '🌙' : hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  return (
    <>
      {/* Inject keyframe animations */}
      <style>{STYLE_TAG + `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #030009 0%, #0d0524 45%, #07031a 100%)',
        position: 'relative',
      }}>

        {/* Toast notification */}
        {toast && (
          <div style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, padding: '12px 24px',
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            border: '1px solid rgba(168,85,247,0.45)',
            borderRadius: 16, color: '#fff',
            fontSize: 13, fontWeight: 600,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}>
            {toast}
          </div>
        )}

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', minHeight: 340, overflow: 'hidden' }}>

          {/* Deep layered background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, #0c0220 0%, #1e0a44 35%, #150d3a 70%, #08091e 100%)',
          }} />

          {/* Ambient glow orbs */}
          <div style={{
            position: 'absolute', pointerEvents: 'none',
            top: '30%', left: '38%', transform: 'translate(-50%,-50%)',
            width: 460, height: 460, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)',
            filter: 'blur(40px)',
            animation: 'orbFloat 8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', pointerEvents: 'none',
            top: '18%', right: '8%',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 65%)',
            filter: 'blur(30px)',
            animation: 'orbFloat 10s ease-in-out 2s infinite',
          }} />
          <div style={{
            position: 'absolute', pointerEvents: 'none',
            bottom: 0, left: '12%',
            width: 250, height: 250, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 65%)',
            filter: 'blur(24px)',
            animation: 'orbFloat 12s ease-in-out 4s infinite',
          }} />

          {/* Sacred geometry */}
          <SacredGeometry />

          {/* Star particles */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <Particles />
          </div>

          {/* Hero content */}
          <div style={{
            position: 'relative', zIndex: 10,
            maxWidth: 540, margin: '0 auto',
            padding: '56px 24px 72px',
            textAlign: 'center',
          }}>

            {/* Greeting pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 40, marginBottom: 22,
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.28)',
            }}>
              <span style={{ fontSize: 13 }}>{greetingIcon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#d4af37', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {greeting}
              </span>
            </div>

            {/* Main title */}
            <h1 style={{
              margin: '0 0 14px',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              lineHeight: 1.08,
              textShadow: '0 0 60px rgba(212,175,55,0.25), 0 0 120px rgba(124,58,237,0.2)',
            }}>
              Your Soul Matches
            </h1>

            <p style={{
              fontSize: 15,
              color: 'rgba(196,181,253,0.72)',
              marginBottom: 34,
              lineHeight: 1.65,
            }}>
              Kindred spirits who truly understand your journey
            </p>

            {/* Gold ornamental divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.55))' }} />
              <span style={{ color: 'rgba(212,175,55,0.8)', fontSize: 18 }}>✦</span>
              <span style={{ color: 'rgba(212,175,55,0.4)', fontSize: 12 }}>⊹</span>
              <span style={{ color: 'rgba(212,175,55,0.8)', fontSize: 18 }}>✦</span>
              <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.55))' }} />
            </div>

            {/* Affirmation */}
            <p style={{
              fontSize: 13.5,
              fontStyle: 'italic',
              color: 'rgba(221,214,254,0.6)',
              lineHeight: 1.75,
              maxWidth: 420,
              margin: '0 auto',
            }}>
              {affirmation}
            </p>
          </div>

          {/* Bottom fade into page */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 60, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, transparent, #030009)',
          }} />
        </div>

        {/* ── MATCH COUNT PILL ───────────────────────────────────────────────── */}
        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, marginTop: -20, position: 'relative', zIndex: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 20px', borderRadius: 40,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,175,55,0.32)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 4px 32px rgba(0,0,0,0.55)',
            }}>
              {/* Overlapping avatars */}
              <div style={{ display: 'flex' }}>
                {matches.slice(0, 4).map((m, i) => (
                  <div
                    key={m.id}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: AVATAR_GRADS[i % AVATAR_GRADS.length],
                      border: '2px solid #030009',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: '#fff',
                      marginLeft: i === 0 ? 0 : -8,
                      position: 'relative', zIndex: 4 - i,
                    }}
                  >
                    {m.name?.[0]?.toUpperCase() || '?'}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(221,214,254,0.9)', letterSpacing: '0.02em' }}>
                {matches.length} soul{matches.length !== 1 ? 's' : ''} matched to you ✦
              </span>
            </div>
          </div>
        )}

        {/* ── CARDS ─────────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 16px 110px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  padding: 22, borderRadius: 24,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.08)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(255,255,255,0.07)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 14, borderRadius: 8, background: 'rgba(255,255,255,0.07)', marginBottom: 8, width: '50%' }} />
                      <div style={{ height: 11, borderRadius: 8, background: 'rgba(255,255,255,0.05)', width: '35%' }} />
                    </div>
                  </div>
                  <div style={{ height: 11, borderRadius: 8, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }} />
                  <div style={{ height: 11, borderRadius: 8, background: 'rgba(255,255,255,0.05)', width: '75%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {matches.map((match, i) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  index={i}
                  onConnect={handleConnect}
                  connecting={connecting}
                />
              ))}

              {/* Privacy note */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '16px 18px', borderRadius: 18,
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
              }}>
                <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1.7 }}>🔒</span>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.75, color: 'rgba(196,181,253,0.42)' }}>
                  All matches are anonymous. Your personal details are never shared without your consent. You are always in control of your story.
                </p>
              </div>

              {/* Closing affirmation */}
              <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 1, background: 'rgba(212,175,55,0.28)' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(196,181,253,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Every connection here is sacred
                  </span>
                  <div style={{ width: 28, height: 1, background: 'rgba(212,175,55,0.28)' }} />
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(212,175,55,0.48)', letterSpacing: '0.06em' }}>
                  You are loved · You matter · You will heal
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
