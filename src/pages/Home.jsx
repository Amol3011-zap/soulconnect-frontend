import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { useWeatherStore } from '../store/weather';
import {
  Search, Bell, ChevronLeft, ChevronRight,
  Heart, MessageCircle, Bookmark, Share2, Clock, Leaf
} from 'lucide-react';
import BreathingSession from '../components/BreathingSession';

/* ─────────────────────────────── SVG COMPONENTS ─────────────────────────────── */

function CrystalBall() {
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      {/* Outer glow */}
      <div style={{
        position: 'absolute', inset: -20,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)',
        animation: 'crystalPulse 3s ease-in-out infinite',
      }} />
      {/* Main sphere */}
      <svg viewBox="0 0 200 200" width="200" height="200" style={{ filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.6))' }}>
        <defs>
          <radialGradient id="sphereGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#7C3AED" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E0A3E" stopOpacity="0.95" />
          </radialGradient>
          <radialGradient id="cloudGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="100%" stopColor="#A78BFA" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Sphere background */}
        <circle cx="100" cy="100" r="90" fill="url(#sphereGrad)" />
        {/* Inner highlight */}
        <ellipse cx="75" cy="72" rx="28" ry="18" fill="rgba(255,255,255,0.18)" />
        {/* Cute cloud inside sphere */}
        <g filter="url(#glow)">
          <circle cx="88" cy="115" r="18" fill="url(#cloudGrad)" />
          <circle cx="104" cy="107" r="22" fill="#D8B4FE" />
          <circle cx="122" cy="113" r="16" fill="url(#cloudGrad)" />
          <rect x="70" y="115" width="68" height="20" rx="10" fill="#D8B4FE" />
          {/* Smiling face */}
          <circle cx="97" cy="108" r="3" fill="#6D28D9" />
          <circle cx="111" cy="108" r="3" fill="#6D28D9" />
          <path d="M97 116 Q104 122 111 116" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
        {/* Sparkle stars */}
        <g fill="#F4C542" filter="url(#glow)">
          <polygon points="45,45 47,52 54,52 48,57 50,64 45,59 40,64 42,57 36,52 43,52" transform="scale(0.7) translate(20,20)" />
          <polygon points="160,30 162,37 169,37 163,42 165,49 160,44 155,49 157,42 151,37 158,37" transform="scale(0.6) translate(10,10)" />
          <circle cx="155" cy="65" r="3" opacity="0.8" />
          <circle cx="40" cy="140" r="2.5" opacity="0.6" />
          <circle cx="165" cy="150" r="2" opacity="0.5" />
        </g>
        {/* Base platform glow */}
        <ellipse cx="100" cy="185" rx="55" ry="10" fill="rgba(139,92,246,0.4)" />
        <ellipse cx="100" cy="185" rx="35" ry="6" fill="rgba(168,85,247,0.6)" />
      </svg>
    </div>
  );
}

function BrainIllustration() {
  return (
    <svg viewBox="0 0 120 120" width="110" height="110" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.6))', flexShrink: 0 }}>
      <defs>
        <radialGradient id="brainGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="55" rx="38" ry="32" fill="url(#brainGrad)" opacity="0.9" />
      <ellipse cx="44" cy="55" rx="22" ry="28" fill="#A78BFA" opacity="0.7" />
      <ellipse cx="76" cy="55" rx="22" ry="28" fill="#8B5CF6" opacity="0.7" />
      <path d="M60 27 Q60 40 60 55" stroke="#6D28D9" strokeWidth="2" fill="none" />
      <path d="M38 40 Q50 50 38 65" stroke="#6D28D9" strokeWidth="1.5" fill="none" />
      <path d="M82 40 Q70 50 82 65" stroke="#6D28D9" strokeWidth="1.5" fill="none" />
      <path d="M42 55 Q60 48 78 55" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
      <line x1="60" y1="83" x2="60" y2="100" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="60" cy="104" rx="18" ry="5" fill="rgba(139,92,246,0.4)" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + 50 * Math.cos(rad);
        const y = 60 + 50 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="2" fill="#F4C542" opacity="0.7" />;
      })}
    </svg>
  );
}

