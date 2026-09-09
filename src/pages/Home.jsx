import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { useWeatherStore } from '../store/weather';
import { useTinyWinsStore } from '../store/tinyWins';
import { CATEGORY_META } from '../data/tinyWinsChallenges';
import ErrorToast from '../components/ErrorToast';
import { DashboardSkeleton } from '../components/Skeletons';
import {
  Search, Bell, Heart, MessageCircle, Bookmark, Clock,
  CheckCircle, MoreHorizontal,
  Activity, Droplets, Wind, Brain, Flower2,
  Users, Zap, Star, Moon, Monitor, Leaf,
  Target, Briefcase, BookOpen, Palette, Sparkles, Gift, ArrowRight,
} from 'lucide-react';
import AICompanionCard from '../components/AICompanionCard';
import AIInsightCard from '../components/AIInsightCard';
import FloatingCompanion from '../components/FloatingCompanion';
import TodaysReflectionModal from '../components/TodaysReflectionModal';
import ProgressModal from '../components/ProgressModal';
import WeeklyInsightsModal from '../components/WeeklyInsightsModal';
import SearchModal from '../components/SearchModal';
import NotificationDropdown from '../components/NotificationDropdown';
import EmotionWeatherModal from '../components/emotional-weather/EmotionWeatherModal';
import SoulClimateWidget from '../components/SoulClimateWidget';
import { useReflections } from '../hooks/useReflections';

