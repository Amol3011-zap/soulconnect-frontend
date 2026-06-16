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
  anxiety:                     { label: 'Anxiety',        icon: '🌀', color: '#a78bfa' },
  depression:                  { label: 'Depression',     icon: '💙', color: '#818cf8' },
  loneliness:                  { label: 'Loneliness',     icon: '🕊️', color: '#c4b5fd' },
  work_career_stress:          { label: 'Work Stress',    icon: '⚡', color: '#fbbf24' },
  ptsd_trauma:                 { label: 'Trauma',         icon: '🌿', color: '#6ee7b7' },
  grief_loss:                  { label: 'Grief',          icon: '🕯️', color: '#94a3b8' },
  relationship_breakup:        { label: 'Breakup',        icon: '💔', color: '#fda4af' },
  panic_attacks:               { label: 'Panic Attacks',  icon: '💓', color: '#f9a8d4' },
  ocd_intrusive_thoughts:      { label: 'OCD',            icon: '🔄', color: '#7dd3fc' },
  lack_of_confidence:          { label: 'Confidence',     icon: '🌱', color: '#86efac' },
  sleep_problems:              { label: 'Sleep',          icon: '🌙', color: '#a5b4fc' },
  anger_management:            { label: 'Anger',          icon: '🔥', color: '#fca5a5' },
  financial_stress:            { label: 'Financial',      icon: '💸', color: '#fcd34d' },
  phobias:                     { label: 'Phobias',        icon: '😨', color: '#c084fc' },
  self_harm:                   { label: 'Self-Harm',      icon: '🆘', color: '#f87171' },
  divorce:                     { label: 'Divorce',        icon: '📋', color: '#94a3b8' },
  marriage_problems:           { label: 'Marriage',       icon: '💑', color: '#d8b4fe' },
  family_relationships:        { label: 'Family',         icon: '🏡', color: '#6ee7b7' },
  trust_issues:                { label: 'Trust Issues',   icon: '🤝', color: '#7dd3fc' },
  health_anxiety:              { label: 'Health Anxiety', icon: '🏥', color: '#7dd3fc' },
  eating_disorders:            { label: 'Eating',         icon: '🍃', color: '#86efac' },
  bullying_harassment:         { label: 'Bullying',       icon: '😠', color: '#fca5a5' },
  identity_sexual_orientation: { label: 'Identity',       icon: '🌈', color: '#c084fc' },
  addiction_substance_abuse:   { label: 'Addiction',      icon: '⚕️', color: '#6ee7b7' },
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

