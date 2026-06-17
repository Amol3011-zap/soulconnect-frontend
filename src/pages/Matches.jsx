import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { useAuthStore } from '../store/auth';

// ── Static Data ───────────────────────────────────────────────────────────────

const QUOTES = [
  { text: "Peace comes from within.\nYou do not seek it outside.", author: "Buddha" },
  { text: "You yourself deserve love\nas much as anybody in the universe.", author: "Buddha" },
  { text: "The present moment\nis the door to all moments.", author: "Thich Nhất Hạnh" },
  { text: "In the middle of difficulty\nlies opportunity to grow.", author: "Rumi" },
  { text: "Your task is not to seek for love,\nbut to find the barriers within.", author: "Rumi" },
];

const DAILY_AFFIRMATIONS = [
  "I trust the timing of my life.",
  "I am worthy of deep, healing connection.",
  "Peace lives within me — I return to it now.",
  "My healing is sacred, and I honor every step.",
  "I am safe. I am loved. I belong here.",
  "Every breath I take is an act of self-love.",
  "I release what no longer serves my highest good.",
];

const ANGEL_NUMBERS = [
  { number: "444", meaning: "You are surrounded by angels. Trust the path you're walking.", theme: "Protection & Guidance" },
  { number: "111", meaning: "A new beginning is unfolding. Your thoughts are manifesting.", theme: "New Beginnings" },
  { number: "333", meaning: "The universe is asking you to align mind, body, and soul.", theme: "Alignment" },
  { number: "555", meaning: "Major transformation is on its way. Embrace the change.", theme: "Transformation" },
  { number: "777", meaning: "You are on the right path. Keep going, you are divinely guided.", theme: "Divine Alignment" },
  { number: "888", meaning: "Abundance flows to you. Open your heart to receive.", theme: "Abundance" },
  { number: "222", meaning: "Balance and harmony are restoring around you.", theme: "Harmony" },
];

const JOURNAL_PROMPTS = [
  "What would you tell your younger self about the pain you've been carrying?",
  "Name three things your body did for you today that you're grateful for.",
  "What emotion have you been avoiding, and what might it be trying to tell you?",
  "Describe a moment this week when you felt fully like yourself.",
  "What belief about yourself is ready to be released today?",
  "Write a letter of forgiveness — to yourself.",
  "What does your soul need most right now?",
];

const UPCOMING_EVENTS = [
  { id: 1, title: "Morning Stillness Meditation", time: "7:00 AM", date: "Tomorrow", tag: "Meditation", tagColor: "#8B5CF6", tagBg: "#F5F3FF", icon: "🧘", spots: "4 spots left" },
  { id: 2, title: "Anxiety Release Circle",       time: "6:30 PM", date: "Today",    tag: "Circle",    tagColor: "#10B981", tagBg: "#D1FAE5", icon: "🫂", spots: "8 spots left" },
  { id: 3, title: "Self-Compassion Workshop",     time: "11:00 AM", date: "Sat",     tag: "Workshop",  tagColor: "#F59E0B", tagBg: "#FEF3C7", icon: "💛", spots: "12 spots left" },
];

const SUGGESTED_CIRCLES = [
  { id: 1, title: "Letting Go Workshop",   date: "Sat, Jun 21", time: "10:00 AM", participants: 14, max: 20, icon: "🍂", iconBg: "#FFF7ED", iconColor: "#D97706", tag: "Workshop" },
  { id: 2, title: "Self Love Circle",      date: "Sun, Jun 22", time: "6:00 PM",  participants: 8,  max: 15, icon: "💗", iconBg: "#FDF2F8", iconColor: "#EC4899", tag: "Circle" },
  { id: 3, title: "Forgiveness Healing",   date: "Mon, Jun 23", time: "7:30 PM",  participants: 6,  max: 12, icon: "🌸", iconBg: "#F5F3FF", iconColor: "#8B5CF6", tag: "Healing" },
  { id: 4, title: "Grief Support Circle",  date: "Tue, Jun 24", time: "5:00 PM",  participants: 5,  max: 10, icon: "🕯️", iconBg: "#F8FAFC", iconColor: "#475569", tag: "Circle" },
  { id: 5, title: "Inner Child Healing",   date: "Wed, Jun 25", time: "8:00 PM",  participants: 9,  max: 16, icon: "🌱", iconBg: "#F0FDF4", iconColor: "#16A34A", tag: "Healing" },
];

