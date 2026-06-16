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

// Warm, luxurious avatar gradients
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

// ── Sacred Geometry ────────────────────────────────────────────────────────────
function SacredGeometry() {
  const cx = 500, cy = 220;
  const petalAngles = [0, 60, 120, 180, 240, 300];
  const rings = [40, 80, 120, 160, 210];
  const spokeAngles = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 440" preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.07 }}>
      {rings.map(r => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke="#d4af37" strokeWidth="0.6" fill="none" />
      ))}
      {petalAngles.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle key={`p${deg}`}
            cx={cx + 80 * Math.cos(rad)} cy={cy + 80 * Math.sin(rad)}
            r={80} stroke="#d4af37" strokeWidth="0.4" fill="none" />
        );
      })}
      {spokeAngles.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={`s${deg}`}
            x1={cx + 40 * Math.cos(rad)} y1={cy + 40 * Math.sin(rad)}
            x2={cx + 210 * Math.cos(rad)} y2={cy + 210 * Math.sin(rad)}
            stroke="#d4af37" strokeWidth="0.3" />
        );
      })}
      {Array.from({ length: 24 }, (_, i) => {
        const rad = (i * 15 * Math.PI) / 180;
        return <circle key={`d${i}`} cx={cx + 210 * Math.cos(rad)} cy={cy + 210 * Math.sin(rad)} r="2" fill="#d4af37" fillOpacity="0.8" />;
      })}
      <circle cx={cx} cy={cy} r="8" stroke="#d4af37" strokeWidth="1" fill="none" />
      <circle cx={cx} cy={cy} r="2.5" fill="#d4af37" fillOpacity="0.6" />
    </svg>
  );
}

// ── Floating particles ─────────────────────────────────────────────────────────
const PARTICLES = [
  { l: '8%',  t: '15%', s: 2 },   { l: '16%', t: '70%', s: 1.5 },
  { l: '25%', t: '40%', s: 1 },   { l: '35%', t: '10%', s: 2.5 },
  { l: '44%', t: '80%', s: 1.5 }, { l: '55%', t: '25%', s: 2 },
  { l: '64%', t: '60%', s: 1 },   { l: '73%', t: '8%',  s: 2.5 },
  { l: '82%', t: '75%', s: 1.5 }, { l: '90%', t: '38%', s: 2 },
  { l: '96%', t: '18%', s: 1 },   { l: '4%',  t: '52%', s: 1.5 },
  { l: '50%', t: '50%', s: 1 },   { l: '70%', t: '85%', s: 2 },
];

function Particles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <div key={i} className="absolute rounded-full animate-pulse"
          style={{
            left: p.l, top: p.t, width: p.s, height: p.s,
            background: i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#c4b5fd' : 'white',
            opacity: 0.4,
            animationDelay: `${(i * 0.5) % 4}s`,
            animationDuration: `${2.5 + (i % 3)}s`,
          }} />
      ))}
    </>
  );
}

// ── Soul compatibility ring ────────────────────────────────────────────────────
function SoulRing({ score }) {
  const r = 22, circ = 2 * Math.PI * r;
  const gold = '#d4af37';
  const color = score >= 85 ? gold : score >= 70 ? '#a78bfa' : '#94a3b8';
  return (
    <div className="relative shrink-0" style={{ width: 52, height: 52 }}>
      <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="3.5" />
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${circ * Math.min(score / 100, 1)} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span style={{ fontSize: 10, fontWeight: 700, color, lineHeight: 1 }}>{score}%</span>
      </div>
    </div>
  );
}

