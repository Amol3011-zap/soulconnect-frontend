import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';

// ── Demo matches (same IDs as Dashboard so chat pre-selects correctly) ──────────
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
  anxiety: { label: 'Anxiety', icon: '😰', color: '#a855f7' },
  depression: { label: 'Depression', icon: '💙', color: '#3b82f6' },
  loneliness: { label: 'Loneliness', icon: '😔', color: '#6366f1' },
  work_career_stress: { label: 'Work Stress', icon: '💼', color: '#0891b2' },
  ptsd_trauma: { label: 'Trauma', icon: '⚠️', color: '#ef4444' },
  grief_loss: { label: 'Grief', icon: '🕯️', color: '#94a3b8' },
  relationship_breakup: { label: 'Breakup', icon: '💔', color: '#f43f5e' },
  panic_attacks: { label: 'Panic Attacks', icon: '💓', color: '#f43f5e' },
  ocd_intrusive_thoughts: { label: 'OCD', icon: '🔄', color: '#0891b2' },
  lack_of_confidence: { label: 'Confidence', icon: '📉', color: '#7c3aed' },
  sleep_problems: { label: 'Sleep', icon: '😴', color: '#6366f1' },
  anger_management: { label: 'Anger', icon: '😤', color: '#ef4444' },
  financial_stress: { label: 'Financial', icon: '💸', color: '#f59e0b' },
  phobias: { label: 'Phobias', icon: '😨', color: '#7c3aed' },
  self_harm: { label: 'Self-Harm', icon: '🆘', color: '#ef4444' },
  divorce: { label: 'Divorce', icon: '📋', color: '#64748b' },
  marriage_problems: { label: 'Marriage', icon: '💑', color: '#7c3aed' },
  family_relationships: { label: 'Family', icon: '👨‍👩‍👧', color: '#059669' },
  trust_issues: { label: 'Trust Issues', icon: '🤝', color: '#0891b2' },
  health_anxiety: { label: 'Health Anxiety', icon: '🏥', color: '#0891b2' },
  eating_disorders: { label: 'Eating', icon: '🍽️', color: '#059669' },
  bullying_harassment: { label: 'Bullying', icon: '😠', color: '#ef4444' },
  identity_sexual_orientation: { label: 'Identity', icon: '🌈', color: '#7c3aed' },
  addiction_substance_abuse: { label: 'Addiction', icon: '⚕️', color: '#059669' },
};

const GRAD_COLORS = [
  'linear-gradient(135deg, #7c3aed, #2563eb)',
  'linear-gradient(135deg, #0891b2, #2563eb)',
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #d97706, #dc2626)',
];

const AFFIRMATIONS = [
  'You are not alone. You are exactly where you need to be. 🌟',
  'Your pain is valid. Your healing is possible. Your story matters. 💜',
  'Every soul here has walked a hard road. You are in good company. ✨',
  'The universe brought you here for a reason. Trust the process. 🌿',
  'Healing begins the moment you reach out. You already took that step. 💙',
];

// ── Flower-of-Life SVG Mandala ─────────────────────────────────────────────────
function Mandala() {
  const cx = 500, cy = 220;
  const rings = [45, 90, 135, 180, 225];
  const petalAngles = [0, 60, 120, 180, 240, 300];
  const spokeAngles = Array.from({ length: 12 }, (_, i) => i * 30);
  const dotAngles = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 440" preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.09 }}>
      {/* Concentric rings */}
      {rings.map(r => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke="white" strokeWidth="0.7" fill="none" />
      ))}
      {/* Flower of Life petals */}
      {petalAngles.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle key={`p${deg}`}
            cx={cx + 90 * Math.cos(rad)} cy={cy + 90 * Math.sin(rad)}
            r={90} stroke="white" strokeWidth="0.5" fill="none" />
        );
      })}
      {/* Inner petal ring */}
      {[30,90,150,210,270,330].map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle key={`ip${deg}`}
            cx={cx + 90 * Math.cos(rad)} cy={cy + 90 * Math.sin(rad)}
            r={45} stroke="white" strokeWidth="0.3" fill="none" />
        );
      })}
      {/* Radiating spokes */}
      {spokeAngles.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={`s${deg}`}
            x1={cx + 45 * Math.cos(rad)} y1={cy + 45 * Math.sin(rad)}
            x2={cx + 225 * Math.cos(rad)} y2={cy + 225 * Math.sin(rad)}
            stroke="white" strokeWidth="0.4" />
        );
      })}
      {/* Outer ring dots */}
      {dotAngles.map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle key={`d${deg}`}
            cx={cx + 225 * Math.cos(rad)} cy={cy + 225 * Math.sin(rad)}
            r="2.5" fill="white" fillOpacity="0.9" />
        );
      })}
      {/* Centre */}
      <circle cx={cx} cy={cy} r="10" stroke="white" strokeWidth="1" fill="none" />
      <circle cx={cx} cy={cy} r="3" fill="white" fillOpacity="0.5" />

      {/* Right-side smaller mandala */}
      {[0,72,144,216,288].map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle key={`rm${deg}`}
            cx={850 + 50 * Math.cos(rad)} cy={cy + 50 * Math.sin(rad)}
            r={50} stroke="white" strokeWidth="0.35" fill="none" />
        );
      })}
      <circle cx={850} cy={cy} r="8" stroke="white" strokeWidth="0.7" fill="none" />

      {/* Left small triangle-star */}
      {[0,120,240].map(deg => {
        const r1 = (deg * Math.PI) / 180, r2 = ((deg+60) * Math.PI) / 180;
        return (
          <line key={`t${deg}`}
            x1={120 + 60 * Math.cos(r1)} y1={cy + 60 * Math.sin(r1)}
            x2={120 + 60 * Math.cos(r2)} y2={cy + 60 * Math.sin(r2)}
            stroke="white" strokeWidth="0.5" />
        );
      })}
      {[0,60,120,180,240,300].map(deg => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={`ts${deg}`}
            x1={120} y1={cy}
            x2={120 + 60 * Math.cos(rad)} y2={cy + 60 * Math.sin(rad)}
            stroke="white" strokeWidth="0.3" />
        );
      })}
    </svg>
  );
}

