import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { useAuthStore } from '../store/auth';

const DEMO_MATCHES = [
  {
    id: 101, name: 'Priya', age: 26, city: 'Mumbai', isDemo: true,
    primary_problem: 'anxiety', match_score: 94,
    match_reason: 'Both navigating social anxiety and overthinking spirals',
    secondary_problems: ['panic_attacks', 'sleep_problems'],
    avatar_color: '#6D5EF5',
  },
  {
    id: 102, name: 'Rohan', age: 29, city: 'Pune', isDemo: true,
    primary_problem: 'depression', match_score: 88,
    match_reason: 'Similar experiences with low motivation and isolation',
    secondary_problems: ['loneliness'],
    avatar_color: '#0891B2',
  },
  {
    id: 103, name: 'Aisha', age: 24, city: 'Bangalore', isDemo: true,
    primary_problem: 'loneliness', match_score: 82,
    match_reason: 'Both dealing with loneliness after a big life change',
    secondary_problems: ['lack_of_confidence'],
    avatar_color: '#059669',
  },
  {
    id: 104, name: 'Dev', age: 31, city: 'Delhi', isDemo: true,
    primary_problem: 'work_career_stress', match_score: 79,
    match_reason: 'Both burned out from high-pressure work environments',
    secondary_problems: ['sleep_problems', 'anxiety'],
    avatar_color: '#D97706',
  },
];

const PROBLEM_META = {
  anxiety:                     { label: 'Anxiety',        icon: '🌀', bg: '#EDE9FE', color: '#6D5EF5' },
  depression:                  { label: 'Depression',     icon: '💙', bg: '#DBEAFE', color: '#2563EB' },
  loneliness:                  { label: 'Loneliness',     icon: '🕊️', bg: '#F3E8FF', color: '#9333EA' },
  work_career_stress:          { label: 'Work Stress',    icon: '⚡', bg: '#FEF3C7', color: '#D97706' },
  ptsd_trauma:                 { label: 'Trauma',         icon: '🌿', bg: '#D1FAE5', color: '#059669' },
  grief_loss:                  { label: 'Grief',          icon: '🕯️', bg: '#F1F5F9', color: '#475569' },
  relationship_breakup:        { label: 'Breakup',        icon: '💔', bg: '#FFE4E6', color: '#F43F5E' },
  panic_attacks:               { label: 'Panic Attacks',  icon: '💓', bg: '#FCE7F3', color: '#EC4899' },
  ocd_intrusive_thoughts:      { label: 'OCD',            icon: '🔄', bg: '#DBEAFE', color: '#3B82F6' },
  lack_of_confidence:          { label: 'Confidence',     icon: '🌱', bg: '#DCFCE7', color: '#16A34A' },
  sleep_problems:              { label: 'Sleep',          icon: '🌙', bg: '#EDE9FE', color: '#7C3AED' },
  anger_management:            { label: 'Anger',          icon: '🔥', bg: '#FEE2E2', color: '#DC2626' },
  financial_stress:            { label: 'Financial',      icon: '💸', bg: '#FEF9C3', color: '#CA8A04' },
  marriage_problems:           { label: 'Marriage',       icon: '💑', bg: '#F3E8FF', color: '#9333EA' },
  family_relationships:        { label: 'Family',         icon: '🏡', bg: '#D1FAE5', color: '#059669' },
  trust_issues:                { label: 'Trust Issues',   icon: '🤝', bg: '#DBEAFE', color: '#2563EB' },
};

const AFFIRMATIONS = [
  '"The universe brought you here for a reason. Trust the process."',
  '"Your pain is valid. Your healing is real. Your story matters."',
  '"You are not alone. You are exactly where you need to be."',
  '"Healing begins the moment you reach out. You already took that step."',
];