const HERO_PHOTO = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80';

// ── SVG Illustrations ─────────────────────────────────────────────────────────

function GoldenMandala({ size = 200, opacity = 0.7 }) {
  return (
    <svg viewBox="0 0 240 240" aria-hidden="true" style={{ width: size, height: size, opacity }}>
      <defs>
        <linearGradient id="gGold2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="108" fill="none" stroke="url(#gGold2)" strokeWidth="0.6" opacity="0.55" />
      <circle cx="120" cy="120" r="92" fill="none" stroke="url(#gGold2)" strokeWidth="0.4" opacity="0.45" strokeDasharray="3 6" />
      {Array.from({length:12}, (_,i) => {
        const a = i * 30 * Math.PI / 180;
        return <circle key={i} cx={120 + 108*Math.cos(a)} cy={120 + 108*Math.sin(a)} r="2.8" fill="url(#gGold2)" opacity="0.75" />;
      })}
      {[0,60,120,180,240,300].map((deg,i) => {
        const a = deg * Math.PI / 180;
        return <circle key={i} cx={120 + 42*Math.cos(a)} cy={120 + 42*Math.sin(a)} r="42" fill="none" stroke="url(#gGold2)" strokeWidth="0.9" opacity="0.62" />;
      })}
      <circle cx="120" cy="120" r="42" fill="none" stroke="url(#gGold2)" strokeWidth="0.9" opacity="0.62" />
      {[0,30,60,90,120,150].map((deg,i) => {
        const a = deg * Math.PI / 180;
        return <line key={i} x1={120 - 86*Math.cos(a)} y1={120 - 86*Math.sin(a)} x2={120 + 86*Math.cos(a)} y2={120 + 86*Math.sin(a)} stroke="url(#gGold2)" strokeWidth="0.45" opacity="0.38" />;
      })}
      <circle cx="120" cy="120" r="22" fill="none" stroke="url(#gGold2)" strokeWidth="1.3" opacity="0.88" />
      <circle cx="120" cy="120" r="9" fill="url(#gGold2)" opacity="0.65" />
      <circle cx="120" cy="120" r="3.5" fill="white" opacity="0.9" />
      {Array.from({length:8}, (_,i) => {
        const a = i * 45 * Math.PI / 180;
        return <circle key={i} cx={120 + 22*Math.cos(a)} cy={120 + 22*Math.sin(a)} r="1.5" fill="url(#gGold2)" opacity="0.8" />;
      })}
    </svg>
  );
}

function LotusIcon({ size = 18, color = '#8B5CF6' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12,21 C12,21 4,16 4,10 C4,7 7,5 10,6.3 C11,4 13,4 14,6.3 C17,5 20,7 20,10 C20,16 12,21 12,21 Z" fill={`${color}22`} stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12,21 C12,21 8,14.5 8,10 C8,8 10,7 12,8.2 C14,7 16,8 16,10 C16,14.5 12,21 12,21 Z" fill={`${color}35`} stroke={color} strokeWidth="0.9" strokeLinejoin="round" />
      <line x1="12" y1="21" x2="12" y2="8" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// ── Breathing Exercise ────────────────────────────────────────────────────────

function BreathingExercise() {
  const [phase, setPhase] = useState('idle'); // idle | inhale | hold | exhale
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef(null);

  const PHASES = [
    { key: 'inhale', label: 'Breathe In',  duration: 4, color: '#8B5CF6', scale: 1.35 },
    { key: 'hold',   label: 'Hold',        duration: 4, color: '#6D5EF5', scale: 1.35 },
    { key: 'exhale', label: 'Breathe Out', duration: 6, color: '#10B981', scale: 1.0  },
  ];

  const currentPhase = PHASES.find(p => p.key === phase) || PHASES[0];

  const startBreathing = () => {
    let pIdx = 0, c = 0;
    setPhase(PHASES[0].key);
    setCount(PHASES[0].duration);
    setCycle(0);

    intervalRef.current = setInterval(() => {
      c++;
      const cur = PHASES[pIdx];
      if (c >= cur.duration) {
        c = 0;
        pIdx = (pIdx + 1) % PHASES.length;
        if (pIdx === 0) setCycle(prev => prev + 1);
        setPhase(PHASES[pIdx].key);
        setCount(PHASES[pIdx].duration);
      } else {
        setCount(cur.duration - c);
      }
    }, 1000);
  };

  const stopBreathing = () => {
    clearInterval(intervalRef.current);
    setPhase('idle');
    setCount(0);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const isActive = phase !== 'idle';
  const circleScale = isActive ? currentPhase.scale : 1;
  const circleColor = isActive ? currentPhase.color : '#8B5CF6';

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 20,
      padding: '20px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 16 }}>🌬️</span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1A1F36' }}>Box Breathing</p>
          <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>4-4-6 rhythm · Calm your nervous system</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Animated circle */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            border: `2.5px solid ${circleColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 1s ease-in-out',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: `radial-gradient(circle, ${circleColor}22, ${circleColor}44)`,
              border: `2px solid ${circleColor}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${circleScale})`,
              transition: `transform ${isActive ? (phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 0.3) : 0.3}s ease-in-out`,
            }}>
              <span style={{ fontSize: isActive ? 18 : 14, lineHeight: 1, transition: 'font-size 0.3s' }}>
                {isActive ? count : '🫁'}
              </span>
            </div>
          </div>
          {isActive && cycle > 0 && (
            <div style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>{cycle}</span>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {isActive ? (
            <>
              <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: circleColor }}>
                {currentPhase.label}
              </p>
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {PHASES.map(p => (
                  <div key={p.key} style={{
                    height: 3, flex: 1, borderRadius: 2,
                    background: p.key === phase ? p.color : '#E5E7EB',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <button onClick={stopBreathing} style={{
                padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                background: '#F5F3FF', color: '#8B5CF6', border: '1px solid #EDE9FE', cursor: 'pointer',
              }}>Stop</button>
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
                Reduces anxiety &amp; brings calm in 2 minutes
              </p>
              <button onClick={startBreathing} style={{
                padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: 'linear-gradient(135deg, #8B5CF6, #6D5EF5)',
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(139,92,246,0.28)',
              }}>Start</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mini Mood Tracker ─────────────────────────────────────────────────────────

const MOODS = [
  { emoji: '😔', label: 'Low',     color: '#6B7280' },
  { emoji: '😕', label: 'Uneasy',  color: '#F59E0B' },
  { emoji: '😐', label: 'Okay',    color: '#3B82F6' },
  { emoji: '🙂', label: 'Good',    color: '#10B981' },
  { emoji: '😊', label: 'Great',   color: '#8B5CF6' },
];

function MiniMoodTracker() {
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (selected === null) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 20,
      padding: '20px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>📊</span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1A1F36' }}>How are you feeling?</p>
          <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>Quick check-in · takes 2 seconds</p>
        </div>
      </div>

      {saved ? (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>{MOODS[selected].emoji}</div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: MOODS[selected].color }}>
            Logged as {MOODS[selected].label} ✓
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9CA3AF' }}>Your mood has been recorded</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 14 }}>
            {MOODS.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: selected === i ? `${m.color}18` : '#F8F9FC',
                  outline: selected === i ? `2px solid ${m.color}` : '2px solid transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: selected === i ? 22 : 18, transition: 'font-size 0.15s' }}>{m.emoji}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: selected === i ? m.color : '#9CA3AF' }}>{m.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={selected === null}
            style={{
              width: '100%', padding: '10px', borderRadius: 12, border: 'none',
              background: selected !== null ? 'linear-gradient(135deg, #8B5CF6, #6D5EF5)' : '#F3F4F6',
              color: selected !== null ? '#fff' : '#9CA3AF',
              fontSize: 12, fontWeight: 700, cursor: selected !== null ? 'pointer' : 'default',
              transition: 'all 0.18s',
              boxShadow: selected !== null ? '0 4px 14px rgba(139,92,246,0.25)' : 'none',
            }}
          >
            Log Mood →
          </button>
        </>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Matches() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const today       = new Date();
  const hour        = today.getHours();
  const firstName   = user?.name?.split(' ')[0] || 'Friend';
  const greeting    = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const quote       = QUOTES[today.getDate() % QUOTES.length];
  const affirmation = DAILY_AFFIRMATIONS[today.getDate() % DAILY_AFFIRMATIONS.length];
  const angel       = ANGEL_NUMBERS[today.getDate() % ANGEL_NUMBERS.length];
  const prompt      = JOURNAL_PROMPTS[today.getDate() % JOURNAL_PROMPTS.length];
  const timeLabel   = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();

  const AVATAR_COLORS = ['#8B5CF6','#10B981','#F59E0B','#0EA5E9','#EC4899'];
  const INITIALS      = ['P','R','A','D','S'];

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F3FF',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <style>{`
        @keyframes scFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sc-f1 { animation: scFadeUp 0.38s 0.00s ease both; }
        .sc-f2 { animation: scFadeUp 0.38s 0.06s ease both; }
        .sc-f3 { animation: scFadeUp 0.38s 0.12s ease both; }
        .sc-f4 { animation: scFadeUp 0.38s 0.18s ease both; }
        .sc-f5 { animation: scFadeUp 0.38s 0.24s ease both; }
        .sc-f6 { animation: scFadeUp 0.38s 0.30s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .sc-f1,.sc-f2,.sc-f3,.sc-f4,.sc-f5,.sc-f6 { animation: none; }
        }
        .kpi-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.09) !important; }
        .kpi-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .event-row:hover { background: #F8F7FF !important; }
        .event-row { transition: background 0.15s; }
        .circle-chip:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        .circle-chip { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px clamp(16px, 3vw, 48px) 80px' }}>

        {/* ── ROW 1: Hero (70%) + Daily Intention (30%) ─────────────────────── */}
        <div className="sc-f1" style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'stretch' }}>

          {/* Hero Banner — 70% */}
          <div style={{
            flex: '0 0 68%', minWidth: 0,
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            backgroundImage: `url(${HERO_PHOTO})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 45%',
            minHeight: 200,
          }}>
            {/* Overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(110deg, rgba(30,27,75,0.72) 0%, rgba(30,27,75,0.5) 45%, rgba(30,27,75,0.15) 70%, transparent 100%)',
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, padding: '28px 36px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: 'rgba(196,181,253,0.9)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {greeting}, {firstName} 🙏
                </p>
                <p style={{
                  margin: '0 0 10px',
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(18px, 1.8vw, 26px)',
                  fontStyle: 'italic', color: '#F9FAFB',
                  lineHeight: 1.55, whiteSpace: 'pre-line',
                  maxWidth: 400,
                  textShadow: '0 1px 8px rgba(0,0,0,0.3)',
                }}>
                  {quote.text}
                </p>
                <p style={{ margin: 0, fontFamily: '"Playfair Display", Georgia, serif', fontSize: 13, color: 'rgba(196,181,253,0.85)', fontWeight: 600 }}>
                  — {quote.author}
                </p>
              </div>

              {/* Bottom row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
                <button
                  onClick={() => navigate('/groups')}
                  style={{
                    padding: '10px 22px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#fff', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', letterSpacing: '0.02em',
                    transition: 'background 0.18s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                >
                  Explore Circles →
                </button>
                <div style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>24 souls online now</span>
                </div>
              </div>
            </div>

            {/* Mandala — top right decoration */}
            <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.35 }}>
              <GoldenMandala size={220} opacity={1} />
            </div>
          </div>

          {/* Daily Intention — 30% */}
          <div style={{
            flex: 1, minWidth: 0,
            background: 'linear-gradient(150deg, #4F3ECC 0%, #7C3AED 50%, #8B5CF6 100%)',
            borderRadius: 24,
            padding: '28px 26px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(109,62,221,0.28)',
          }}>
            {/* Orbs */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <span style={{ fontSize: 14 }}>✦</span>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(196,181,253,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Today's Intention
                </p>
              </div>

              <p style={{
                margin: '0 0 18px',
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'clamp(15px, 1.4vw, 19px)',
                color: '#F9FAFB',
                fontStyle: 'italic', lineHeight: 1.6, fontWeight: 600,
              }}>
                "{affirmation}"
              </p>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 18 }} />

              <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: 'rgba(196,181,253,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Your streak
              </p>
              <div style={{ display: 'flex', gap: 5 }}>
                {Array.from({length: 7}, (_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 6, borderRadius: 3,
                    background: i < 5 ? 'rgba(253,230,138,0.8)' : 'rgba(255,255,255,0.2)',
                  }} />
                ))}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>5 days · Keep going 🔥</p>
            </div>

            <button
              onClick={() => navigate('/mood')}
              style={{
                position: 'relative', zIndex: 1,
                marginTop: 20, padding: '11px', borderRadius: 12,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.02em',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.26)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
            >
              Open Journal →
            </button>
          </div>
        </div>

        {/* ── ROW 2: 4 Compact KPI Cards ────────────────────────────────────── */}
        <div className="sc-f2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { icon: '🫂', value: '8',  label: 'Circles Joined',    sub: 'Active member',    iconBg: '#EDE9FE', valColor: '#7C3AED' },
            { icon: '✨', value: '24', label: 'People Connected',  sub: 'Beautiful souls',   iconBg: '#DBEAFE', valColor: '#2563EB' },
            { icon: '🧘', value: '12', label: 'Sessions Attended', sub: "You're growing",    iconBg: '#D1FAE5', valColor: '#059669' },
            { icon: '🌱', value: '27', label: 'Days on Journey',   sub: 'Keep showing up',  iconBg: '#FEF3C7', valColor: '#D97706' },
          ].map((stat, i) => (
            <div key={i} className="kpi-card" style={{
              background: '#FFFFFF',
              borderRadius: 18, padding: '18px 20px',
              boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: stat.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>{stat.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: stat.valColor, letterSpacing: '-0.04em', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.label}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ROW 3: Featured Support Circle ────────────────────────────────── */}
        <div className="sc-f3" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <LotusIcon size={17} />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1F36', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.01em' }}>Continue your journey</span>
          </div>

          <div style={{
            background: 'linear-gradient(140deg, #EDF5FF 0%, #E8F0FF 40%, #EEF1FF 100%)',
            borderRadius: 22,
            padding: '24px 28px',
            display: 'flex', gap: 24, alignItems: 'center',
            boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', bottom: -50, left: '38%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 5px #10B981' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#374151', letterSpacing: '0.06em' }}>TODAY · {timeLabel}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#F59E0B', background: '#FEF3C7', padding: '4px 10px', borderRadius: 20 }}>⚡ Filling fast</span>
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 10px', letterSpacing: '-0.02em', fontFamily: '"Playfair Display", Georgia, serif' }}>
                Anxiety Support Circle
              </h3>

              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.65, margin: '0 0 14px', maxWidth: 360 }}>
                A safe, guided space to share your experience, breathe together, and feel less alone in your healing.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex' }}>
                  {AVATAR_COLORS.slice(0, 4).map((c, i) => (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${c}, ${c}AA)`, border: '2px solid white', marginLeft: i > 0 ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {INITIALS[i]}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>+4 others healing together</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>⏱ 60 min</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>👥 8 / 12 joined</span>
              </div>

              <button
                onClick={() => navigate('/groups')}
                style={{ padding: '11px 28px', borderRadius: 12, fontSize: 13, fontWeight: 700, background: '#FFFFFF', color: '#374151', border: '1.5px solid #D1D5DB', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#8B5CF6'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#374151'; }}
              >
                Join Circle →
              </button>
            </div>

            {/* Right: stats visual */}
            <div className="hidden md:flex" style={{ flexShrink: 0, flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 18, padding: '18px 24px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#7C3AED', letterSpacing: '-0.04em', lineHeight: 1 }}>8/12</div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginTop: 4 }}>seats filled</div>
                <div style={{ marginTop: 8, height: 6, background: '#EDE9FE', borderRadius: 3, width: 100 }}>
                  <div style={{ width: '67%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #8B5CF6)', borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 18, padding: '14px 24px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 24 }}>🧘</div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginTop: 4 }}>Guided session</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 4: Suggested Circles Carousel ─────────────────────────────── */}
        <div className="sc-f4" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LotusIcon size={17} color="#F59E0B" />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1F36', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.01em' }}>Suggested for you</span>
            </div>
            <Link to="/meetups" style={{ fontSize: 12, fontWeight: 600, color: '#8B5CF6', textDecoration: 'none', padding: '5px 12px', borderRadius: 10, background: 'rgba(139,92,246,0.1)' }}>
              See all →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {SUGGESTED_CIRCLES.map((c, i) => (
              <div key={c.id} className="circle-chip" style={{
                background: '#FFFFFF',
                borderRadius: 18, padding: '16px 18px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                minWidth: 200, flexShrink: 0,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: c.iconBg, color: c.iconColor, whiteSpace: 'nowrap' }}>{c.tag}</span>
                </div>

                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: '#1A1F36', lineHeight: 1.3 }}>{c.title}</p>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: '#9CA3AF' }}>📅 {c.date}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>🕐 {c.time}</p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: '#6B7280' }}>👥 {c.participants}/{c.max} joined</span>
                  </div>
                  <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2 }}>
                    <div style={{ width: `${(c.participants/c.max)*100}%`, height: '100%', background: c.iconColor, borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                </div>

                <button
                  onClick={() => navigate('/meetups')}
                  style={{ padding: '8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: c.iconBg, color: c.iconColor, border: 'none', cursor: 'pointer' }}
                >
                  Reserve Spot
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 5: Two-column layout ───────────────────────────────────────── */}
        <div className="sc-f5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* LEFT column: Upcoming Events + Journal Prompt */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Upcoming Events */}
            <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📅</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1F36' }}>Upcoming Events</span>
                </div>
                <Link to="/meetups" style={{ fontSize: 11, fontWeight: 600, color: '#8B5CF6', textDecoration: 'none' }}>View all</Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {UPCOMING_EVENTS.map((ev, i) => (
                  <div key={ev.id} className="event-row" style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 12,
                    background: i === 0 ? '#FAFAFF' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/meetups')}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 12, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {ev.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 700, color: '#1A1F36', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</p>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: '#9CA3AF' }}>{ev.date} · {ev.time}</span>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: ev.tagBg, color: ev.tagColor }}>{ev.tag}</span>
                      <p style={{ margin: '3px 0 0', fontSize: 10, color: '#9CA3AF' }}>{ev.spots}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journal Prompt */}
            <div style={{
              background: 'linear-gradient(140deg, #FFF7ED 0%, #FEF3C7 100%)',
              borderRadius: 20, padding: '20px',
              boxShadow: '0 2px 16px rgba(245,158,11,0.08)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.12, transform: 'rotate(-15deg)' }}>📝</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 15 }}>📝</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#92400E' }}>Journal Prompt</p>
                    <p style={{ margin: 0, fontSize: 10, color: '#D97706' }}>Reflect · Release · Renew</p>
                  </div>
                </div>

                <p style={{
                  margin: '0 0 16px',
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 15, color: '#1A1F36', fontStyle: 'italic', lineHeight: 1.7, fontWeight: 600,
                }}>
                  "{prompt}"
                </p>

                <button
                  onClick={() => navigate('/mood')}
                  style={{
                    padding: '10px 22px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                    background: '#F59E0B', color: '#fff', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(245,158,11,0.3)', transition: 'transform 0.18s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Write in Journal →
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT column: Angel Number + Breathing + Mood Tracker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Angel Number */}
            <div style={{
              background: 'linear-gradient(150deg, #1E1B4B 0%, #312E81 50%, #3730A3 100%)',
              borderRadius: 20, padding: '20px 22px',
              boxShadow: '0 8px 32px rgba(49,46,129,0.28)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(139,92,246,0.15)' }} />
              <div style={{ position: 'absolute', bottom: -20, left: '30%', width: 90, height: 90, borderRadius: '50%', background: 'rgba(99,102,241,0.1)' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 42, fontWeight: 900, color: '#FDE68A', letterSpacing: '-0.04em', lineHeight: 1, textShadow: '0 0 24px rgba(253,230,138,0.5)' }}>
                    {angel.number}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(196,181,253,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
                    Angel Number
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#A78BFA', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {angel.theme}
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: 'rgba(233,230,255,0.85)', lineHeight: 1.6 }}>
                    {angel.meaning}
                  </p>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({length: 3}, (_, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? '#FDE68A' : 'rgba(253,230,138,0.3)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Breathing Exercise */}
            <BreathingExercise />

            {/* Mini Mood Tracker */}
            <MiniMoodTracker />

          </div>
        </div>

      </div>
    </div>
  );
}
