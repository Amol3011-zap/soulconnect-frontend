import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { useWeatherStore } from '../store/weather';
import { getMonthCalendar } from '../services/MockWeatherAPI';
import Footer from '../components/Footer';
import WeatherWidget from '../components/emotional-weather/WeatherWidget';
import WeatherHistory from '../components/emotional-weather/WeatherHistory';
import WeeklyChart from '../components/emotional-weather/WeeklyChart';
import AIInsightCard from '../components/emotional-weather/AIInsightCard';
import EmotionStreak from '../components/emotional-weather/EmotionStreak';
import EmotionCalendar from '../components/emotional-weather/EmotionCalendar';
import BreathingSession from '../components/BreathingSession';
import {
  LayoutDashboard, Users, Heart, BookOpen, Wind, Zap,
  MessageCircle, Library, User, ChevronRight,
  Play, Calendar, Sparkles, TrendingUp, Sun, Moon,
} from 'lucide-react';

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
function LotusIcon({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" style={{ width: size, height: size }} aria-hidden="true">
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(-45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(90,16,18)" />
      <circle cx="16" cy="17" r="3.5" fill="#F5B841" opacity="0.9" />
      <circle cx="16" cy="17" r="2" fill="#FFD77A" />
    </svg>
  );
}

// ── Cloud Illustration ─────────────────────────────────────────────────────────
function CloudIllustration() {
  return (
    <svg viewBox="0 0 200 160" width="200" height="160" style={{ filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.4))' }}>
      <defs>
        <radialGradient id="cloudGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="95" rx="65" ry="45" fill="url(#cloudGrad)" opacity="0.9" />
      <circle cx="70" cy="80" r="35" fill="#A78BFA" opacity="0.85" />
      <circle cx="115" cy="70" r="42" fill="#C4B5FD" opacity="0.8" />
      <circle cx="145" cy="85" r="30" fill="#A78BFA" opacity="0.85" />
      <path d="M82 88 Q88 84 94 88" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M108 84 Q114 80 120 84" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M90 98 Q101 106 112 98" stroke="#6D28D9" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="55" r="3" fill="#F4C542" opacity="0.8" />
      <circle cx="165" cy="48" r="2" fill="#F4C542" opacity="0.6" />
      <circle cx="30" cy="90" r="2" fill="#A78BFA" opacity="0.7" />
    </svg>
  );
}

// ── Soul Climate Orbit Visualization ─────────────────────────────────────────
function SoulClimateOrbit() {
  const weatherStates = [
    { label: 'Hope',     icon: '🌤', angle: -90  },
    { label: 'Blooming', icon: '🌸', angle: -30  },
    { label: 'Rain',     icon: '🌧', angle: 30   },
    { label: 'Storm',    icon: '⚡', angle: 90   },
    { label: 'Fog',      icon: '🌫', angle: 150  },
    { label: 'Clear',    icon: '☀️', angle: 210  },
  ];

  const rx = 145, ry = 80;
  const cx = 160, cy = 100;

  return (
    <div style={{ position: 'relative', width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Orbit SVG */}
      <svg viewBox="0 0 320 200" width="100%" height="200" style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          fill="none"
          stroke="rgba(139,92,246,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {weatherStates.map((ws, i) => {
          const rad = (ws.angle * Math.PI) / 180;
          const x = cx + rx * Math.cos(rad);
          const y = cy + ry * Math.sin(rad);
          return (
            <circle key={i} cx={x} cy={y} r="4"
              fill="rgba(139,92,246,0.5)"
              stroke="rgba(139,92,246,0.8)"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {/* Weather state labels */}
      {weatherStates.map((ws, i) => {
        const rad = (ws.angle * Math.PI) / 180;
        const x = cx + rx * Math.cos(rad);
        const y = cy + ry * Math.sin(rad);
        const pct_x = (x / 320) * 100;
        const pct_y = (y / 200) * 100;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${pct_x}%`,
            top: `${pct_y}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            pointerEvents: 'none',
          }}>
            <span style={{ fontSize: 16 }}>{ws.icon}</span>
            <span style={{ fontSize: 9, color: '#B8B4D8', fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              {ws.label}
            </span>
          </div>
        );
      })}

      {/* Center cloud (floating) */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <CloudIllustration />
      </motion.div>
    </div>
  );
}

// ── Sidebar Nav Item ──────────────────────────────────────────────────────────
function SidebarNavItem({ icon: Icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px', borderRadius: 12,
        margin: '2px 12px',
        width: 'calc(100% - 24px)',
        background: active
          ? 'rgba(139,92,246,0.2)'
          : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: active ? '#8B5CF6' : hovered ? '#fff' : '#8A84B6',
        border: 'none', cursor: 'pointer',
        fontSize: 14, fontWeight: active ? 600 : 500,
        textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
    >
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
      <span>{label}</span>
    </button>
  );
}

// ── Weather emoji helper (uses actual IDs from MockWeatherAPI) ───────────────
function weatherEmoji(weatherId) {
  switch (weatherId) {
    case 'clear-sky':  return '☀️';
    case 'hope':       return '🌤';
    case 'blooming':   return '🌸';
    case 'fog':        return '🌫';
    case 'heavy-rain': return '🌧';
    case 'storm':      return '⚡';
    default:           return null;
  }
}

function weatherLabel(weatherId) {
  switch (weatherId) {
    case 'clear-sky':  return 'Clear Sky';
    case 'hope':       return 'Hope';
    case 'blooming':   return 'Blooming';
    case 'fog':        return 'Fog';
    case 'heavy-rain': return 'Heavy Rain';
    case 'storm':      return 'Storm';
    default:           return null;
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Matches() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userId = user?.id || user?.user_id || 1;
  const {
    todayEntry,
    history,
    weeklyData,
    streak,
    historyOpen,
    showModal,
    openHistory,
    closeHistory,
    dismissModal,
    checkTodayAndInit,
  } = useWeatherStore();

  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingDone, setBreathingDone] = useState(false);

  const now = new Date();
  const calendarData = useMemo(() => {
    try {
      return getMonthCalendar(userId, now.getFullYear(), now.getMonth() + 1);
    } catch { return []; }
  }, [userId, todayEntry]);

  const currentMonth = { year: now.getFullYear(), month: now.getMonth() + 1 };

  function handleChangeWeather() {
    useWeatherStore.setState({ showModal: true });
  }

  const today = new Date();
  const affirmation = AFFIRMATIONS[today.getDate() % AFFIRMATIONS.length];

  const hour = today.getHours();
  const greetingText = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const GreetIcon = hour < 12 ? Sun : hour < 17 ? Sun : Moon;

  const firstName = user?.name?.split(' ')[0] || 'Friend';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard',   active: true,  action: () => navigate('/') },
    { icon: Users,           label: 'Circles',     active: false, action: () => navigate('/groups') },
    { icon: Heart,           label: 'Healers',     active: false, action: () => navigate('/healers') },
    { icon: BookOpen,        label: 'Journal',     active: false, action: () => navigate('/mood') },
    { icon: Wind,            label: 'Meditations', active: false, action: () => navigate('/') },
    { icon: Zap,             label: 'Challenges',  active: false, action: () => navigate('/chat', { state: { tab: 'healing' } }) },
    { icon: MessageCircle,   label: 'Messages',    active: false, action: () => navigate('/chat') },
    { icon: Library,         label: 'Resources',   active: false, action: () => navigate('/') },
    { icon: User,            label: 'Profile',     active: false, action: () => navigate('/') },
  ];

  const communityGroups = [
    { name: 'Anxiety Support',       members: '1,247', color: '#7C3AED' },
    { name: 'Morning Gratitude',     members: '892',   color: '#F4C542' },
    { name: 'Healing Relationships', members: '567',   color: '#2DD4BF' },
  ];

  const journeyItems = [
    { name: 'Understanding Anxiety', progress: 72,   type: 'Course',     status: null },
    { name: 'Gratitude Journal',     progress: null, type: 'Draft · 3 thoughts', status: 'draft' },
    { name: 'Body Scan Meditation',  progress: null, type: '10 min · Meditation', status: 'done' },
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekWeathers = weeklyData && weeklyData.length > 0 ? weeklyData : weekDays.map((d, i) => ({
    day: d, weather: null, label: '—',
  }));

  const cardStyle = {
    background: '#211044',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 24,
    padding: '24px',
    marginBottom: 16,
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  };

  const primaryBtn = {
    background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
    border: 'none', borderRadius: 12, padding: '10px 20px',
    color: '#fff', fontWeight: 700, fontSize: 14,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
  };

  const glassBtn = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12, padding: '10px 20px',
    color: '#fff', fontWeight: 600, fontSize: 14,
    cursor: 'pointer',
  };

  const sectionLabel = {
    fontSize: 11, fontWeight: 700,
    color: '#F4C542', letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: 16,
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
      background: '#0D0B1A',
      color: '#FFFFFF',
      position: 'relative',
      overflowX: 'hidden',
    }}>

      {/* ── Global Styles ── */}
      <style>{`
        @keyframes floatCloud {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .sc-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4) !important;
        }
        .sc-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .sc-anim-1 { animation: fadeUp 0.5s 0.00s ease both; }
        .sc-anim-2 { animation: fadeUp 0.5s 0.08s ease both; }
        .sc-anim-3 { animation: fadeUp 0.5s 0.16s ease both; }
        .sc-anim-4 { animation: fadeUp 0.5s 0.24s ease both; }
        .sc-anim-5 { animation: fadeUp 0.5s 0.32s ease both; }
        .sc-anim-6 { animation: fadeUp 0.5s 0.40s ease both; }
        @media (max-width: 1200px) {
          .right-sidebar { position: static !important; width: 100% !important; border-left: none !important; }
          .main-content  { margin-right: 0 !important; }
        }
        @media (max-width: 768px) {
          .left-sidebar      { display: none !important; }
          .right-sidebar     { position: static !important; width: 100% !important; border-left: none !important; }
          .main-content      { margin-left: 0 !important; margin-right: 0 !important; padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important; }
          .two-col-grid      { grid-template-columns: 1fr !important; }
          .soul-climate-cols { flex-direction: column !important; }
          .soul-climate-right { display: none !important; }
          .weekly-grid       { grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .weekly-grid       { grid-template-columns: repeat(2, 1fr) !important; }
          .nav-links-center  { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sc-anim-1, .sc-anim-2, .sc-anim-3,
          .sc-anim-4, .sc-anim-5, .sc-anim-6 { animation: none !important; }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 10px; }
      `}</style>

      {/* ══ RIGHT SIDEBAR ══ */}
      <div className="right-sidebar" style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: 280, zIndex: 90,
        background: '#0D0B1A',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        overflowY: 'auto',
        padding: '24px 20px',
      }}>

        {/* Streak Card */}
        <div className="sc-card-hover sc-anim-1" style={{ ...cardStyle, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', letterSpacing: '0.1em' }}>
              🔥 CHECK-IN STREAK
            </div>
            <button onClick={() => openHistory()} style={{ ...glassBtn, padding: '4px 10px', fontSize: 12 }}>+</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>{streak || 7}</span>
            <span style={{ fontSize: 14, color: '#B8B4D8', fontWeight: 500 }}>Days</span>
          </div>
          <div style={{ fontSize: 12, color: '#8A84B6', marginBottom: 14 }}>
            You're showing up for yourself.
          </div>
          {/* Week dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, justifyContent: 'space-between' }}>
            {['M','T','W','T','F','S','S'].map((d, i) => {
              const isChecked = weeklyData?.[i]?.weather != null || i < (streak || 3);
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: isChecked ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
                    border: isChecked ? '1.5px solid rgba(139,92,246,0.6)' : '1.5px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isChecked ? '0 0 8px rgba(139,92,246,0.4)' : 'none',
                  }}>
                    {isChecked && <LotusIcon size={14} />}
                  </div>
                  <span style={{ fontSize: 9, color: '#8A84B6', fontWeight: 600 }}>{d}</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => openHistory()}
            style={{ ...glassBtn, width: '100%', textAlign: 'center', padding: '9px 0', fontSize: 13 }}
          >
            View Calendar
          </button>
        </div>

        {/* AI Insight Card */}
        <div className="sc-card-hover sc-anim-2" style={{ ...cardStyle, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', letterSpacing: '0.1em' }}>
              🤖 AI INSIGHT
            </div>
            <Sparkles size={14} color="#8A84B6" />
          </div>
          <div style={{
            fontSize: 14, color: '#fff', fontStyle: 'italic', lineHeight: 1.55, marginBottom: 8,
            fontWeight: 500,
          }}>
            "You've been feeling more positive this week."
          </div>
          <div style={{ fontSize: 12, color: '#8A84B6', marginBottom: 14, lineHeight: 1.5 }}>
            Your mindfulness practice is making a difference.
          </div>
          {/* Mini chart placeholder */}
          <div style={{
            height: 40, background: 'rgba(139,92,246,0.08)',
            borderRadius: 8, marginBottom: 12,
            display: 'flex', alignItems: 'flex-end', gap: 3, padding: '6px 8px',
            overflow: 'hidden',
          }}>
            {[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.85].map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h * 100}%`,
                background: i >= 5 ? '#8B5CF6' : 'rgba(139,92,246,0.3)',
                borderRadius: 3,
              }} />
            ))}
          </div>
          <button
            onClick={() => navigate('/journey')}
            style={{ ...glassBtn, width: '100%', textAlign: 'center', padding: '9px 0', fontSize: 13 }}
          >
            View Full Insights
          </button>
        </div>

        {/* Upcoming Event Card */}
        <div className="sc-card-hover sc-anim-3" style={{ ...cardStyle, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', letterSpacing: '0.1em', marginBottom: 12 }}>
            📅 UPCOMING EVENT
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(45,212,191,0.15)',
            border: '1px solid rgba(45,212,191,0.3)',
            borderRadius: 20, padding: '3px 10px', marginBottom: 12,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4BF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#2DD4BF', letterSpacing: '0.08em' }}>LIVE</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            Group Meditation
          </div>
          <div style={{ fontSize: 12, color: '#8A84B6', marginBottom: 4 }}>With Ananya</div>
          <div style={{ fontSize: 12, color: '#B8B4D8', marginBottom: 14 }}>Today, 8:00 PM</div>
          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 14 }}>
            {['#7C3AED','#F4C542','#2DD4BF','#EC4899'].map((c, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: '50%',
                background: `linear-gradient(135deg, ${c}, ${c}88)`,
                border: '2px solid #211044',
                marginLeft: i > 0 ? -8 : 0,
                zIndex: 4 - i, position: 'relative',
              }} />
            ))}
            <span style={{ fontSize: 11, color: '#8A84B6', marginLeft: 10 }}>+24 joining</span>
          </div>
          <button
            onClick={() => navigate('/meetups')}
            style={{ ...primaryBtn, width: '100%', textAlign: 'center', padding: '10px 0' }}
          >
            Join Now
          </button>
        </div>

        {/* Journal Reminder */}
        <div className="sc-card-hover sc-anim-4" style={{ ...cardStyle, padding: 20, marginBottom: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', letterSpacing: '0.1em', marginBottom: 12 }}>
            📔 JOURNAL REMINDER
          </div>
          <div style={{ fontSize: 13, color: '#B8B4D8', lineHeight: 1.6, marginBottom: 16 }}>
            You haven't written in your journal for 2 days. Want to reflect now?
          </div>
          {/* Book illustration */}
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(168,85,247,0.1))',
            border: '1px solid rgba(139,92,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
          }}>
            <BookOpen size={22} color="#8B5CF6" strokeWidth={1.8} />
          </div>
          <button
            onClick={() => navigate('/mood')}
            style={{ ...glassBtn, width: '100%', textAlign: 'center', padding: '9px 0', fontSize: 13 }}
          >
            Open Journal
          </button>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <main className="main-content" style={{
        marginLeft: 0,
        marginRight: 280,
        marginTop: 0,
        padding: 32,
        minHeight: '100vh',
      }}>

        {/* ── 1. GREETING ── */}
        <motion.div
          className="sc-anim-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <GreetIcon size={24} color="#F4C542" />
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {greetingText}, {firstName}
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 15, color: '#8A84B6', fontWeight: 400 }}>
            Every day is a new chance to heal a little more.
          </p>
        </motion.div>

        {/* ── 2. SOUL CLIMATE CARD ── */}
        <motion.div
          className="sc-anim-2 sc-card-hover"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          style={{
            background: 'linear-gradient(135deg, #1A0A3E 0%, #2D1260 50%, #1A0A3E 100%)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 24,
            padding: 28,
            marginBottom: 16,
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            gap: 24,
            alignItems: 'center',
            minHeight: 240,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative glow */}
          <div aria-hidden style={{
            position: 'absolute', top: -60, right: '30%',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Left */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ ...sectionLabel, marginBottom: 12 }}>§ SOUL CLIMATE</div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              How is your mind feeling today?
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#8A84B6', lineHeight: 1.6 }}>
              Your check-in helps us support you better.
            </p>
            <button
              onClick={handleChangeWeather}
              style={{ ...primaryBtn, marginBottom: 20 }}
            >
              {todayEntry ? '↺ Change Mood' : 'Check Your Mood'}
            </button>
            <div style={{
              height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 16,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>
                {weatherEmoji(todayEntry?.weather) || '🌧'}
              </span>
              <span style={{ fontSize: 12, color: '#8A84B6' }}>
                {todayEntry?.weather
                  ? `Today: ${weatherLabel(todayEntry.weather)}`
                  : 'No check-in yet today'}
              </span>
            </div>
          </div>

          {/* Right: Orbit */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <SoulClimateOrbit />
            <div style={{
              textAlign: 'center', marginTop: 8,
              fontSize: 12, color: '#8A84B6', fontStyle: 'italic',
            }}>
              It's okay to not be okay. We are here with you.
            </div>
          </div>
        </motion.div>

        {/* ── 3. TODAY'S FOCUS ── */}
        <motion.div
          className="sc-anim-3 sc-card-hover"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          style={{
            ...cardStyle,
            border: breathingDone ? '1px solid rgba(45,212,191,0.3)' : cardStyle.border,
          }}
        >
          <div style={sectionLabel}>✦ TODAY'S FOCUS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Icon */}
            <div style={{
              width: 64, height: 64, borderRadius: 18, flexShrink: 0,
              background: breathingDone
                ? 'linear-gradient(135deg, rgba(45,212,191,0.25), rgba(45,212,191,0.1))'
                : 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.15))',
              border: breathingDone ? '1px solid rgba(45,212,191,0.4)' : '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: breathingDone ? '0 0 24px rgba(45,212,191,0.2)' : '0 0 24px rgba(139,92,246,0.2)',
            }}>
              {breathingDone
                ? <span style={{ fontSize: 28 }}>✓</span>
                : <Wind size={30} color="#A78BFA" strokeWidth={1.8} />}
            </div>
            {/* Text */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                Calm Your Mind
              </div>
              <div style={{ fontSize: 13, color: '#8A84B6', marginBottom: 12, lineHeight: 1.6 }}>
                {breathingDone
                  ? 'Completed! Well done for taking time for yourself.'
                  : 'A 7-minute breathing exercise to help you relax and reset.'}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['⏱ 7 min', '📊 Easy'].map((pill, i) => (
                  <span key={i} style={{
                    fontSize: 11, fontWeight: 600,
                    padding: '4px 12px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#B8B4D8',
                  }}>{pill}</span>
                ))}
                {breathingDone && (
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '4px 12px', borderRadius: 20,
                    background: 'rgba(45,212,191,0.15)',
                    border: '1px solid rgba(45,212,191,0.3)',
                    color: '#2DD4BF',
                  }}>✓ Done</span>
                )}
              </div>
              {!breathingDone ? (
                <button
                  onClick={() => setShowBreathing(true)}
                  style={{ ...primaryBtn, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  <Play size={14} fill="#fff" strokeWidth={0} />
                  Start Now
                </button>
              ) : (
                <button
                  onClick={() => setShowBreathing(true)}
                  style={{ ...glassBtn, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  <Play size={14} strokeWidth={1.5} />
                  Do Again
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── 4. TODAY'S CHALLENGE ── */}
        <motion.div
          className="sc-anim-4 sc-card-hover"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          style={cardStyle}
        >
          <div style={sectionLabel}>★ TODAY'S CHALLENGE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Lotus Icon */}
            <div style={{
              width: 64, height: 64, borderRadius: 18, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(244,197,66,0.2), rgba(244,197,66,0.05))',
              border: '1px solid rgba(244,197,66,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LotusIcon size={36} />
            </div>
            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>
                  {CHALLENGES[1].name}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(244,197,66,0.15)',
                  border: '1px solid rgba(244,197,66,0.3)',
                  color: '#F4C542',
                }}>+{CHALLENGES[1].pts} pts</span>
              </div>
              <div style={{ fontSize: 13, color: '#8A84B6', marginBottom: 10, lineHeight: 1.55 }}>
                Write three things you're grateful for and notice how it shifts your energy.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#B8B4D8' }}>0 / 5 min</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
                  <div style={{ width: 0, height: '100%', background: '#8B5CF6', borderRadius: 4 }} />
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/chat', { state: { tab: 'healing' } })}
              style={{ ...primaryBtn, flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Start Challenge →
            </button>
          </div>
        </motion.div>

        {/* ── 5. TWO-COLUMN: Journey + Community ── */}
        <motion.div
          className="sc-anim-5 two-col-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16,
          }}
        >
          {/* LEFT: Continue Your Journey */}
          <div className="sc-card-hover" style={{ ...cardStyle, marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={sectionLabel}>⟳ CONTINUE YOUR JOURNEY</div>
              <button
                onClick={() => navigate('/journey')}
                style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                View All ›
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {journeyItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 12, borderRadius: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  {/* Image placeholder */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, ${['rgba(139,92,246,0.3)','rgba(244,197,66,0.3)','rgba(45,212,191,0.3)'][i]}, rgba(0,0,0,0.1))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>
                    {['🧠','📝','🧘'][i]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#8A84B6' }}>{item.type}</div>
                    {item.progress != null && (
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                          <div style={{ width: `${item.progress}%`, height: '100%', background: '#8B5CF6', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 10, color: '#8A84B6', whiteSpace: 'nowrap' }}>{item.progress}%</span>
                      </div>
                    )}
                  </div>
                  {item.status === 'done' && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(45,212,191,0.15)', border: '1px solid rgba(45,212,191,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: '#2DD4BF', fontWeight: 700,
                    }}>✓</div>
                  )}
                  {item.status !== 'done' && item.progress != null && (
                    <button
                      onClick={() => navigate('/journey')}
                      style={{ ...glassBtn, padding: '5px 12px', fontSize: 11, flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      Continue
                    </button>
                  )}
                  {item.status === 'draft' && (
                    <button
                      onClick={() => navigate('/mood')}
                      style={{ ...glassBtn, padding: '5px 12px', fontSize: 11, flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      Open
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Community For You */}
          <div className="sc-card-hover" style={{ ...cardStyle, marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={sectionLabel}>COMMUNITY FOR YOU</div>
              <button
                onClick={() => navigate('/groups')}
                style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                See all
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {communityGroups.map((g, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 12, borderRadius: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: `${g.color}22`, border: `1px solid ${g.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Users size={16} color={g.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{g.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2DD4BF' }} />
                      <span style={{ fontSize: 11, color: '#8A84B6' }}>{g.members} members online</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/groups')}
                    style={{ ...primaryBtn, padding: '6px 14px', fontSize: 12, flexShrink: 0 }}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 6. WEEKLY JOURNEY ── */}
        <motion.div
          className="sc-anim-6 sc-card-hover"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.40 }}
          style={cardStyle}
        >
          <div style={sectionLabel}>▒ WEEKLY JOURNEY</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 8,
          }}>
            {weekDays.map((day, i) => {
              const entry = weeklyData?.[i];
              const isToday = i === (today.getDay() + 6) % 7;
              const emoji = weatherEmoji(entry?.weather);

              return (
                <div key={i} onClick={isToday ? handleChangeWeather : undefined} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '14px 8px', borderRadius: 16,
                  background: isToday ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                  border: isToday
                    ? '1.5px solid rgba(139,92,246,0.5)'
                    : '1px solid rgba(255,255,255,0.06)',
                  cursor: isToday ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: isToday ? '#8B5CF6' : '#8A84B6', marginBottom: 10 }}>
                    {isToday ? 'Today' : day}
                  </span>
                  <div style={{ fontSize: 28, marginBottom: 6, lineHeight: 1 }}>
                    {emoji || (isToday ? (todayEntry?.weather ? weatherEmoji(todayEntry.weather) : '➕') : '—')}
                  </div>
                  <span style={{ fontSize: 10, color: '#8A84B6', textAlign: 'center', lineHeight: 1.3 }}>
                    {entry?.weather ? weatherLabel(entry.weather) : (isToday ? 'Check-in' : '—')}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Emotional Analytics ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.44 }}
          className="two-col-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}
        >
          <WeeklyChart weeklyData={weeklyData} />
          <AIInsightCard history={history} />
        </motion.div>

        {/* ── Streak + Calendar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.48 }}
          className="two-col-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}
        >
          <EmotionStreak streak={streak} weeklyData={weeklyData} />
          <EmotionCalendar calendarData={calendarData} currentMonth={currentMonth} />
        </motion.div>

        {/* ── Weather Widget (existing component) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.52 }}
          style={{ marginBottom: 16 }}
        >
          <WeatherWidget
            entry={todayEntry}
            onChangeWeather={handleChangeWeather}
            onViewHistory={openHistory}
          />
        </motion.div>

      </main>

      <div style={{ marginLeft: 0, marginRight: 280 }}>
        <Footer />
      </div>

      {/* ══ WEATHER HISTORY DRAWER ══ */}
      <AnimatePresence>
        {historyOpen && (
          <WeatherHistory history={history} onClose={closeHistory} />
        )}
      </AnimatePresence>

      {/* ══ BREATHING SESSION OVERLAY ══ */}
      <AnimatePresence>
        {showBreathing && (
          <BreathingSession
            onClose={() => setShowBreathing(false)}
            onComplete={() => {
              setBreathingDone(true);
              setShowBreathing(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ══ BREATHING COMPLETE TOAST ══ */}
      <AnimatePresence>
        {breathingDone && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
              zIndex: 8000,
              background: 'linear-gradient(135deg, #1A0A3E, #2D1260)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 16, padding: '14px 24px',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 22 }}>✓</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Breathing session complete!</div>
              <div style={{ fontSize: 12, color: '#B8B4D8' }}>Today's focus activity done.</div>
            </div>
            <button
              onClick={() => setBreathingDone(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 16, cursor: 'pointer', marginLeft: 8 }}
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