// ── Soul Ring ─────────────────────────────────────────────────────────────────
function SoulRing({ score, color }) {
  const r = 22, circ = 2 * Math.PI * r;
  const ringColor = score >= 85 ? '#a78bfa' : score >= 70 ? (color || '#a78bfa') : '#475569';
  return (
    <div style={{ position: 'relative', width: 54, height: 54, flexShrink: 0 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 54 54">
        <circle cx="27" cy="27" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
        <circle cx="27" cy="27" r={r} fill="none" stroke={ringColor} strokeWidth="3.5"
          strokeDasharray={`${circ * Math.min(score / 100, 1)} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${ringColor}80)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: ringColor, lineHeight: 1 }}>{score}%</span>
      </div>
    </div>
  );
}

// ── Match Card ─────────────────────────────────────────────────────────────────
function MatchCard({ match, index, onConnect, connecting }) {
  const prob = PROBLEM_META[match.primary_problem] || { label: 'Peer Support', icon: '🤝', color: '#a78bfa' };
  const initial = match.name?.[0]?.toUpperCase() || '?';
  const isConnecting = connecting === match.id;
  const avatarGrad = AVATAR_GRADS[index % AVATAR_GRADS.length];
  const circ = 2 * Math.PI * 20;

  return (
    <div
      style={{
        position: 'relative', borderRadius: 24, overflow: 'hidden',
        background: 'rgba(12,8,30,0.88)',
        backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(139,92,246,0.18)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08)';
      }}
    >
      {/* Subtle top glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ padding: '24px 24px 0', position: 'relative' }}>
        {/* Avatar + name + soft compatibility ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          {/* Moon-like soft avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', background: avatarGrad, opacity: 0.2, filter: 'blur(10px)' }} />
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: avatarGrad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700, color: '#fff',
              border: '1.5px solid rgba(139,92,246,0.35)',
              position: 'relative',
            }}>{initial}</div>
            <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#34d399', border: '2px solid rgba(12,8,30,0.9)', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 5px', fontSize: 18, fontWeight: 700, color: '#ede9fe', letterSpacing: '-0.01em', lineHeight: 1 }}>
              {match.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {match.age && <span style={{ fontSize: 11, color: 'rgba(196,181,253,0.45)' }}>{match.age} yrs</span>}
              {match.city && <>
                <span style={{ fontSize: 6, color: 'rgba(196,181,253,0.2)' }}>•</span>
                <span style={{ fontSize: 11, color: 'rgba(196,181,253,0.45)' }}>{match.city}</span>
              </>}
            </div>
          </div>

          {/* Soft amethyst compatibility ring */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 52, height: 52 }}>
              <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="3" />
                <circle cx="26" cy="26" r="20" fill="none" stroke="#8b5cf6" strokeWidth="3"
                  strokeDasharray={`${circ * Math.min(match.match_score / 100, 1)} ${circ}`}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(139,92,246,0.5))' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{match.match_score}%</span>
              </div>
            </div>
            <div style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.4)', marginTop: 3 }}>aligned</div>
          </div>
        </div>

        {/* Soft divider */}
        <div style={{ height: 1, background: 'rgba(139,92,246,0.1)', marginBottom: 18 }} />

        {/* Why matched label */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.45)', fontWeight: 600 }}>✦ Why you're matched</span>
        </div>

        {/* Match reason — gentle italic */}
        {match.match_reason && (
          <p style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(221,214,254,0.72)', lineHeight: 1.75, margin: '0 0 18px', letterSpacing: '0.01em' }}>
            "{match.match_reason}"
          </p>
        )}

        {/* Problem tags — nature-icon soft pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${prob.color}18`, color: prob.color, border: `1px solid ${prob.color}28` }}>
            {prob.icon} {prob.label}
          </span>
          {(match.secondary_problems || []).slice(0, 2).map(p => {
            const info = PROBLEM_META[p];
            return info ? (
              <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, fontSize: 11, background: 'rgba(139,92,246,0.06)', color: 'rgba(196,181,253,0.55)', border: '1px solid rgba(139,92,246,0.14)' }}>
                {info.icon} {info.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Gentle amethyst connect button */}
      <div style={{ padding: '0 24px 24px' }}>
        <button
          onClick={() => onConnect(match)}
          disabled={isConnecting}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: 14,
            fontSize: 13, fontWeight: 600, letterSpacing: '0.02em',
            background: isConnecting ? 'rgba(139,92,246,0.08)' : 'linear-gradient(135deg, rgba(99,66,199,0.85), rgba(139,92,246,0.85))',
            color: isConnecting ? 'rgba(167,139,250,0.4)' : '#fff',
            border: isConnecting ? '1px solid rgba(139,92,246,0.18)' : 'none',
            cursor: isConnecting ? 'default' : 'pointer',
            boxShadow: isConnecting ? 'none' : '0 6px 20px rgba(99,66,199,0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          {isConnecting ? 'Opening connection…' : '🌙  Begin Conversation'}
        </button>
      </div>
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
      const res    = await matchAPI.acceptMatch(match.id);
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

  const hour         = new Date().getHours();
  const greeting     = hour < 5 ? 'Still awake' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = hour < 5 ? '🌙' : hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  return (
    <>
      <style>{`
        @keyframes auroraFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          33% { transform: translate(8%, 6%) scale(1.15); opacity: 0.2; }
          66% { transform: translate(-6%, 8%) scale(0.95); opacity: 0.3; }
        }
        @keyframes auroraFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          40% { transform: translate(-10%, -8%) scale(1.2); opacity: 0.12; }
          70% { transform: translate(6%, 5%) scale(1.05); opacity: 0.25; }
        }
        @keyframes auroraFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.12; }
          50% { transform: translate(5%, -10%) scale(1.3); opacity: 0.07; }
        }
        @keyframes mandalaRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mandalaCounterRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes dustFloat {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
        }
        @keyframes cardShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.3; }
        }
        @keyframes heroGlow {
          0%, 100% { text-shadow: 0 0 40px rgba(139,92,246,0.2), 0 0 80px rgba(168,85,247,0.1); }
          50% { text-shadow: 0 0 60px rgba(139,92,246,0.35), 0 0 120px rgba(168,85,247,0.2); }
        }
        @keyframes lightRay {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.09; }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.3; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#09061a', position: 'relative', overflow: 'hidden' }}>

        {/* ── BACKGROUND SYSTEM ───────────────────────────────────────────── */}

        {/* Aurora blob 1 — huge, top-left */}
        <div style={{
          position: 'absolute', top: '-15%', left: '-20%',
          width: '75vw', height: '75vw',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(88,28,135,0.5) 0%, rgba(109,40,217,0.2) 30%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'auroraFloat1 18s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Aurora blob 2 — mid-right */}
        <div style={{
          position: 'absolute', top: '15%', right: '-15%',
          width: '55vw', height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.3) 0%, rgba(79,70,229,0.15) 40%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'auroraFloat2 24s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Aurora blob 3 — bottom gold */}
        <div style={{
          position: 'absolute', bottom: '5%', left: '20%',
          width: '45vw', height: '35vw',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, rgba(180,83,9,0.06) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'auroraFloat3 30s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Divine light rays from top center */}
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '120%', height: '70%',
          background: 'conic-gradient(from 260deg at 50% 0%, transparent 0deg, rgba(139,92,246,0.06) 5deg, transparent 10deg, transparent 20deg, rgba(168,85,247,0.04) 25deg, transparent 30deg, transparent 50deg, rgba(139,92,246,0.05) 55deg, transparent 60deg)',
          animation: 'lightRay 8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Sacred Geometry Mandala — Metatron's Cube */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'max(90vw, 90vh)', height: 'max(90vw, 90vh)',
          opacity: 0.055,
          pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%' }}>
            {/* Outer rotating ring of circles */}
            <g style={{ animation: 'mandalaRotate 120s linear infinite', transformOrigin: '300px 300px' }}>
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                return <circle key={i} cx={300 + 240 * Math.cos(angle)} cy={300 + 240 * Math.sin(angle)} r="60" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.7" />;
              })}
              <circle cx="300" cy="300" r="240" fill="none" stroke="#a78bfa" strokeWidth="0.3" opacity="0.4" />
              <circle cx="300" cy="300" r="180" fill="none" stroke="#a78bfa" strokeWidth="0.3" opacity="0.3" />
            </g>
            {/* Middle counter-rotating flower of life */}
            <g style={{ animation: 'mandalaCounterRotate 80s linear infinite', transformOrigin: '300px 300px' }}>
              {Array.from({ length: 6 }, (_, i) => {
                const angle = (i * 60) * Math.PI / 180;
                return <circle key={i} cx={300 + 120 * Math.cos(angle)} cy={300 + 120 * Math.sin(angle)} r="120" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.6" />;
              })}
              <circle cx="300" cy="300" r="120" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.6" />
            </g>
            {/* Inner rotating hexagon star */}
            <g style={{ animation: 'mandalaRotate 60s linear infinite', transformOrigin: '300px 300px' }}>
              {Array.from({ length: 6 }, (_, i) => {
                const a1 = (i * 60) * Math.PI / 180;
                const a2 = ((i * 60) + 180) * Math.PI / 180;
                return <line key={i} x1={300 + 80 * Math.cos(a1)} y1={300 + 80 * Math.sin(a1)} x2={300 + 80 * Math.cos(a2)} y2={300 + 80 * Math.sin(a2)} stroke="#a78bfa" strokeWidth="0.4" opacity="0.8" />;
              })}
              {[20, 40, 60, 80].map(r => <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="#a78bfa" strokeWidth="0.3" opacity="0.5" />)}
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30) * Math.PI / 180;
                return <line key={i} x1={300 + 10 * Math.cos(a)} y1={300 + 10 * Math.sin(a)} x2={300 + 80 * Math.cos(a)} y2={300 + 80 * Math.sin(a)} stroke="#a78bfa" strokeWidth="0.25" opacity="0.6" />;
              })}
            </g>
            {/* Outermost decorative rings */}
            <circle cx="300" cy="300" r="280" fill="none" stroke="#a78bfa" strokeWidth="0.2" strokeDasharray="4 8" opacity="0.4" />
            <circle cx="300" cy="300" r="295" fill="none" stroke="#a78bfa" strokeWidth="0.15" strokeDasharray="2 12" opacity="0.3" />
            {/* 24 diamond dots on outer ring */}
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i * 15) * Math.PI / 180;
              return <circle key={i} cx={300 + 278 * Math.cos(a)} cy={300 + 278 * Math.sin(a)} r="1.5" fill="#a78bfa" opacity="0.8" />;
            })}
            {/* Center jewel */}
            <circle cx="300" cy="300" r="8" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.9" />
            <circle cx="300" cy="300" r="3" fill="#a78bfa" opacity="0.7" />
          </svg>
        </div>

        {/* Star field — 25 stars */}
        {[
          {l:'5%',t:'12%',s:2.5,d:'0s'},{l:'12%',t:'68%',s:1.5,d:'1s'},{l:'19%',t:'35%',s:2,d:'2s'},
          {l:'28%',t:'8%',s:1,d:'0.5s'},{l:'35%',t:'80%',s:2.5,d:'1.5s'},{l:'43%',t:'22%',s:1.5,d:'3s'},
          {l:'51%',t:'90%',s:1,d:'0.8s'},{l:'58%',t:'15%',s:2,d:'2.2s'},{l:'66%',t:'55%',s:1.5,d:'1.2s'},
          {l:'74%',t:'5%',s:2.5,d:'0.3s'},{l:'81%',t:'78%',s:1,d:'2.8s'},{l:'88%',t:'32%',s:2,d:'1.7s'},
          {l:'94%',t:'60%',s:1.5,d:'0.6s'},{l:'3%',t:'45%',s:1,d:'2.5s'},{l:'47%',t:'48%',s:1,d:'3.5s'},
          {l:'62%',t:'88%',s:2,d:'1.9s'},{l:'76%',t:'42%',s:1.5,d:'0.4s'},{l:'90%',t:'15%',s:1,d:'3.2s'},
          {l:'22%',t:'92%',s:2,d:'2.1s'},{l:'55%',t:'3%',s:1.5,d:'0.9s'},{l:'38%',t:'58%',s:1,d:'3.8s'},
          {l:'70%',t:'25%',s:2.5,d:'1.4s'},{l:'15%',t:'52%',s:1,d:'2.6s'},{l:'83%',t:'65%',s:2,d:'0.7s'},
          {l:'96%',t:'38%',s:1.5,d:'3.1s'},
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', left: s.l, top: s.t,
            width: s.s, height: s.s, borderRadius: '50%',
            background: i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#c4b5fd' : '#fff',
            animation: `starTwinkle ${2.5 + (i % 4) * 0.8}s ease-in-out infinite`,
            animationDelay: s.d,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Gold dust particles — 10 upward-floating */}
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${8 + i * 9}%`,
            bottom: '-5%',
            width: i % 2 === 0 ? 2 : 3, height: i % 2 === 0 ? 2 : 3,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#a78bfa' : '#a78bfa',
            animation: `dustFloat ${12 + i * 3}s linear infinite`,
            animationDelay: `${i * 1.5}s`,
            pointerEvents: 'none',
          }} />
        ))}

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

        {/* ── HERO SECTION ────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 640, margin: '0 auto', padding: 'clamp(60px,10vw,100px) 20px 60px', textAlign: 'center' }}>

          {/* Time greeting pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 99, marginBottom: 28,
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.3)',
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{ fontSize: 14 }}>{greetingIcon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{greeting}</span>
          </div>

          {/* Main heading with glow */}
          <h1 style={{
            fontSize: 'clamp(2.8rem,7vw,4.5rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 16,
            animation: 'heroGlow 4s ease-in-out infinite',
          }}>
            Your Soul<br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #e9d5ff 40%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Matches</span>
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(196,181,253,0.7)', marginBottom: 32, lineHeight: 1.7, maxWidth: 420, margin: '0 auto 32px' }}>
            Kindred spirits who truly understand your journey
          </p>

          {/* Elaborate ornamental divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.4))' }} />
            <span style={{ color: 'rgba(139,92,246,0.5)', fontSize: 10 }}>◆</span>
            <div style={{ width: 20, height: 1, background: 'rgba(139,92,246,0.3)' }} />
            <span style={{ color: 'rgba(139,92,246,0.9)', fontSize: 22 }}>✦</span>
            <span style={{ color: 'rgba(139,92,246,0.5)', fontSize: 14 }}>⊹</span>
            <span style={{ color: 'rgba(139,92,246,0.9)', fontSize: 22 }}>✦</span>
            <div style={{ width: 20, height: 1, background: 'rgba(139,92,246,0.3)' }} />
            <span style={{ color: 'rgba(139,92,246,0.5)', fontSize: 10 }}>◆</span>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, rgba(139,92,246,0.4))' }} />
          </div>

          {/* Affirmation */}
          <p style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(221,214,254,0.6)', lineHeight: 1.8, maxWidth: 380, margin: '0 auto' }}>
            {affirmation}
          </p>
        </div>

        {/* ── MATCH COUNT PILL ────────────────────────────────────────────── */}
        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, position: 'relative', zIndex: 10 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '10px 22px', borderRadius: 99,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(139,92,246,0.35)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1)',
            }}>
              {/* Overlapping avatars */}
              <div style={{ display: 'flex' }}>
                {matches.slice(0, 4).map((m, i) => (
                  <div key={m.id} style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: AVATAR_GRADS[i % AVATAR_GRADS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    border: '2px solid #09061a',
                    marginLeft: i > 0 ? -8 : 0,
                    boxShadow: '0 0 8px rgba(0,0,0,0.4)',
                  }}>{m.name?.[0]}</div>
                ))}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(221,214,254,0.9)' }}>
                {matches.length} soul{matches.length !== 1 ? 's' : ''} matched to you
              </span>
              <span style={{ color: '#a78bfa', fontSize: 16 }}>✦</span>
            </div>
          </div>
        )}

        {/* ── CARDS ───────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 16px 120px', position: 'relative', zIndex: 10 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  padding: 24, borderRadius: 28,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(139,92,246,0.08)',
                }}>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(255,255,255,0.07)' }} />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {matches.map((match, i) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  index={i}
                  onConnect={handleConnect}
                  connecting={connecting}
                />
              ))}

              {/* Closing affirmation section */}
              <div style={{ textAlign: 'center', paddingTop: 24, paddingBottom: 16 }}>
                {/* Privacy note glass pill */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '12px 20px', borderRadius: 16, marginBottom: 24,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                }}>
                  <span style={{ fontSize: 14 }}>🔒</span>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(196,181,253,0.4)', lineHeight: 1.6 }}>
                    All matches are anonymous. Your personal details are never shared.
                  </p>
                </div>
                {/* Ornamental closer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 1, background: 'rgba(139,92,246,0.25)' }} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(196,181,253,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Every connection here is sacred</span>
                  <div style={{ width: 40, height: 1, background: 'rgba(139,92,246,0.25)' }} />
                </div>
                <p style={{ fontSize: 12, color: 'rgba(139,92,246,0.45)', letterSpacing: '0.06em' }}>
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