function HealingTree() {
  return (
    <svg viewBox="0 0 260 180" width="100%" height="160" style={{ display: 'block', margin: '12px 0' }}>
      <defs>
        <radialGradient id="treeGlow" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.4)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="leafGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#9D4EDD" />
          <stop offset="100%" stopColor="#3C096C" />
        </radialGradient>
      </defs>
      {/* Ground glow */}
      <ellipse cx="130" cy="168" rx="80" ry="12" fill="url(#treeGlow)" />
      {/* Trunk */}
      <rect x="122" y="110" width="16" height="58" rx="8" fill="#6D28D9" opacity="0.8" />
      {/* Main canopy layers */}
      <ellipse cx="130" cy="90" rx="70" ry="55" fill="url(#leafGrad)" opacity="0.95" />
      <ellipse cx="130" cy="70" rx="55" ry="45" fill="#7C3AED" opacity="0.9" />
      <ellipse cx="130" cy="50" rx="40" ry="35" fill="#9D4EDD" opacity="0.85" />
      <ellipse cx="130" cy="35" rx="28" ry="25" fill="#A855F7" opacity="0.8" />
      {/* Glowing dots on tree */}
      {[
        [105, 80], [155, 75], [120, 55], [140, 60], [130, 90],
        [95, 95], [165, 90], [110, 38], [150, 42], [130, 20],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#F4C542" opacity={0.6 + (i % 3) * 0.1} />
      ))}
      {/* Lotus at base */}
      <ellipse cx="130" cy="165" rx="20" ry="8" fill="#F59E0B" opacity="0.7" />
      <ellipse cx="130" cy="160" rx="12" ry="14" fill="#FBBF24" opacity="0.5" transform="rotate(-20,130,160)" />
      <ellipse cx="130" cy="160" rx="12" ry="14" fill="#FBBF24" opacity="0.5" transform="rotate(20,130,160)" />
      <circle cx="130" cy="160" r="6" fill="#FDE68A" opacity="0.9" />
    </svg>
  );
}

/* ─────────────────────────────── DATA ─────────────────────────────── */

const WEATHER_OPTIONS = [
  { id: 'clear-sky',  emoji: '☀️', label: 'Clear'      },
  { id: 'hope',       emoji: '🌤', label: 'Hope'       },
  { id: 'blooming',   emoji: '🌸', label: 'Blooming'   },
  { id: 'fog',        emoji: '🌫', label: 'Fog'        },
  { id: 'heavy-rain', emoji: '🌧', label: 'Heavy Rain' },
  { id: 'storm',      emoji: '⚡', label: 'Storm'      },
];

const JOURNEY = [
  { emoji: '🌅', title: 'Morning Meditation', sub: '72% Completed',       progress: 72,   color: '#F59E0B' },
  { emoji: '📝', title: 'Gratitude Journal',  sub: 'Draft · 3 thoughts',  progress: null, color: '#8B5CF6' },
  { emoji: '💨', title: 'Breathing Exercise', sub: '5 min · In Progress', progress: 40,   color: '#2DD4BF' },
];

const STORIES = [
  {
    name: 'Anonymous', avatar: '?', avatarColor: '#374151',
    time: '2h ago', tag: 'Growth', color: '#10B981',
    preview: 'Today I finally said no without feeling guilty.',
    hearts: 128, comments: 32,
  },
  {
    name: 'Riya', avatar: 'R', avatarColor: '#7C3AED',
    time: '9h ago', tag: 'Overthinking', color: '#8B5CF6',
    preview: 'After weeks of overthinking, I chose to let it go.',
    hearts: 96, comments: 18,
  },
  {
    name: 'Arjun', avatar: 'A', avatarColor: '#D97706',
    time: '9h ago', tag: 'Motivation', color: '#F59E0B',
    preview: 'Small steps every day really do change everything.',
    hearts: 112, comments: 24,
  },
];

/* ─────────────────────────────── STYLES ─────────────────────────────── */