const CATEGORY_ICONS = {
  'Movement':          Activity,
  'Body':              Droplets,
  'Breathing':         Wind,
  'Mind':              Brain,
  'Meditation':        Flower2,
  'Connection':        Users,
  'Confidence':        Zap,
  'Gratitude':         Star,
  'Sleep':             Moon,
  'Digital Wellbeing': Monitor,
  'Nature':            Leaf,
  'Focus':             Target,
  'Relationships':     Heart,
  'Work':              Briefcase,
  'Learning':          BookOpen,
  'Creativity':        Palette,
  'Self Care':         Sparkles,
  'Kindness':          Gift,
};
import BreathingSession from '../components/BreathingSession';
import SoulMatchSection from '../components/dashboard/SoulMatchSection';
import RightSidebar from '../components/dashboard/RightSidebar';
import DashboardStyles from '../components/dashboard/dashboardStyles';
import OnboardingModal from '../components/OnboardingModal';
import { onboardingAPI } from '../services/api';

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────────────────────────────────────── */
function FloatingParticles({ count = 14 }) {
  // Skip all particles on mobile — 14 simultaneous CSS animations cause repaints
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  if (isMobile) return null;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 1.5 + (i % 3) * 0.8,
    left: `${(i * 7.3 + 8) % 92}%`,
    top:  `${(i * 11.7 + 4) % 88}%`,
    duration: 8 + (i % 6) * 1.8,
    delay: i * 0.55,
    opacity: 0.12 + (i % 4) * 0.05,
    color: i % 3 === 0 ? '#A78BFA' : i % 3 === 1 ? '#F4C542' : '#C4B5FD',
  }));
  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            left: p.left, top: p.top,
            animation: `particleDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SOUL CLIMATE ORB  (premium 3-D glass sphere)
───────────────────────────────────────────────────────────────────────────── */
function SoulClimateOrb() {
  return (
    <div className="orb-float" style={{ position: 'relative', width: 220, height: 220, flexShrink: 0 }}>
      {/* Ambient halo */}
      <div style={{
        position: 'absolute', inset: -28,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.28) 0%, transparent 68%)',
        filter: 'blur(12px)',
      }} />
      {/* Ground reflection */}
      <div style={{
        position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 18,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(168,85,247,0.45) 0%, transparent 70%)',
        filter: 'blur(6px)',
      }} />

      <svg viewBox="0 0 220 220" width="220" height="220" style={{ filter: 'drop-shadow(0 0 36px rgba(139,92,246,0.65))' }}>
        <defs>
          <radialGradient id="orbBase" cx="36%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#DDD6FE" stopOpacity="0.96" />
            <stop offset="30%"  stopColor="#8B5CF6" stopOpacity="0.88" />
            <stop offset="70%"  stopColor="#4C1D95" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#1A0A3E" stopOpacity="0.97" />
          </radialGradient>
          <radialGradient id="cloudFill" cx="50%" cy="38%" r="62%">
            <stop offset="0%"   stopColor="#EDE9FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </radialGradient>
          <radialGradient id="orbFloor" cx="50%" cy="100%" r="50%">
            <stop offset="0%"   stopColor="rgba(168,85,247,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="cloudBlur">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="orbClip">
            <circle cx="110" cy="110" r="94" />
          </clipPath>
        </defs>

        {/* Main sphere */}
        <circle cx="110" cy="110" r="96" fill="url(#orbBase)" />

        {/* Inner rim glow */}
        <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(196,181,253,0.25)" strokeWidth="1.5" />

        {/* Specular highlight (top-left) */}
        <ellipse cx="82" cy="72" rx="30" ry="20" fill="rgba(255,255,255,0.22)" transform="rotate(-15,82,72)" />
        <ellipse cx="75" cy="65" rx="12" ry="7" fill="rgba(255,255,255,0.35)" transform="rotate(-15,75,65)" />

        {/* Floor gradient inside */}
        <ellipse cx="110" cy="196" rx="70" ry="20" fill="url(#orbFloor)" clipPath="url(#orbClip)" />

        {/* Cloud body */}
        <g filter="url(#cloudBlur)" clipPath="url(#orbClip)">
          <circle cx="95"  cy="128" r="20" fill="url(#cloudFill)" opacity="0.95" />
          <circle cx="113" cy="118" r="25" fill="#D8B4FE" opacity="0.9" />
          <circle cx="133" cy="125" r="18" fill="url(#cloudFill)" opacity="0.9" />
          <rect x="76" y="126" width="76" height="22" rx="11" fill="#D8B4FE" opacity="0.95" />
        </g>

        {/* Cloud face */}
        <circle cx="108" cy="119" r="3.5" fill="#5B21B6" />
        <circle cx="120" cy="119" r="3.5" fill="#5B21B6" />
        <path d="M107 128 Q114 135 122 128" stroke="#5B21B6" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Stars/sparkles */}
        <g filter="url(#softGlow)" fill="#F4C542">
          <circle cx="52"  cy="52"  r="3" opacity="0.9" />
          <circle cx="168" cy="40"  r="2" opacity="0.7" />
          <circle cx="172" cy="82"  r="2.5" opacity="0.6" />
          <circle cx="44"  cy="150" r="2" opacity="0.5" />
          <circle cx="178" cy="155" r="1.8" opacity="0.5" />
        </g>
        {/* Star cross at top-left */}
        <g fill="#F4C542" opacity="0.85" filter="url(#softGlow)">
          <rect x="47"  y="42" width="1.5" height="8" rx="1" transform="rotate(0,47,46)" />
          <rect x="47"  y="42" width="1.5" height="8" rx="1" transform="rotate(90,47,46)" />
        </g>

        {/* Platform glow */}
        <ellipse cx="110" cy="200" rx="58" ry="10" fill="rgba(139,92,246,0.45)" />
        <ellipse cx="110" cy="200" rx="36" ry="6"  fill="rgba(168,85,247,0.65)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TINY WIN HOME CARD  (horizontal, 3-column layout)
───────────────────────────────────────────────────────────────────────────── */
function HomeTinyWinCard({ win, index, isCompleted, onComplete }) {
  if (!win) return null;
  const meta = CATEGORY_META[win.category] || {};
  const IconComp = CATEGORY_ICONS[win.category];
  const accent = meta.color || '#A78BFA';

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      whileTap={{ scale: 0.975 }}
      onClick={() => !isCompleted && onComplete(win.id)}
      aria-pressed={isCompleted}
      aria-label={`${win.title}${win.duration ? `, ${win.duration}` : ''}. ${isCompleted ? 'Completed' : 'Mark as complete'}`}
      title={win.description || win.title}
      className="tw-tile"
      style={{
        borderColor: isCompleted ? 'rgba(16,185,129,0.3)' : `${accent}24`,
        background: isCompleted
          ? 'linear-gradient(160deg, rgba(16,185,129,0.10), rgba(28,16,60,0.72))'
          : `linear-gradient(160deg, ${accent}1F 0%, rgba(30,17,62,0.78) 58%, rgba(22,13,48,0.82) 100%)`,
        cursor: isCompleted ? 'default' : 'pointer',
      }}
    >
      {/* Icon chip */}
      <span
        className="tw-tile-icon"
        style={{
          background: `linear-gradient(145deg, ${accent}E6 0%, ${accent}99 55%, ${accent}66 100%)`,
          border: `1px solid ${accent}80`,
          boxShadow: `0 4px 14px ${accent}66, 0 0 22px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.35)`,
        }}
      >
        {IconComp
          ? <IconComp size={19} color="#fff" strokeWidth={2.1} aria-hidden="true"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.28))' }} />
          : <span style={{ fontSize: 17 }} aria-hidden="true">{meta.icon || '✨'}</span>}
      </span>

      {/* Label */}
      <span
        className="tw-tile-label"
        style={{ color: isCompleted ? '#86EFAC' : 'rgba(240,238,255,0.94)' }}
      >
        {win.shortTitle || win.title}
      </span>

      {/* Footer: check indicator + per-item progress */}
      <span className="tw-tile-foot">
        {isCompleted ? (
          <CheckCircle size={17} color="#10B981" strokeWidth={2.2} aria-hidden="true" />
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: 17, height: 17, borderRadius: '50%',
              border: '1.6px solid rgba(255,255,255,0.26)',
              display: 'block',
            }}
          />
        )}
        <span style={{
          fontSize: 11.5, fontWeight: 600,
          color: isCompleted ? 'rgba(134,239,172,0.85)' : 'rgba(184,180,216,0.5)',
        }}>
          {isCompleted ? 1 : 0}/1
        </span>
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AI INSIGHT BRAIN SVG  (premium)
───────────────────────────────────────────────────────────────────────────── */
function BrainIllustration() {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: -16,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 65%)',
        filter: 'blur(8px)',
      }} />
      <svg viewBox="0 0 120 120" width="100" height="100" style={{ position: 'relative', filter: 'drop-shadow(0 0 18px rgba(139,92,246,0.6))' }}>
        <defs>
          <radialGradient id="brainG2" cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#C4B5FD" />
            <stop offset="60%"  stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3C096C" />
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="52" rx="38" ry="32" fill="url(#brainG2)" opacity="0.95" />
        <ellipse cx="44" cy="52" rx="22" ry="28" fill="#A78BFA" opacity="0.65" />
        <ellipse cx="76" cy="52" rx="22" ry="28" fill="#8B5CF6" opacity="0.65" />
        <path d="M60 24 Q60 38 60 52" stroke="rgba(196,181,253,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M38 38 Q50 48 38 62" stroke="rgba(196,181,253,0.3)" strokeWidth="1.2" fill="none" />
        <path d="M82 38 Q70 48 82 62" stroke="rgba(196,181,253,0.3)" strokeWidth="1.2" fill="none" />
        <path d="M42 52 Q60 46 78 52" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
        <line x1="60" y1="84" x2="60" y2="100" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="60" cy="104" rx="20" ry="5" fill="rgba(139,92,246,0.3)" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <circle key={i} cx={60 + 50 * Math.cos(rad)} cy={60 + 50 * Math.sin(rad)} r="2.5" fill="#F4C542" opacity="0.65" />;
        })}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WEEKLY STATS (donut + bars)
───────────────────────────────────────────────────────────────────────────── */
function WeeklyStatsCard({ weeklyStats }) {
  const { total, daily = [], byCategory = {} } = weeklyStats || {};
  const maxPossible = 21; // 7 days × 3 wins
  const pct = Math.round(((total || 0) / maxPossible) * 100);

  // Donut
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ * (1 - (pct / 100));

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const barMax = Math.max(...(daily.map(d => d.count || 0)), 1);

  return (
    <div style={{ ...CARD_STYLE }}>
      <div style={SECTION_LABEL}>🔥 THIS WEEK</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        {/* Left: text + bars */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {total || 0}
          </div>
          <div style={{ fontSize: 11, color: '#8A84B6', marginBottom: 12 }}>Tiny Wins Completed</div>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 36 }}>
            {days.map((day, i) => {
              const count = daily[i]?.count || 0;
              const h = Math.max(4, Math.round((count / barMax) * 32));
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    width: 12, height: h, borderRadius: 3,
                    background: count > 0
                      ? 'linear-gradient(180deg, #A855F7, #7C3AED)'
                      : 'rgba(255,255,255,0.08)',
                    transition: 'height 0.6s ease',
                    boxShadow: count > 0 ? '0 0 6px rgba(168,85,247,0.4)' : 'none',
                  }} />
                  <span style={{ fontSize: 9, color: '#8A84B6' }}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Donut */}
        <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
          <svg width="70" height="70" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="35" cy="35" r={r} fill="none"
              stroke="url(#donutGrad)"
              strokeWidth="6"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <defs>
              <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#F4C542" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F4C542', lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 8, color: '#8A84B6', lineHeight: 1.3, textAlign: 'center' }}>Com-<br/>pletion</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REFLECTION TOAST
───────────────────────────────────────────────────────────────────────────── */
function ReflectionToast({ text, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{  opacity: 0, y: 40, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      style={{
        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(34,18,73,0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: 20,
        padding: '14px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 0 40px rgba(124,58,237,0.35), 0 16px 40px rgba(0,0,0,0.4)',
        maxWidth: 360, minWidth: 260,
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        boxShadow: '0 0 12px rgba(124,58,237,0.5)',
      }}>
        💜
      </div>
      <p style={{
        margin: 0, fontSize: 13, color: '#E2DEFF',
        lineHeight: 1.5, fontStyle: 'italic', fontWeight: 400,
      }}>
        {text}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED STYLE OBJECTS
───────────────────────────────────────────────────────────────────────────── */
const CARD_STYLE = {
  background: 'rgba(34,18,73,0.72)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 24,
  padding: '20px 20px',
  marginBottom: 14,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
  position: 'relative',
  overflow: 'hidden',
};

const SECTION_LABEL = {
  fontSize: 11, color: '#F4C542', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
};

const GLASS_BTN = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12, color: '#E2DEFF',
  cursor: 'pointer', padding: '8px 16px',
  fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
};

const PURPLE_BTN = {
  background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
  border: 'none', borderRadius: 14, color: '#fff',
  cursor: 'pointer', fontWeight: 700, fontSize: 14,
  padding: '11px 24px',
  boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
  fontFamily: 'Inter, sans-serif',
};

const WEATHER_OPTIONS = [
  { id: 'clear-sky',  emoji: '☀️', label: 'Clear'      },
  { id: 'hope',       emoji: '🌤', label: 'Hope'       },
  { id: 'blooming',   emoji: '🌸', label: 'Blooming'   },
  { id: 'fog',        emoji: '🌫', label: 'Fog'        },
  { id: 'heavy-rain', emoji: '🌧', label: 'Heavy Rain' },
  { id: 'storm',      emoji: '⚡', label: 'Storm'      },
];

const STORIES = [
  {
    name: 'Anonymous', avatar: '?', avatarColor: '#374151',
    time: '2h ago', tag: 'Growth', tagColor: '#10B981',
    preview: '"Today I finally said no without feeling guilty."',
    hearts: 128, comments: 32,
  },
  {
    name: 'Riya', avatar: 'R', avatarColor: '#7C3AED',
    time: '5h ago', tag: 'Overthinking', tagColor: '#8B5CF6',
    preview: '"After weeks of overthinking, I chose to let it go."',
    hearts: 96, comments: 18,
  },
  {
    name: 'Arjun', avatar: 'A', avatarColor: '#D97706',
    time: '8h ago', tag: 'Motivation', tagColor: '#F59E0B',
    preview: '"Small steps every day really do change everything."',
    hearts: 112, comments: 24,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { todayEntry, submitWeather, showModal } = useWeatherStore();
  const {
    dailyWins, completedToday, checkAndRefresh, completeWin,
    totalWins, showReflection, reflectionText, dismissReflection,
    getWeeklyStats,
  } = useTinyWinsStore();

  const userId    = user?.id || user?.user_id || 1;
  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingDone, setBreathingDone] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState(todayEntry?.weather || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Today's Reflection modal
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [reflectionSavedToast, setReflectionSavedToast] = useState(false);
  const { todayReflection, saveReflection, isExisting } = useReflections();

  // Companion modals
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [weeklyInsightsOpen, setWeeklyInsightsOpen] = useState(false);

  // Search + Notifications
  const [searchOpen, setSearchOpen]   = useState(false);
  const [notifOpen,  setNotifOpen]    = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const bellRef = useRef(null);

  // Ref for "Continue Journey" smooth scroll to Today's Focus card
  const todaysFocusRef = useRef(null);

  // Check if user completed onboarding and initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        // Check localStorage first (fast path)
        const onboardingDone = localStorage.getItem('onboarding-completed');
        if (onboardingDone === 'true') {
          setShowOnboarding(false);
          setLoading(false);
          return;
        }

        // Check API
        try {
          const res = await onboardingAPI.getStatus();
          if (res.data.completed) {
            localStorage.setItem('onboarding-completed', 'true');
            setShowOnboarding(false);
          } else {
            setShowOnboarding(true);
          }
        } catch (err) {
          // If API fails, don't show onboarding (user likely already completed it)
          setShowOnboarding(false);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing dashboard:', err);
        setError('Failed to load dashboard. Please refresh.');
        setLoading(false);
      }
    };
    initializeDashboard();
  }, []);

  function handleReflectionSaved() {
    setReflectionSavedToast(true);
    setTimeout(() => setReflectionSavedToast(false), 4000);
  }

  // Initialize Tiny Wins for today
  useEffect(() => {
    const weatherId = todayEntry?.weather || 'clear-sky';
    checkAndRefresh(weatherId);
  }, [todayEntry?.weather]);

  // Sync selectedWeather with todayEntry when it updates
  useEffect(() => {
    if (todayEntry?.weather) {
      setSelectedWeather(todayEntry.weather);
    }
  }, [todayEntry?.weather]);

  const handleWeatherSelect = useCallback((id) => {
    setSelectedWeather(id);
    submitWeather(id, userId);
  }, [userId, submitWeather]);

  const handleCheckIn = useCallback(() => {
    useWeatherStore.setState({ showModal: true });
  }, []);

  const weeklyStats = getWeeklyStats();
  const completedCount = completedToday.length;
  const allDone = dailyWins.length > 0 && completedCount >= dailyWins.length;

  // Handle error state
  if (error) {
    return (
      <>
        <ErrorToast
          message={error}
          onRetry={() => window.location.reload()}
          onDismiss={() => setError('')}
        />
        <div
          style={{
            minHeight: '100vh',
            background: '#0D0B1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
            padding: '20px',
          }}
        >
          <p style={{ color: '#8A84B6', textAlign: 'center', fontSize: 16 }}>
            Unable to load dashboard. Please try again.
          </p>
        </div>
      </>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0D0B1A',
          padding: '24px 32px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <>
      <DashboardStyles />

      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes particleDrift {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(6px,-10px); }
          66%      { transform: translate(-4px,6px); }
        }
        @keyframes companionParticleDrift {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(4px,-8px); }
          66%      { transform: translate(-3px,5px); }
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes auroraShift {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.8; transform: scale(1.06); }
        }
        .orb-float { animation: orbFloat 9s ease-in-out infinite; }
        .home-main {
          margin-right: 290px;
          min-height: 100vh;
          position: relative;
        }
        .home-right-sidebar {
          position: fixed; right: 0; top: 0; bottom: 0; width: 290px;
          background: rgba(8,6,22,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          padding: 24px 16px 20px;
          z-index: 50;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
        }
        .home-right-sidebar::-webkit-scrollbar { display: none; }
        /* Below 1100px the rail stops being a rail: it flows after the main
           feed as full-width cards rather than disappearing entirely. */
        @media (max-width: 1100px) {
          .home-right-sidebar {
            position: static;
            width: auto;
            background: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border-left: none;
            padding: 0;
            overflow: visible;
          }
          .home-main { margin-right: 0 !important; padding-bottom: 20px; }
        }

        /* ── Mobile ≤ 768px ── */
        @media (max-width: 768px) {
          .home-main {
            margin-right: 0 !important;
            padding-bottom: 0 !important;
          }
          /* Kill aurora animations on mobile — they cause constant repaints */
          .aurora-layer { animation: none !important; opacity: 0.5 !important; }
          /* Kill particle drift on mobile */
          .home-particle { animation: none !important; }
          /* Kill orb float on mobile */
          .orb-float { animation: none !important; }
          /* Header */
          .home-header {
            padding: 20px 16px 0 !important;
          }
          .home-header h1 {
            font-size: 22px !important;
          }
          /* All sections full-width with 16px side padding */
          .home-section {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          /* Soul climate card horizontal → vertical on mobile */
          .soul-climate-body {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .soul-climate-body > * { width: 100% !important; }
          /* Challenges: show 1.2 cards at a time */
          .challenges-scroll { padding-left: 16px !important; padding-right: 16px !important; }
          .challenge-card { min-width: 200px !important; }
          /* Stories: show 1.2 at a time */
          .stories-scroll { padding-left: 16px !important; }
          .story-card { min-width: 240px !important; width: 240px !important; }
          /* Soul climate card padding */
          .soul-climate-card { padding: 16px !important; }
          /* Hide vertical divider when stacked */
          .climate-divider { display: none !important; }
          /* Section headers */
          .section-header { padding: 0 16px !important; }
          /* Tiny wins: horizontally scrollable on mobile */
          .wins-scroll {
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            padding-bottom: 8px !important;
          }
          .wins-scroll::-webkit-scrollbar { display: none; }
          .wins-scroll > * {
            flex-shrink: 0 !important;
            min-width: 220px !important;
            max-width: 260px !important;
            scroll-snap-align: start !important;
          }
        }
        .weather-pill { transition: all 0.2s ease; }
        .weather-pill:hover { background: rgba(139,92,246,0.25) !important; }
        .icon-btn { transition: background 0.2s ease; }
        .icon-btn:hover { background: rgba(255,255,255,0.14) !important; }
        .story-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .story-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.15) !important;
        }
        .sidebar-card-inner { transition: box-shadow 0.25s ease; }
        .sidebar-card-inner:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.2) !important;
        }
      `}</style>

      {/* ── Breathing overlay ── */}
      <AnimatePresence>
        {showBreathing && (
          <BreathingSession
            onClose={() => setShowBreathing(false)}
            onComplete={() => { setBreathingDone(true); setShowBreathing(false); }}
          />
        )}
      </AnimatePresence>

      {/* ── Tiny Wins reflection toast ── */}
      <AnimatePresence>
        {showReflection && (
          <ReflectionToast key="reflection" text={reflectionText} onDismiss={dismissReflection} />
        )}
      </AnimatePresence>

      {/* ── Reflection saved success toast ── */}
      <AnimatePresence>
        {reflectionSavedToast && (
          <ReflectionToast
            key="refl-saved"
            text="Reflection saved successfully. Keep showing up for yourself. 💜"
            onDismiss={() => setReflectionSavedToast(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Global Search modal ── */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Emotion Weather Check-in Modal ── */}
      <AnimatePresence>
        {showModal && <EmotionWeatherModal />}
      </AnimatePresence>

      {/* ── Today's Reflection modal ── */}
      <TodaysReflectionModal
        isOpen={reflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        onSaved={handleReflectionSaved}
        saveReflection={saveReflection}
        initialValue={todayReflection}
        isExisting={isExisting}
        userName={firstName}
        winsToday={completedToday.length}
        hasCheckedIn={Boolean(todayEntry)}
      />

      {/* ── Progress modal ── */}
      <ProgressModal
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        streak={todayEntry ? 4 : 0}
        totalWins={totalWins}
        winsToday={completedCount}
        storiesCount={0}
        daysActive={todayEntry ? 4 : 1}
        currentWeather={selectedWeather}
      />

      {/* ── Weekly Insights modal ── */}
      <WeeklyInsightsModal
        isOpen={weeklyInsightsOpen}
        onClose={() => setWeeklyInsightsOpen(false)}
        weeklyStats={weeklyStats}
        checkInsThisWeek={todayEntry ? 4 : 0}
        storiesThisWeek={0}
      />

      {/* ════════════════════ MAIN CONTENT ════════════════════ */}
      <div className="home-main">

        {/* Aurora background layers */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
          <div className="aurora-layer" style={{
            position: 'absolute', top: -100, left: '10%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 65%)',
            animation: 'auroraShift 14s ease-in-out infinite',
          }} />
          <div className="aurora-layer" style={{
            position: 'absolute', top: 200, right: -100,
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 65%)',
            animation: 'auroraShift 18s ease-in-out 3s infinite',
          }} />
        </div>

        {/* ── HEADER ── */}
        <div className="home-header" style={{
          padding: '24px 32px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          position: 'relative', zIndex: 1,
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(184,180,216,0.65)', margin: '5px 0 0' }}>
              Take a deep breath. You've got this.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
            <button className="icon-btn" onClick={() => setSearchOpen(true)} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 12, width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Search size={16} color="#B8B4D8" />
            </button>

            <div ref={bellRef} style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                onClick={() => setNotifOpen(prev => !prev)}
                style={{
                  background: notifOpen ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)',
                  border: notifOpen ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 12, width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Bell size={16} color={notifOpen ? '#A78BFA' : '#B8B4D8'} />
              </button>
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
                color: '#fff', fontSize: 9, fontWeight: 700,
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #080812',
              }}>3</span>
              <NotificationDropdown
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
                anchorRef={bellRef}
              />
            </div>

            <div onClick={() => navigate('/profile')} style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer',
              boxShadow: '0 0 14px rgba(124,58,237,0.5)',
            }}>
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 1 — SOUL CLIMATE (full width)
        ════════════════════════════════════════════════════════════ */}
        <div className="home-section" style={{
          margin: '20px 32px 16px',
          position: 'relative', zIndex: 1,
        }}>
          <SoulClimateWidget
            selectedMood={selectedWeather}
            onMoodSelect={handleWeatherSelect}
            onCheckIn={handleCheckIn}
            isCheckedIn={selectedWeather !== null}
          />
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2 — PEOPLE WHO UNDERSTAND (SoulMatch)
        ════════════════════════════════════════════════════════════ */}
        <div className="home-section" style={{ margin: '0 32px 16px', position: 'relative', zIndex: 1 }}>
          <SoulMatchSection onCheckIn={handleCheckIn} />
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 3 — TINY WINS
        ════════════════════════════════════════════════════════════ */}
        <div className="home-section tw-panel" style={{ margin: '0 32px 16px', position: 'relative', zIndex: 1 }}>

          {/* Section header */}
          <div className="sc-section-head" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginBottom: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <Leaf size={20} strokeWidth={2} color="#6EE7B7" aria-hidden="true" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <h2 style={{
                  margin: 0, fontSize: 17, fontWeight: 700, color: '#F5F3FF',
                  letterSpacing: '-0.02em', lineHeight: 1.2,
                }}>
                  Tiny Wins
                </h2>
                <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'rgba(184,180,216,0.55)' }}>
                  Small steps. Big change.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/tiny-wins')}
              className="sc-link-btn"
              aria-label={`View all Tiny Wins. ${completedCount} of ${dailyWins.length} completed today.`}
            >
              View All <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>

          {/* Win tiles */}
          {dailyWins.length > 0 ? (
            <div className="tw-grid">
              {dailyWins.map((win, i) => (
                <HomeTinyWinCard
                  key={win.id}
                  win={win}
                  index={i}
                  isCompleted={completedToday.includes(win.id)}
                  onComplete={completeWin}
                />
              ))}
            </div>
          ) : (
            <div style={{
              ...CARD_STYLE, textAlign: 'center', padding: '28px',
              color: '#8A84B6', fontSize: 13,
            }}>
              Loading your personalized Tiny Wins...
            </div>
          )}

          {/* All done message */}
          <AnimatePresence>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: 12, padding: '10px 16px', borderRadius: 14,
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  textAlign: 'center', fontSize: 13, color: '#C4B5FD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <span>💜</span>
                <span>Great job! You've completed all your Tiny Wins for today.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 3 — LATEST SOUL STORIES
        ════════════════════════════════════════════════════════════ */}
        <div className="home-section" style={{ margin: '0 32px 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ ...SECTION_LABEL, marginBottom: 0 }}>LATEST SOUL STORIES</span>
            <button
              onClick={() => navigate('/stories')}
              style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              View All ›
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {STORIES.map((story, i) => (
              <motion.div
                key={i}
                className="story-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => navigate('/stories')}
                style={{
                  flex: 1, minWidth: 0,
                  background: 'rgba(34,18,73,0.72)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderRadius: 22,
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Inner top highlight */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
                }} />

                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: story.avatarColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                    boxShadow: `0 0 10px ${story.avatarColor}55`,
                  }}>
                    {story.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {story.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#8A84B6' }}>{story.time}</div>
                  </div>
                  <MoreHorizontal size={14} color="#8A84B6" />
                </div>

                {/* Preview */}
                <p style={{
                  fontSize: 13, color: '#B8B4D8', lineHeight: 1.6, margin: '0 0 10px',
                  display: '-webkit-box', WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {story.preview}
                </p>

                {/* Tag */}
                <span style={{
                  display: 'inline-block',
                  background: `${story.tagColor}1A`,
                  border: `1px solid ${story.tagColor}44`,
                  color: story.tagColor,
                  fontSize: 11, fontWeight: 600, borderRadius: 20,
                  padding: '3px 10px', marginBottom: 10,
                }}>
                  {story.tag}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8A84B6' }}>
                    <Heart size={12} /> {story.hearts}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8A84B6' }}>
                    <MessageCircle size={12} /> {story.comments}
                  </span>
                  <Bookmark size={13} color="#8A84B6" style={{ marginLeft: 'auto' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>{/* end .home-main */}

      {/* ════════════════════ RIGHT SIDEBAR ════════════════════
          Desktop: pinned right rail. Below 1100px the same cards render
          inside the main feed instead (see .rs-stack in dashboardStyles). */}
      <div className="home-right-sidebar" ref={todaysFocusRef}>
        <RightSidebar />
      </div>

      {/* ════════════════════ FLOATING COMPANION ════════════════════ */}
      <FloatingCompanion
        onReflection={() => setReflectionModalOpen(true)}
        onBreathing={() => setShowBreathing(true)}
        onEmotionalWeather={handleCheckIn}
        onSupport={() => navigate('/professionals')}
      />

      {/* ════════════════════ ONBOARDING MODAL ════════════════════ */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