// Sacred geometry SVG overlay
function SacredGeometry() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
      viewBox="0 0 600 300"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <style>{`
          @keyframes sgRotate { from { transform: rotate(0deg); transform-origin: 300px 150px; } to { transform: rotate(360deg); transform-origin: 300px 150px; } }
          @keyframes sgCounter { from { transform: rotate(0deg); transform-origin: 300px 150px; } to { transform: rotate(-360deg); transform-origin: 300px 150px; } }
          @media (prefers-reduced-motion: reduce) { .sg-r, .sg-c { animation: none !important; } }
        `}</style>
      </defs>
      <g className="sg-r" style={{ animation: 'sgRotate 90s linear infinite' }}>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i * 60) * Math.PI / 180;
          return <circle key={i} cx={300 + 90 * Math.cos(a)} cy={150 + 90 * Math.sin(a)} r="90" fill="none" stroke="white" strokeWidth="0.6" opacity="0.8" />;
        })}
        <circle cx="300" cy="150" r="90" fill="none" stroke="white" strokeWidth="0.6" opacity="0.8" />
      </g>
      <g className="sg-c" style={{ animation: 'sgCounter 60s linear infinite' }}>
        <circle cx="300" cy="150" r="140" fill="none" stroke="white" strokeWidth="0.4" strokeDasharray="4 8" opacity="0.6" />
        <circle cx="300" cy="150" r="165" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="2 10" opacity="0.4" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30) * Math.PI / 180;
          return <circle key={i} cx={300 + 164 * Math.cos(a)} cy={150 + 164 * Math.sin(a)} r="3" fill="white" opacity="0.7" />;
        })}
      </g>
      <circle cx="300" cy="150" r="5" fill="white" opacity="0.9" />
    </svg>
  );
}

// Compatibility ring (SVG donut)
function CompatRing({ score, color }) {
  const r = 20, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 50, height: 50, flexShrink: 0 }}>
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 50 50">
        <circle cx="25" cy="25" r={r} fill="none" stroke="#EDE9FE" strokeWidth="3" />
        <circle cx="25" cy="25" r={r} fill="none" stroke={color || '#6D5EF5'} strokeWidth="3"
          strokeDasharray={`${circ * Math.min(score / 100, 1)} ${circ}`}
          strokeLinecap="round" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: color || '#6D5EF5', lineHeight: 1 }}>{score}%</span>
      </div>
    </div>
  );
}