const glassBtn = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  color: '#E2DEFF',
  cursor: 'pointer',
  padding: '8px 18px',
  fontSize: 13,
  fontWeight: 600,
};

const purpleGradBtn = {
  background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
  border: 'none',
  borderRadius: 12,
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 15,
  padding: '12px 28px',
  boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
};

const sectionLabel = {
  fontSize: 11,
  color: '#F4C542',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 10,
};

/* ─────────────────────────────── MAIN COMPONENT ─────────────────────────────── */

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { todayEntry, streak, submitWeather } = useWeatherStore();

  const userId    = user?.id || user?.user_id || 1;
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  const [showBreathing, setShowBreathing]   = useState(false);
  const [breathingDone, setBreathingDone]   = useState(false);
  const [selectedWeather, setSelectedWeather] = useState(todayEntry?.weatherId || null);

  const carouselRef = useRef(null);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  function handleWeatherSelect(id) {
    setSelectedWeather(id);
    submitWeather(id, userId);
  }

  function handleCheckIn() {
    useWeatherStore.setState({ showModal: true });
  }

  function scrollCarousel(dir) {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  }

  return (
    <>
      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes crystalPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
        .home-main { margin-right: 290px; padding: 0; min-height: 100vh; background: #0D0B1A; }
        .home-right-sidebar {
          position: fixed; right: 0; top: 0; bottom: 0; width: 290px;
          background: #0D0B1A;
          border-left: 1px solid rgba(255,255,255,0.06);
          overflow-y: auto; padding: 24px 20px; z-index: 50;
        }
        @media (max-width: 1100px) {
          .home-right-sidebar { display: none; }
          .home-main { margin-right: 0 !important; padding-bottom: 100px; }
        }
        .carousel-hide-scroll::-webkit-scrollbar { display: none; }
        .carousel-hide-scroll { scrollbar-width: none; }
        .story-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
        .journey-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
        .weather-pill:hover { background: rgba(139,92,246,0.3) !important; }
        .icon-btn:hover { background: rgba(255,255,255,0.12) !important; }
      `}</style>

      {/* ── Breathing Session Overlay ── */}
      <AnimatePresence>
        {showBreathing && (
          <BreathingSession
            onClose={() => setShowBreathing(false)}
            onComplete={() => { setBreathingDone(true); setShowBreathing(false); }}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════ MAIN CONTENT ════════════════════ */}
      <div className="home-main">

        {/* ── TOP HEADER ── */}
        <div style={{ padding: '20px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Left: greeting */}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ fontSize: 14, color: '#8A84B6', margin: '6px 0 0' }}>
              Take a deep breath. You've got this.
            </p>
          </div>

          {/* Right: icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
            {/* Search */}
            <button
              className="icon-btn"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Search size={16} color="#B8B4D8" />
            </button>

            {/* Bell with badge */}
            <div style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Bell size={16} color="#B8B4D8" />
              </button>
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
                color: '#fff', fontSize: 10, fontWeight: 700,
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0D0B1A',
              }}>3</span>
            </div>

            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer',
              flexShrink: 0,
            }}>
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 1 — SOUL CLIMATE CARD
        ═══════════════════════════════════════════════════════════ */}
        <div style={{
          margin: '20px 32px 16px',
          background: 'linear-gradient(135deg, #1A0A3E 0%, #2D1260 50%, #1A0A3E 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 24,
          padding: 28,
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 24,
          alignItems: 'center',
        }}>
          {/* Decorative background glow */}
          <div style={{
            position: 'absolute', top: -60, right: 160, width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* LEFT: text + button */}
          <div style={{ zIndex: 1 }}>
            <div style={sectionLabel}>SOUL CLIMATE ⓘ</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.25 }}>
              How is your mind<br />feeling today?
            </h2>
            <p style={{ fontSize: 13, color: '#8A84B6', margin: '0 0 20px' }}>
              Your check-in helps us support you better.
            </p>
            <button onClick={handleCheckIn} style={purpleGradBtn}>
              {selectedWeather ? '✓ Checked In' : 'Check In'}
            </button>
          </div>

          {/* RIGHT: crystal ball + weather pills */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, zIndex: 1 }}>
            <CrystalBall />

            {/* Weather pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
              {WEATHER_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className="weather-pill"
                  onClick={() => handleWeatherSelect(opt.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: selectedWeather === opt.id
                      ? 'rgba(139,92,246,0.35)'
                      : 'rgba(255,255,255,0.08)',
                    border: selectedWeather === opt.id
                      ? '1px solid rgba(139,92,246,0.7)'
                      : '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 20,
                    padding: '6px 14px',
                    fontSize: 12,
                    color: '#E2DEFF',
                    cursor: 'pointer',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2 — AI INSIGHT CARD
        ═══════════════════════════════════════════════════════════ */}
        <div style={{
          margin: '0 32px 16px',
          background: 'linear-gradient(135deg, #160D30, #1E1060)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 24,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          {/* Left: text */}
          <div style={{ flex: 1 }}>
            <div style={sectionLabel}>✦ AI INSIGHT</div>
            <p style={{ fontSize: 14, color: '#E2DEFF', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 16px' }}>
              "You've been feeling more positive this week. Keep practicing gratitude and mindfulness."
            </p>
            <button style={glassBtn}>View Details</button>
          </div>

          {/* Right: brain SVG */}
          <BrainIllustration />
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — CONTINUE YOUR JOURNEY
        ═══════════════════════════════════════════════════════════ */}
        <div style={{ margin: '0 32px 16px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ ...sectionLabel, marginBottom: 0 }}>CONTINUE YOUR JOURNEY</span>
            <button
              onClick={() => navigate('/journal')}
              style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              View All ›
            </button>
          </div>

          {/* Carousel wrapper with arrows */}
          <div style={{ position: 'relative' }}>
            {/* Left arrow */}
            <button
              onClick={() => scrollCarousel(-1)}
              style={{
                position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)',
                zIndex: 2, width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <ChevronLeft size={16} color="#E2DEFF" />
            </button>

            {/* Scrollable row */}
            <div
              ref={carouselRef}
              className="carousel-hide-scroll"
              style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4, scrollBehavior: 'smooth' }}
            >
              {JOURNEY.map((item, i) => (
                <motion.div
                  key={i}
                  className="journey-card"
                  whileHover={{ y: -2 }}
                  style={{
                    minWidth: 160, padding: 16, borderRadius: 18,
                    background: '#211044', border: '1px solid rgba(255,255,255,0.07)',
                    flexShrink: 0, cursor: 'pointer',
                  }}
                >
                  {/* Emoji icon in colored circle */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `${item.color}22`,
                    border: `1px solid ${item.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, marginBottom: 10,
                  }}>
                    {item.emoji}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#8A84B6', marginBottom: item.progress != null ? 10 : 0 }}>{item.sub}</div>

                  {/* Progress bar */}
                  {item.progress != null && (
                    <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${item.progress}%`,
                        background: item.color, borderRadius: 4,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scrollCarousel(1)}
              style={{
                position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)',
                zIndex: 2, width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <ChevronRight size={16} color="#E2DEFF" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4 — LATEST SOUL STORIES
        ═══════════════════════════════════════════════════════════ */}
        <div style={{ margin: '0 32px 24px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ ...sectionLabel, marginBottom: 0 }}>LATEST SOUL STORIES</span>
            <button
              onClick={() => navigate('/stories')}
              style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              View All ›
            </button>
          </div>

          {/* Stories row */}
          <div style={{ display: 'flex', gap: 12 }}>
            {STORIES.map((story, i) => (
              <motion.div
                key={i}
                className="story-card"
                whileHover={{ y: -2 }}
                onClick={() => navigate('/stories')}
                style={{
                  flex: 1, minWidth: 0, background: '#211044',
                  borderRadius: 20, padding: '16px',
                  border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer',
                }}
              >
                {/* Top row: avatar + name + time + bookmark */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: story.avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {story.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{story.name}</div>
                    <div style={{ fontSize: 11, color: '#8A84B6' }}>{story.time}</div>
                  </div>
                  <Bookmark size={14} color="#8A84B6" style={{ flexShrink: 0 }} />
                </div>

                {/* Preview text */}
                <p style={{
                  fontSize: 13, color: '#B8B4D8', lineHeight: 1.6,
                  margin: '0 0 10px',
                  display: '-webkit-box', WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  "{story.preview}"
                </p>

                {/* Tag pill */}
                <span style={{
                  display: 'inline-block',
                  background: `${story.color}22`,
                  border: `1px solid ${story.color}44`,
                  color: story.color,
                  fontSize: 11, fontWeight: 600, borderRadius: 20,
                  padding: '3px 10px', marginBottom: 10,
                }}>
                  {story.tag}
                </span>

                {/* Bottom: hearts, comments, share */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8A84B6' }}>
                    <Heart size={13} /> {story.hearts}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8A84B6' }}>
                    <MessageCircle size={13} /> {story.comments}
                  </span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: '#8A84B6' }}>
                    <Share2 size={13} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>{/* end .home-main */}

      {/* ════════════════════ RIGHT SIDEBAR ════════════════════ */}
      <div className="home-right-sidebar">

        {/* ── Card 1: Today's Focus ── */}
        <div style={{
          background: '#211044', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: 20, marginBottom: 16,
        }}>
          <div style={sectionLabel}>TODAY'S FOCUS ⓘ</div>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Calm Your Mind</span>
            <span style={{ fontSize: 36, lineHeight: 1 }}>🍃</span>
          </div>

          <p style={{ fontSize: 12, color: '#8A84B6', margin: '0 0 12px', lineHeight: 1.6 }}>
            A 7-minute breathing exercise to help you relax and reset.
          </p>

          {/* Pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {['⏱ 7 min', '🟢 Easy'].map(pill => (
              <span key={pill} style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#B8B4D8',
              }}>
                {pill}
              </span>
            ))}
          </div>

          {/* Start Now button */}
          <button
            onClick={() => setShowBreathing(true)}
            style={{
              ...purpleGradBtn,
              width: '100%', padding: '11px', fontSize: 14, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {breathingDone ? '✓ Completed' : '▶ Start Now'}
          </button>
        </div>

        {/* ── Card 2: Upcoming Session ── */}
        <div style={{
          background: '#211044', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: 20, marginBottom: 16,
        }}>
          <div style={sectionLabel}>UPCOMING SESSION</div>

          {/* Content row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Online Therapy</div>
              <div style={{ fontSize: 12, color: '#8A84B6', marginBottom: 6 }}>with Dr. Meera Sharma</div>
              <div style={{ fontSize: 12, color: '#B8B4D8' }}>📅 Tomorrow, 11:00 AM</div>
            </div>
            {/* Doctor avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#fff',
            }}>
              M
            </div>
          </div>

          <button
            onClick={() => navigate('/professionals')}
            style={{ ...glassBtn, width: '100%', padding: '9px', textAlign: 'center', marginTop: 12 }}
          >
            View Session
          </button>
        </div>

        {/* ── Card 3: Healing Tree ── */}
        <div style={{
          background: '#211044', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: 20, marginBottom: 0,
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
            <span style={{ ...sectionLabel, marginBottom: 0 }}>HEALING TREE</span>
            <span style={{
              background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
              color: '#C4B5FD', fontSize: 10, fontWeight: 700,
              borderRadius: 20, padding: '3px 10px',
            }}>
              Level 3
            </span>
          </div>

          {/* Tree SVG */}
          <HealingTree />

          <p style={{ fontSize: 13, color: '#B8B4D8', textAlign: 'center', margin: '0 0 12px' }}>
            Keep nurturing your growth.
          </p>

          <button
            onClick={() => navigate('/profile')}
            style={{ ...glassBtn, width: '100%', padding: '9px', textAlign: 'center' }}
          >
            View Tree
          </button>
        </div>

      </div>{/* end .home-right-sidebar */}
    </>
  );
}