// ── Match card ─────────────────────────────────────────────────────────────────
function MatchCard({ match, index, onConnect, connecting }) {
  const [expanded, setExpanded] = useState(false);
  const prob = PROBLEM_META[match.primary_problem] || { label: 'Peer Support', icon: '🤝', color: '#a78bfa' };
  const grad = AVATAR_GRADS[index % AVATAR_GRADS.length];
  const initial = match.name?.[0]?.toUpperCase() || '?';
  const isConnecting = connecting === match.id;

  return (
    <div className="group relative rounded-3xl overflow-hidden transition-all duration-400"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(212,175,55,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 16px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.3)';
        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)';
        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)';
      }}>

      {/* Shimmer top bar */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)' }} />

      <div style={{ padding: '20px 22px 22px' }}>

        {/* Avatar + name row */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl opacity-50"
              style={{ background: grad, filter: 'blur(12px)', transform: 'scale(1.3)' }} />
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              style={{ background: grad, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2"
              style={{ borderColor: '#0c0515' }} />
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white leading-tight" style={{ fontSize: 17 }}>
                  {match.name || 'Anonymous'}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {match.age && (
                    <span style={{ fontSize: 12, color: 'rgba(196,181,253,0.6)' }}>{match.age} yrs</span>
                  )}
                  {match.city && (
                    <>
                      <span style={{ color: 'rgba(196,181,253,0.2)', fontSize: 10 }}>●</span>
                      <span style={{ fontSize: 12, color: 'rgba(196,181,253,0.6)' }}>📍 {match.city}</span>
                    </>
                  )}
                </div>
              </div>
              <SoulRing score={match.match_score || 0} />
            </div>
          </div>
        </div>

        {/* Problem tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: `${prob.color}18`,
              color: prob.color,
              border: `1px solid ${prob.color}35`,
              letterSpacing: '0.02em',
            }}>
            {prob.icon} {prob.label}
          </span>
          {(match.secondary_problems || []).slice(0, 2).map(p => {
            const info = PROBLEM_META[p];
            return info ? (
              <span key={p} className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(196,181,253,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {info.icon} {info.label}
              </span>
            ) : null;
          })}
        </div>

        {/* Match reason */}
        {match.match_reason && (
          <div className="rounded-2xl px-4 py-3.5 mb-5 flex gap-3"
            style={{ background: 'rgba(212,175,55,0.05)', borderLeft: '2px solid rgba(212,175,55,0.4)', borderRadius: '0 12px 12px 0' }}>
            <span style={{ color: '#d4af37', fontSize: 16, lineHeight: 1.6, flexShrink: 0 }}>✦</span>
            <p className="text-xs italic leading-relaxed" style={{ color: 'rgba(221,214,254,0.7)' }}>
              "{match.match_reason}"
            </p>
          </div>
        )}

        {match.problem_context && (
          <>
            <button onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold mb-3 transition-colors"
              style={{ color: '#d4af37' }}>
              {expanded ? '▲ Less' : '▼ Their story'}
            </button>
            {expanded && (
              <p className="text-xs italic mb-4 leading-relaxed rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(196,181,253,0.65)', border: '1px solid rgba(255,255,255,0.08)' }}>
                "{match.problem_context}"
              </p>
            )}
          </>
        )}

        {/* CTA */}
        <button
          onClick={() => onConnect(match)}
          disabled={isConnecting}
          className="w-full rounded-2xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
          style={{
            height: 48,
            background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #a855f7 100%)',
            boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
            letterSpacing: '0.03em',
          }}>
          {isConnecting
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Opening chat...</>
            : <><span style={{ fontSize: 15 }}>💬</span> Begin Conversation</>}
        </button>
      </div>

      {/* Bottom shimmer */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)' }} />
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [toast, setToast] = useState(null);
  const [affirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const navigate = useNavigate();

  useEffect(() => { fetchMatches(); }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await matchAPI.findMatches();
      const real = res.data.matches || [];
      setMatches(real.length > 0 ? real : DEMO_MATCHES);
    } catch { setMatches(DEMO_MATCHES); }
    finally { setLoading(false); }
  };

  const handleConnect = async (match) => {
    setConnecting(match.id);
    if (match.isDemo) {
      setTimeout(() => navigate('/chat', { state: { matchId: match.id } }), 500);
      return;
    }
    try {
      const res = await matchAPI.acceptMatch(match.id);
      const chatId = res.data?.match_id || match.id;
      showToast('✅ Connected! Opening chat...');
      setTimeout(() => navigate(`/chat/${chatId}`), 900);
    } catch {
      showToast('❌ Could not connect. Try again.');
      setConnecting(null);
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Still awake' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = hour < 5 ? '🌙' : hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #080215 0%, #120830 40%, #0e0a28 100%)' }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: '1px solid rgba(168,85,247,0.4)' }}>
          {toast}
        </div>
      )}

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 320 }}>

        {/* Deep layered background */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #0c0220 0%, #1e0a44 35%, #150d3a 70%, #08091e 100%)' }} />

        {/* Gold/purple glow orbs */}
        <div className="absolute pointer-events-none" style={{ top: '30%', left: '38%', transform: 'translate(-50%,-50%)', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)', filter: 'blur(30px)' }} />
        <div className="absolute pointer-events-none" style={{ top: '20%', right: '10%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 65%)', filter: 'blur(25px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: 0, left: '15%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 65%)', filter: 'blur(20px)' }} />

        {/* Sacred geometry */}
        <SacredGeometry />

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none"><Particles /></div>

        {/* Content */}
        <div className="relative z-10 max-w-xl mx-auto px-6 pt-12 pb-16 text-center">

          {/* Greeting */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <span style={{ fontSize: 13 }}>{greetingIcon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#d4af37', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {greeting}
            </span>
          </div>

          <h1 className="font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Your Soul Matches
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(196,181,253,0.7)', marginBottom: 32, lineHeight: 1.6 }}>
            Kindred spirits who truly understand your journey
          </p>

          {/* Gold ornamental divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5))' }} />
            <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: 20 }}>✦</span>
            <span style={{ color: 'rgba(212,175,55,0.4)', fontSize: 14 }}>⊹</span>
            <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: 20 }}>✦</span>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.5))' }} />
          </div>

          {/* Affirmation */}
          <p style={{ fontSize: 14, fontStyle: 'italic', color: 'rgba(221,214,254,0.65)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
            {affirmation}
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #080215)' }} />
      </div>

      {/* Match count pill */}
      {!loading && (
        <div className="flex justify-center mb-6 relative z-10" style={{ marginTop: -16 }}>
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,175,55,0.3)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}>
            <div className="flex -space-x-2">
              {matches.slice(0, 4).map((m, i) => (
                <div key={m.id} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: AVATAR_GRADS[i % AVATAR_GRADS.length], borderColor: '#080215' }}>
                  {m.name?.[0]?.toUpperCase() || '?'}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(221,214,254,0.9)', letterSpacing: '0.02em' }}>
              {matches.length} soul{matches.length !== 1 ? 's' : ''} matched to you
            </span>
            <span style={{ color: '#d4af37', fontSize: 14 }}>✦</span>
          </div>
        </div>
      )}

      {/* ── CARDS ── */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px 100px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl animate-pulse"
                style={{ padding: 22, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="flex gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <div className="h-3 rounded-full w-1/3" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  </div>
                </div>
                <div className="h-3 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="h-3 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {matches.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i} onConnect={handleConnect} connecting={connecting} />
            ))}

            {/* Privacy note */}
            <div className="flex items-start gap-3 rounded-2xl"
              style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.6 }}>🔒</span>
              <p style={{ fontSize: 12, lineHeight: 1.7, color: 'rgba(196,181,253,0.45)' }}>
                All matches are anonymous. Your personal details are never shared without your consent. You are always in control of your story.
              </p>
            </div>

            {/* Closing affirmation */}
            <div className="text-center" style={{ paddingTop: 12, paddingBottom: 8 }}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div style={{ width: 32, height: 1, background: 'rgba(212,175,55,0.3)' }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(196,181,253,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Every connection here is sacred
                </span>
                <div style={{ width: 32, height: 1, background: 'rgba(212,175,55,0.3)' }} />
              </div>
              <p style={{ fontSize: 12, color: 'rgba(212,175,55,0.5)', letterSpacing: '0.05em' }}>
                You are loved · You matter · You will heal
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