// ── Twinkling stars ────────────────────────────────────────────────────────────
const STAR_POSITIONS = [
  { l: '6%', t: '18%', s: 2.5 }, { l: '13%', t: '72%', s: 1.5 }, { l: '22%', t: '38%', s: 1 },
  { l: '33%', t: '12%', s: 2 }, { l: '41%', t: '82%', s: 1.5 }, { l: '52%', t: '28%', s: 2 },
  { l: '61%', t: '65%', s: 1 }, { l: '71%', t: '8%', s: 2.5 }, { l: '79%', t: '78%', s: 1.5 },
  { l: '87%', t: '42%', s: 2 }, { l: '94%', t: '22%', s: 1 }, { l: '4%', t: '55%', s: 1.5 },
  { l: '47%', t: '52%', s: 1 }, { l: '68%', t: '88%', s: 2 }, { l: '18%', t: '92%', s: 1.5 },
  { l: '56%', t: '90%', s: 1 }, { l: '90%', t: '60%', s: 2.5 }, { l: '30%', t: '60%', s: 1 },
];

function Stars() {
  return (
    <>
      {STAR_POSITIONS.map((st, i) => (
        <div key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            left: st.l, top: st.t,
            width: st.s, height: st.s,
            background: 'white', opacity: 0.35,
            animationDelay: `${(i * 0.4) % 4}s`,
            animationDuration: `${2.5 + (i % 3)}s`,
          }}
        />
      ))}
    </>
  );
}

// ── Score ring ─────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 20, circ = 2 * Math.PI * r;
  const color = score >= 85 ? '#a855f7' : score >= 70 ? '#818cf8' : '#f59e0b';
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(168,85,247,0.12)" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${circ * (score / 100)} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}