// Light premium match card
function MatchCard({ match, index, onConnect, connecting }) {
  const prob = PROBLEM_META[match.primary_problem] || { label: 'Peer Support', icon: '🤝', bg: '#EDE9FE', color: '#6D5EF5' };
  const isConnecting = connecting === match.id;
  const initial = match.name?.[0]?.toUpperCase() || '?';

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 20,
        border: '1px solid #EDE9FE',
        boxShadow: '0 2px 16px rgba(109,94,245,0.08)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(109,94,245,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(109,94,245,0.08)';
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${match.avatar_color || '#6D5EF5'}, #A78BFA)` }} />

      <div style={{ padding: '20px 20px 0' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: `linear-gradient(135deg, ${match.avatar_color || '#6D5EF5'}, #A78BFA)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: '#fff',
            }}>{initial}</div>
            {/* Online indicator */}
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 10, height: 10, borderRadius: '50%',
              background: '#7DD3A0',
              border: '2px solid #fff',
              boxShadow: '0 0 6px rgba(125,211,160,0.5)',
            }} />
          </div>

          {/* Name + location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 3px', fontSize: 16, fontWeight: 700, color: '#1F2937', lineHeight: 1 }}>
              {match.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {match.age && <span style={{ fontSize: 12, color: '#9CA3AF' }}>{match.age} yrs</span>}
              {match.city && <>
                <span style={{ fontSize: 6, color: '#D1D5DB' }}>•</span>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>{match.city}</span>
              </>}
            </div>
          </div>

          {/* Compatibility ring */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <CompatRing score={match.match_score} color={match.avatar_color || '#6D5EF5'} />
            <div style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', marginTop: 2 }}>match</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#F5F3FF', marginBottom: 14 }} />

        {/* Why matched */}
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A78BFA', fontWeight: 600 }}>✦ Why you're matched</span>
        </div>
        {match.match_reason && (
          <p style={{
            fontSize: 13, fontStyle: 'italic', color: '#4B5563',
            lineHeight: 1.7, margin: '0 0 14px',
          }}>
            "{match.match_reason}"
          </p>
        )}

        {/* Problem tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: prob.bg, color: prob.color,
          }}>
            {prob.icon} {prob.label}
          </span>
          {(match.secondary_problems || []).slice(0, 2).map(p => {
            const info = PROBLEM_META[p];
            return info ? (
              <span key={p} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 20, fontSize: 11,
                background: '#F5F3FF', color: '#6B7280',
                border: '1px solid #EDE9FE',
              }}>
                {info.icon} {info.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={() => onConnect(match)}
          disabled={isConnecting}
          style={{
            width: '100%', padding: '12px 20px', borderRadius: 14,
            fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
            background: isConnecting
              ? '#F5F3FF'
              : 'linear-gradient(135deg, #6D5EF5, #8B5CF6)',
            color: isConnecting ? '#A78BFA' : '#FFFFFF',
            border: isConnecting ? '1px solid #EDE9FE' : 'none',
            cursor: isConnecting ? 'default' : 'pointer',
            boxShadow: isConnecting ? 'none' : '0 4px 16px rgba(109,94,245,0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          {isConnecting ? 'Connecting…' : '💫  Connect Soul'}
        </button>
      </div>
    </div>
  );
}

// Stat card
function StatCard({ icon, value, label, color }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 16,
      padding: '16px 18px',
      border: '1px solid #EDE9FE',
      boxShadow: '0 2px 12px rgba(109,94,245,0.06)',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, marginBottom: 10,
      }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#1F2937', marginBottom: 3, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// Right sidebar — Daily Intention, Angel Number, Breathing Widget
function RightSidebar() {
  const [breathPhase, setBreathPhase] = useState('idle'); // idle | inhale | hold | exhale
  const [breathCount, setBreathCount] = useState(0);
  const [breathTimer, setBreathTimer] = useState(null);

  const startBreathing = () => {
    setBreathPhase('inhale');
    setBreathCount(c => c + 1);
  };

  useEffect(() => {
    if (breathPhase === 'inhale') {
      const t = setTimeout(() => setBreathPhase('hold'), 4000);
      setBreathTimer(t);
    } else if (breathPhase === 'hold') {
      const t = setTimeout(() => setBreathPhase('exhale'), 4000);
      setBreathTimer(t);
    } else if (breathPhase === 'exhale') {
      const t = setTimeout(() => {
        setBreathCount(c => c + 1);
        setBreathPhase('inhale');
      }, 6000);
      setBreathTimer(t);
    }
    return () => clearTimeout(breathTimer);
  }, [breathPhase]);

  const stopBreathing = () => {
    clearTimeout(breathTimer);
    setBreathPhase('idle');
    setBreathCount(0);
  };

  const breathLabel = { idle: 'Start', inhale: 'Breathe in...', hold: 'Hold...', exhale: 'Breathe out...' };
  const breathSize = breathPhase === 'inhale' ? 80 : breathPhase === 'hold' ? 80 : 52;

  const INTENTIONS = [
    "Today I choose peace over perfection.",
    "I am worthy of love and connection.",
    "My struggles do not define me — my resilience does.",
    "I give myself permission to heal at my own pace.",
    "Every small step forward is progress.",
  ];
  const ANGEL_MESSAGES = {
    111: "A portal of new beginnings is open. Trust the path unfolding before you.",
    222: "Balance and harmony are aligning in your life. You are on the right path.",
    333: "The universe is calling you to create. Express your truth boldly.",
    444: "You are divinely protected and supported. You are not alone.",
    555: "Change is coming — embrace it with an open heart.",
  };

  const today = new Date();
  const intentionIndex = today.getDate() % INTENTIONS.length;
  const angelNumbers = [111, 222, 333, 444, 555];
  const angelNumber = angelNumbers[today.getDate() % angelNumbers.length];

  return (
    <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Daily Intention */}
      <div style={{
        background: 'linear-gradient(135deg, #6D5EF5, #8B5CF6)',
        borderRadius: 20, padding: '20px',
        boxShadow: '0 8px 32px rgba(109,94,245,0.25)',
        color: '#fff',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 10 }}>
          ✦ Daily Intention
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', margin: 0, opacity: 0.95 }}>
          "{INTENTIONS[intentionIndex]}"
        </p>
        <div style={{ marginTop: 14, height: 1, background: 'rgba(255,255,255,0.2)' }} />
        <p style={{ margin: '12px 0 0', fontSize: 11, opacity: 0.65 }}>
          {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Angel Number */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20, padding: '20px',
        border: '1px solid #EDE9FE',
        boxShadow: '0 2px 16px rgba(109,94,245,0.07)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A78BFA', marginBottom: 10 }}>
          ✦ Angel Number
        </div>
        <div style={{
          fontSize: 48, fontWeight: 900, letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #6D5EF5, #A78BFA)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 10, lineHeight: 1,
        }}>
          {angelNumber}
        </div>
        <p style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.65, margin: 0 }}>
          {ANGEL_MESSAGES[angelNumber]}
        </p>
      </div>

      {/* Breathing Widget */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20, padding: '20px',
        border: '1px solid #EDE9FE',
        boxShadow: '0 2px 16px rgba(109,94,245,0.07)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A78BFA', marginBottom: 16 }}>
          ✦ Breathing Exercise
        </div>

        {/* Breathing orb */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14, height: 100,
        }}>
          <div style={{
            width: breathSize, height: breathSize, borderRadius: '50%',
            background: breathPhase === 'idle'
              ? 'linear-gradient(135deg, #EDE9FE, #F5F3FF)'
              : 'linear-gradient(135deg, #6D5EF5, #A78BFA)',
            transition: 'width 4s ease, height 4s ease, background 1s ease',
            boxShadow: breathPhase !== 'idle' ? '0 0 30px rgba(109,94,245,0.35)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: breathPhase === 'idle' ? 24 : 20 }}>
              {breathPhase === 'idle' ? '🌸' : '🫁'}
            </span>
          </div>
        </div>

        <p style={{
          fontSize: 13, fontWeight: 600, marginBottom: 14,
          color: breathPhase === 'idle' ? '#9CA3AF' : '#6D5EF5',
        }}>
          {breathLabel[breathPhase]}
          {breathPhase !== 'idle' && breathCount > 0 && (
            <span style={{ fontSize: 11, color: '#A78BFA', marginLeft: 6 }}>cycle {breathCount}</span>
          )}
        </p>

        <button
          onClick={breathPhase === 'idle' ? startBreathing : stopBreathing}
          style={{
            padding: '10px 24px', borderRadius: 12, fontSize: 12, fontWeight: 600,
            background: breathPhase === 'idle'
              ? 'linear-gradient(135deg, #6D5EF5, #8B5CF6)'
              : '#FEF2F2',
            color: breathPhase === 'idle' ? '#fff' : '#EF4444',
            border: 'none', cursor: 'pointer',
            boxShadow: breathPhase === 'idle' ? '0 4px 12px rgba(109,94,245,0.3)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {breathPhase === 'idle' ? 'Begin' : 'Stop'}
        </button>
      </div>

      {/* Quick links */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20, padding: '16px 18px',
        border: '1px solid #EDE9FE',
        boxShadow: '0 2px 12px rgba(109,94,245,0.06)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A78BFA', marginBottom: 12 }}>
          ✦ Quick Access
        </div>
        {[
          { to: '/healers', label: 'Book a Healer', icon: '🧘', color: '#059669' },
          { to: '/groups', label: 'Join a Circle', icon: '🫂', color: '#6D5EF5' },
          { to: '/mood', label: 'Log Your Mood', icon: '📊', color: '#D97706' },
        ].map(({ to, label, icon, color }) => (
          <Link key={to} to={to}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 0', textDecoration: 'none', color: '#4B5563',
              borderBottom: '1px solid #F5F3FF', fontSize: 13, fontWeight: 500,
            }}
          >
            <span style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: `${color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15,
            }}>{icon}</span>
            {label}
            <span style={{ marginLeft: 'auto', color: '#D1D5DB', fontSize: 12 }}>→</span>
          </Link>
        ))}
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
  const { user }                    = useAuthStore();

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

  const hour     = new Date().getHours();
  const greeting = hour < 5 ? 'Still up?' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFD' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, padding: '12px 24px',
          background: '#1F2937',
          borderRadius: 14, color: '#fff',
          fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}>
          {toast}
        </div>
      )}

      {/* ── Hero Section ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #4C3DB8 0%, #6D5EF5 40%, #8B5CF6 70%, #A78BFA 100%)',
        padding: 'clamp(32px, 5vw, 56px) clamp(20px, 4vw, 48px)',
        borderRadius: '0 0 32px 32px',
        marginBottom: 32,
      }}>
        <SacredGeometry />

        {/* Greeting */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginBottom: 6 }}>
            {greeting} 🙏
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Namaste, {firstName}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 480, margin: '0 0 24px' }}>
            {affirmation}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: '💫', value: matches.length || 4, label: 'Soul Matches' },
              { icon: '🫂', value: 3, label: 'Circles' },
              { icon: '🧘', value: 12, label: 'Sessions' },
              { icon: '🌱', value: 7, label: 'Days Journey' },
            ].map(({ icon, value, label }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 14, padding: '10px 16px',
                border: '1px solid rgba(255,255,255,0.2)',
                minWidth: 80,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{value}</span>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content + Right sidebar ── */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 clamp(16px,3vw,32px) 80px',
        display: 'flex', gap: 28, alignItems: 'flex-start',
      }}>

        {/* ── Center content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Stat cards row */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
            <StatCard icon="💫" value={matches.length || '4'} label="Soul Matches Found" color="#6D5EF5" />
            <StatCard icon="🫂" value="3" label="Circles Joined" color="#059669" />
            <StatCard icon="🧘" value="12" label="Sessions Attended" color="#D97706" />
            <StatCard icon="📊" value="7/10" label="Avg Mood This Week" color="#0891B2" />
          </div>

          {/* Continue your journey */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', margin: 0 }}>Continue Your Journey</h2>
              <Link to="/chat" style={{ fontSize: 12, color: '#6D5EF5', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            </div>

            {/* Featured match/chat card */}
            <div style={{
              background: '#FFFFFF', borderRadius: 20, padding: 20,
              border: '1px solid #EDE9FE', boxShadow: '0 2px 16px rgba(109,94,245,0.08)',
              display: 'flex', gap: 16, alignItems: 'center',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #6D5EF5, #A78BFA)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: '#fff',
                position: 'relative',
              }}>
                P
                <div style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 12, height: 12, borderRadius: '50%',
                  background: '#7DD3A0', border: '2px solid #fff',
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>Priya</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#EDE9FE', color: '#6D5EF5', fontWeight: 600 }}>94% match</span>
                  <span style={{ fontSize: 11, color: '#7DD3A0', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7DD3A0', display: 'inline-block' }} />
                    online
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>How was your day today? 💙</p>
              </div>
              <Link to="/chat"
                style={{
                  padding: '10px 20px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                  background: 'linear-gradient(135deg, #6D5EF5, #8B5CF6)',
                  color: '#fff', textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(109,94,245,0.3)',
                  flexShrink: 0,
                }}>
                Chat →
              </Link>
            </div>
          </div>

          {/* Soul Matches section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', margin: '0 0 2px' }}>Your Soul Matches</h2>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Kindred spirits who understand your journey</p>
              </div>
              <div style={{
                padding: '6px 14px', borderRadius: 20,
                background: '#F5F3FF', border: '1px solid #EDE9FE',
                fontSize: 12, fontWeight: 600, color: '#6D5EF5',
              }}>
                {matches.length} matched
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    height: 180, borderRadius: 20,
                    background: '#fff', border: '1px solid #EDE9FE',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '14px 18px', borderRadius: 16,
                  background: '#fff', border: '1px solid #EDE9FE',
                  marginTop: 4,
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>🔒</span>
                  <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', lineHeight: 1.6 }}>
                    All matches are anonymous. Your personal details are never shared.
                    <span style={{ color: '#6D5EF5', marginLeft: 4, fontWeight: 600 }}>Learn more →</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar — desktop only ── */}
        <div className="hidden lg:flex" style={{ flexDirection: 'column' }}>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
