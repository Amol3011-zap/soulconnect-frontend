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
  Target, Briefcase, BookOpen, Palette, Sparkles, Gift,
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
import GlobalPulseCard from '../components/dashboard/GlobalPulseCard';
import { useReflections } from '../hooks/useReflections';
import { getSoulMatches, scoreToPercent } from '../components/soulmatch/soulmatchData';

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
import TodaysFocusCard from '../components/TodaysFocusCard';
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

  return (
    <motion.button
      type="button"
      onClick={() => !isCompleted && onComplete(win.id)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={!isCompleted ? { scale: 0.96 } : undefined}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      style={{
        flex: '1 1 0', minWidth: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center',
        background: isCompleted
          ? 'linear-gradient(145deg, rgba(16,185,129,0.1), rgba(34,18,73,0.7))'
          : 'rgba(34,18,73,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isCompleted
          ? '1px solid rgba(16,185,129,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: '14px 8px 12px',
        position: 'relative',
        overflow: 'hidden',
        cursor: isCompleted ? 'default' : 'pointer',
        fontFamily: 'inherit',
        boxShadow: isCompleted
          ? '0 0 20px rgba(16,185,129,0.08), 0 6px 16px rgba(0,0,0,0.3)'
          : '0 6px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)',
        transition: 'box-shadow 0.25s, border 0.25s, transform 0.15s',
      }}
    >
      {/* Inner top highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      }} />

      {/* Icon bubble */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: meta.bg || 'rgba(139,92,246,0.15)',
        border: `1px solid ${meta.color ? meta.color + '40' : 'rgba(139,92,246,0.25)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8, flexShrink: 0,
        boxShadow: `0 0 14px ${meta.bg || 'rgba(139,92,246,0.1)'}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}>
        {isCompleted
          ? <CheckCircle size={18} color="#10B981" strokeWidth={2} />
          : IconComp
            ? <IconComp size={18} color={meta.color || '#A78BFA'} strokeWidth={1.75} />
            : <span style={{ fontSize: 17 }}>{meta.icon || '✨'}</span>
        }
      </div>

      {/* Title */}
      <div style={{
        fontSize: 12, fontWeight: 700,
        color: isCompleted ? '#86EFAC' : '#fff',
        marginBottom: 8, lineHeight: 1.3,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {win.title}
      </div>

      {/* Progress indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        fontSize: 10, fontWeight: 600,
        color: isCompleted ? '#10B981' : '#8A84B6',
      }}>
        {isCompleted
          ? <><CheckCircle size={11} /> 1/1</>
          : <><span style={{
              width: 12, height: 12, borderRadius: '50%',
              border: '1.5px solid rgba(184,180,216,0.4)', display: 'inline-block',
            }} /> 0/1</>
        }
      </div>
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
   PEOPLE WHO UNDERSTAND — Match cards for sidebar/dashboard
───────────────────────────────────────────────────────────────────────────── */
function PeopleWhoUnderstandCard({ match, onConnect }) {
  if (!match) return null;
  const matchPercent = scoreToPercent(match.match_score);
  const tags = match.struggles?.slice(0, 2) || [];
  const statement = match.statement || match.bio || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        flex: 1, minWidth: 0,
        background: 'rgba(34,18,73,0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '18px',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
      }}
    >
      {/* Inner top highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
      }} />

      {/* Avatar + Match % */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${match.avatar_color || '#7C3AED'}, ${match.avatar_color_2 || '#A855F7'})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 700, color: '#fff',
          boxShadow: `0 0 20px ${match.avatar_color || '#7C3AED'}55`,
        }}>
          {match.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)',
            border: '2px solid rgba(16,185,129,0.4)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: '#10B981',
          }}>
            {matchPercent || '?'}%
          </div>
          <div style={{
            fontSize: 10, color: '#8A84B6', textAlign: 'center', marginTop: 4,
          }}>
            Match
          </div>
        </div>
      </div>

      {/* Name + Location */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
          {match.name}, {match.age || '?'}
        </div>
        <div style={{ fontSize: 12, color: '#8A84B6', marginTop: 2 }}>
          📍 {match.location || 'India'}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#A78BFA',
              borderRadius: 14, padding: '3px 10px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Statement */}
      <p style={{
        fontSize: 13, color: '#B8B4D8', lineHeight: 1.5, margin: '0 0 14px',
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        "{statement}"
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onConnect?.(match)}
          style={{
            flex: 1,
            padding: '9px 14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            border: '1px solid rgba(168,85,247,0.3)',
            color: '#fff', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}
        >
          Connect
        </motion.button>
        <button style={{
          flex: 1,
          padding: '9px 14px', borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#B8B4D8', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Not Now
        </button>
      </div>
    </motion.div>
  );
}

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
  const [matches, setMatches] = useState([]);

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

  // Load SoulMatches
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const res = await getSoulMatches({});
        setMatches(res.matches?.slice(0, 3) || []);
      } catch (err) {
        console.error('Error loading matches:', err);
      }
    };
    loadMatches();
  }, []);

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
  const allDone = completedCount >= 3 && dailyWins.length > 0;

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
          scrollbar-width: thin;
          scrollbar-color: rgba(168,85,247,0.3) transparent;
        }
        .home-right-sidebar::-webkit-scrollbar {
          width: 5px;
        }
        .home-right-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .home-right-sidebar::-webkit-scrollbar-thumb {
          background: rgba(168,85,247,0.3);
          border-radius: 3px;
        }
        .home-right-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(168,85,247,0.5);
        }
        @media (max-width: 1100px) {
          .home-right-sidebar { display: none; }
          .home-main { margin-right: 0 !important; padding-bottom: 100px; }
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
            SECTION 2 — PEOPLE WHO UNDERSTAND
        ════════════════════════════════════════════════════════════ */}
        <div className="home-section" style={{ margin: '0 32px 16px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ ...SECTION_LABEL, marginBottom: 2 }}>💜 PEOPLE WHO UNDERSTAND</div>
              <div style={{ fontSize: 12, color: 'rgba(184,180,216,0.55)' }}>You're not alone. Here are people going through similar experiences.</div>
            </div>
            <button
              onClick={() => navigate('/matches')}
              style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              View All ›
            </button>
          </div>

          {matches.length > 0 ? (
            <div style={{ display: 'flex', gap: 12 }}>
              {matches.map((match, i) => (
                <PeopleWhoUnderstandCard
                  key={match.id || i}
                  match={match}
                  onConnect={() => navigate('/matches')}
                />
              ))}
            </div>
          ) : (
            <div style={{
              ...CARD_STYLE, textAlign: 'center', padding: '28px',
              color: '#8A84B6', fontSize: 13,
            }}>
              Loading your SoulMatches...
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4 — TINY WINS
        ════════════════════════════════════════════════════════════ */}
        <div className="home-section" style={{ margin: '0 32px 16px', position: 'relative', zIndex: 1 }}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ ...SECTION_LABEL, marginBottom: 2 }}>🌿 TINY WINS</div>
              <div style={{ fontSize: 12, color: 'rgba(184,180,216,0.55)' }}>Small steps. Big change.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#8A84B6', marginRight: 4 }}>
                  {completedCount} of {dailyWins.length} Completed
                </span>
                {dailyWins.map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < completedCount
                      ? 'linear-gradient(135deg,#F4C542,#F59E0B)'
                      : 'rgba(255,255,255,0.15)',
                    boxShadow: i < completedCount ? '0 0 6px rgba(244,197,66,0.5)' : 'none',
                  }} />
                ))}
              </div>
              <button
                onClick={() => navigate('/tiny-wins')}
                style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                View All ›
              </button>
            </div>
          </div>

          {/* 3 win cards */}
          {dailyWins.length > 0 ? (
            <div className="wins-scroll" style={{ display: 'flex', gap: 12 }}>
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
            SECTION 5 — LATEST SOUL STORIES
        ════════════════════════════════════════════════════════════ */}
        <div className="home-section" style={{ margin: '0 32px 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ ...SECTION_LABEL, marginBottom: 0 }}>📖 LATEST SOUL STORIES</span>
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

      {/* ════════════════════ RIGHT SIDEBAR ════════════════════ */}
      <div className="home-right-sidebar">

        {/* ── Card 1: Today's Focus ── */}
        <div ref={todaysFocusRef} style={{ marginBottom: 12 }}>
          <TodaysFocusCard
            selectedMood={selectedWeather}
            onSessionComplete={() => setBreathingDone(true)}
          />
        </div>

        {/* ── Card 2: Global Pulse ── */}
        <div style={{ marginBottom: 12 }}>
          <GlobalPulseCard />
        </div>

        {/* ── Card 3: Upcoming Session ── */}
        <div className="sidebar-card-inner" style={{ ...CARD_STYLE, marginBottom: 12, display: 'flex', flexDirection: 'column' }}>
          <div style={SECTION_LABEL}>Upcoming Session</div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Online Therapy</div>
              <div style={{ fontSize: 12, color: '#8A84B6', marginBottom: 2 }}>with Dr. Meera Sharma</div>
              <div style={{ fontSize: 12, color: '#B8B4D8' }}>📅 Tomorrow, 11:00 AM</div>
            </div>
            <div style={{
              width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: '#fff',
              boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            }}>
              M
            </div>
          </div>

          <button
            onClick={() => navigate('/professionals')}
            style={{ ...GLASS_BTN, width: '100%', padding: '8px', textAlign: 'center', marginTop: 8, borderRadius: 11, fontSize: 11 }}
          >
            View Session
          </button>
        </div>

        {/* ── Card 4: Inspiration ── */}
        <div className="sidebar-card-inner" style={{
          ...CARD_STYLE,
          marginBottom: 0,
          flex: 1,
          background: 'linear-gradient(135deg, rgba(192, 132, 250, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative gradient blobs */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(168,85,247,0.2) 0%, transparent 50%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{
              fontSize: 13, fontStyle: 'italic', color: '#E2DEFF', lineHeight: 1.6,
              margin: '0 0 8px',
              fontWeight: 500,
            }}>
              "Healing is not a<br/>destination,<br/>it's a journey."
            </p>
            <div style={{
              fontSize: 40, marginTop: 6,
            }}>
              🌿
            </div>
          </div>
        </div>

      </div>{/* end .home-right-sidebar */}

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