// ── Match card ─────────────────────────────────────────────────────────────────
function MatchCard({ match, index, onConnect, connecting }) {
  const [expanded, setExpanded] = useState(false);
  const prob = PROBLEM_META[match.primary_problem] || { label: 'Peer Support', icon: '🤝', color: '#7c3aed' };
  const grad = GRAD_COLORS[index % GRAD_COLORS.length];
  const initial = match.name?.[0]?.toUpperCase() || '?';
  const isConnecting = connecting === match.id;

  return (
    <div className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 match-card"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(168,85,247,0.2)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}>

      {/* Top gradient stripe */}
      <div className="h-1.5" style={{ background: grad }} />

      {/* Hover inner glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(168,85,247,0.25)' }} />

      <div className="p-5">
        {/* Avatar + info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative shrink-0">
            {/* Aura glow */}
            <div className="absolute inset-0 rounded-2xl"
              style={{ background: grad, filter: 'blur(10px)', transform: 'scale(1.2)', opacity: 0.5 }} />
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              style={{ background: grad }}>
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2"
              style={{ borderColor: 'var(--bg-card)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-white">
                  {match.name || 'Anonymous'}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {match.age && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{match.age} yrs</span>}
                  {match.city && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>📍 {match.city}</span>
                    </>
                  )}
                </div>
              </div>
              <ScoreRing score={match.match_score || 0} />
            </div>
          </div>
        </div>

        {/* Problem tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: `${prob.color}18`, color: prob.color, border: `1px solid ${prob.color}30` }}>
            {prob.icon} {prob.label}
          </span>
          {(match.secondary_problems || []).slice(0, 2).map(p => {
            const info = PROBLEM_META[p];
            return info ? (
              <span key={p} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {info.icon} {info.label}
              </span>
            ) : null;
          })}
        </div>

        {/* Match reason — spiritual framing */}
        {match.match_reason && (
          <div className="rounded-2xl px-4 py-3 mb-4 relative"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(37,99,235,0.05))', border: '1px solid rgba(124,58,237,0.12)' }}>
            <span className="text-sm absolute left-3 top-2.5 opacity-40">✨</span>
            <p className="text-xs italic pl-5 leading-relaxed" style={{ color: 'rgba(216,180,254,0.75)' }}>
              "{match.match_reason}"
            </p>
          </div>
        )}

        {/* Their story (real matches) */}
        {match.problem_context && (
          <>
            <button onClick={() => setExpanded(!expanded)}
              className="text-xs text-purple-500 font-semibold mb-3 hover:text-purple-400">
              {expanded ? '▲ Less' : '▼ Their story'}
            </button>
            {expanded && (
              <p className="text-xs italic mb-3 leading-relaxed rounded-xl px-3 py-2"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                "{match.problem_context}"
              </p>
            )}
          </>
        )}

        {/* CTA */}
        <button
          onClick={() => onConnect(match)}
          disabled={isConnecting}
          className="w-full h-11 rounded-2xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: grad, boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
          {isConnecting
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Opening chat...</>
            : <><span>💬</span> Start Conversation</>}
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
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
    } catch {
      setMatches(DEMO_MATCHES);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (match) => {
    setConnecting(match.id);
    if (match.isDemo) {
      // Demo match → open Dashboard with this match pre-selected
      setTimeout(() => {
        navigate('/dashboard', { state: { matchId: match.id } });
      }, 500);
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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Still up?' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = hour < 5 ? '🌙' : hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  return (
    <div className="min-h-screen matches-cosmic-bg">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
          {toast}
        </div>
      )}

      {/* ── SPIRITUAL HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 280 }}>

        {/* Mandala sacred geometry */}
        <Mandala />

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          <Stars />
        </div>

        {/* Purple glow orb */}
        <div className="absolute pointer-events-none"
          style={{
            top: '50%', left: '42%', transform: 'translate(-50%,-50%)',
            width: 340, height: 340, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }} />
        {/* Blue glow orb */}
        <div className="absolute pointer-events-none"
          style={{
            top: '40%', right: '15%',
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }} />
        {/* Gold accent orb */}
        <div className="absolute pointer-events-none"
          style={{
            bottom: 0, left: '20%',
            width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
            filter: 'blur(25px)',
          }} />

        {/* Content */}
        <div className="relative z-10 max-w-lg mx-auto px-5 pt-9 pb-14">
          <p className="font-medium text-sm mb-1" style={{ color: 'rgba(216,180,254,0.7)' }}>
            {greeting} {greetingIcon}
          </p>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Your Matches</h1>
          <p className="text-sm mb-7" style={{ color: 'rgba(196,181,253,0.65)' }}>
            Souls who truly understand your journey
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.35))' }} />
            <span style={{ color: 'rgba(216,180,254,0.5)', fontSize: 18 }}>⊹</span>
            <span style={{ color: 'rgba(216,180,254,0.8)', fontSize: 22 }}>✦</span>
            <span style={{ color: 'rgba(216,180,254,0.5)', fontSize: 18 }}>⊹</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(168,85,247,0.35))' }} />
          </div>

          {/* Affirmation */}
          <p className="text-center text-sm font-light italic leading-relaxed"
            style={{ color: 'rgba(221,214,254,0.75)' }}>
            "{affirmation}"
          </p>
        </div>
      </div>

      {/* Fade transition */}
      <div className="h-8 -mt-1 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(9,0,15,0.6), transparent)' }} />

      {/* Match count pill */}
      {!loading && (
        <div className="flex justify-center -mt-5 mb-4 relative z-10">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full shadow-lg"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(168,85,247,0.3)', backdropFilter: 'blur(12px)' }}>
            <div className="flex -space-x-2">
              {matches.slice(0, 4).map((m, i) => (
                <div key={m.id} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: GRAD_COLORS[i % GRAD_COLORS.length], borderColor: 'rgba(0,0,0,0.3)' }}>
                  {m.name?.[0]?.toUpperCase() || '?'}
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold text-white">
              {matches.length} soul{matches.length !== 1 ? 's' : ''} matched to you
            </span>
            <span className="text-purple-400 text-base">✨</span>
          </div>
        </div>
      )}

      {/* ── CARDS ── */}
      <div className="max-w-lg mx-auto px-4 pb-10">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl p-5 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <div className="h-3 rounded-full w-1/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>
                </div>
                <div className="h-3 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-3 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i}
                onConnect={handleConnect} connecting={connecting} />
            ))}

            {/* Safety note */}
            <div className="flex items-start gap-3 rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
              <span className="text-lg shrink-0">🔒</span>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                All matches are anonymous. Your personal details are never shared without your consent. You are always in control of your story.
              </p>
            </div>

            {/* Spiritual closing */}
            <div className="text-center py-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span style={{ color: 'rgba(168,85,247,0.4)' }}>✦</span>
                <span className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>Every connection here is sacred</span>
                <span style={{ color: 'rgba(168,85,247,0.4)' }}>✦</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(168,85,247,0.5)' }}>You are loved · You matter · You will heal</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
