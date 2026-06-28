import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTinyWinsStore } from '../store/tinyWins';
import { useWeatherStore } from '../store/weather';
import { CATEGORY_META, WORK_MODES } from '../data/tinyWinsChallenges';
import TinyWinCard from '../components/TinyWinCard';
import { ChevronLeft, Settings, Trophy, Star, Flame, Calendar } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const MILESTONES = [
  { wins: 25,  icon: '🌿', label: 'New Leaf',     color: '#10B981' },
  { wins: 100, icon: '🌸', label: 'Flower',       color: '#EC4899' },
  { wins: 250, icon: '🦋', label: 'Butterfly',    color: '#8B5CF6' },
  { wins: 500, icon: '🪷', label: 'Golden Lotus', color: '#F59E0B' },
];

function getNextMilestone(totalWins) {
  return MILESTONES.find(m => m.wins > totalWins) || MILESTONES[MILESTONES.length - 1];
}

function getPrevMilestone(totalWins) {
  const reached = MILESTONES.filter(m => m.wins <= totalWins);
  return reached[reached.length - 1] || null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED STYLES
───────────────────────────────────────────────────────────────────────────── */
const CARD = {
  background: 'rgba(34,18,73,0.72)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 24,
  padding: '20px',
  marginBottom: 14,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
  position: 'relative',
  overflow: 'hidden',
};

const LABEL = {
  fontSize: 11, color: '#F4C542', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
};

/* ─────────────────────────────────────────────────────────────────────────────
   HEALING TREE PROGRESS
───────────────────────────────────────────────────────────────────────────── */
function HealingTreeProgress({ totalWins }) {
  const next = getNextMilestone(totalWins);
  const prev = getPrevMilestone(totalWins);
  const prevWins = prev?.wins || 0;
  const pct = Math.min(((totalWins - prevWins) / (next.wins - prevWins)) * 100, 100);

  return (
    <div style={{ ...CARD }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
      <div style={LABEL}>🌳 HEALING TREE</div>

      {/* Milestone row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{totalWins}</div>
          <div style={{ fontSize: 11, color: '#8A84B6' }}>Total Wins</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 2 }}>{next.icon}</div>
          <div style={{ fontSize: 11, color: next.color, fontWeight: 600 }}>{next.label}</div>
          <div style={{ fontSize: 10, color: '#8A84B6' }}>{next.wins - totalWins} more</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          style={{
            height: '100%', borderRadius: 6,
            background: 'linear-gradient(90deg, #7C3AED, #A855F7)',
            boxShadow: '0 0 8px rgba(139,92,246,0.5)',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 10, color: '#8A84B6' }}>{prevWins} wins</span>
        <span style={{ fontSize: 10, color: '#8A84B6' }}>{next.wins} wins</span>
      </div>

      {/* Milestone badges */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        {MILESTONES.map(m => {
          const reached = totalWins >= m.wins;
          return (
            <div key={m.wins} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: reached ? `${m.color}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${reached ? m.color + '40' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 20, padding: '4px 10px',
              opacity: reached ? 1 : 0.5,
            }}>
              <span style={{ fontSize: 13 }}>{m.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: reached ? m.color : '#8A84B6' }}>{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WEEKLY STATS BAR
───────────────────────────────────────────────────────────────────────────── */
function WeeklyStats({ getWeeklyStats }) {
  const stats = getWeeklyStats();
  const { total = 0, daily = [], mostCompleted, leastCompleted } = stats;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const barMax = Math.max(...daily.map(d => d.count || 0), 1);

  return (
    <div style={{ ...CARD }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={LABEL}>📊 THIS WEEK</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{total} <span style={{ fontSize: 11, fontWeight: 400, color: '#8A84B6' }}>wins</span></div>
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 52, marginBottom: 8 }}>
        {days.map((day, i) => {
          const count = daily[i]?.count || 0;
          const h = Math.max(6, Math.round((count / barMax) * 44));
          return (
            <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: '100%', height: h, borderRadius: 4,
                background: count > 0
                  ? 'linear-gradient(180deg,#A855F7,#7C3AED)'
                  : 'rgba(255,255,255,0.07)',
                transition: 'height 0.6s ease',
                boxShadow: count > 0 ? '0 0 6px rgba(168,85,247,0.4)' : 'none',
              }} />
              <span style={{ fontSize: 9, color: '#8A84B6' }}>{day.slice(0,1)}</span>
            </div>
          );
        })}
      </div>

      {/* Most/least */}
      {mostCompleted && (
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, padding: '8px 10px', borderRadius: 12,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <div style={{ fontSize: 9, color: '#10B981', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Most</div>
            <div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{mostCompleted}</div>
          </div>
          {leastCompleted && leastCompleted !== mostCompleted && (
            <div style={{
              flex: 1, padding: '8px 10px', borderRadius: 12,
              background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
            }}>
              <div style={{ fontSize: 9, color: '#A78BFA', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Try More</div>
              <div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{leastCompleted}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HISTORY LIST
───────────────────────────────────────────────────────────────────────────── */
function HistoryList({ history }) {
  const last10 = [...history].reverse().slice(0, 10);

  if (last10.length === 0) {
    return (
      <div style={{ ...CARD, textAlign: 'center', padding: '28px' }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>🌱</div>
        <div style={{ fontSize: 14, color: '#8A84B6' }}>Your history will appear here as you complete Tiny Wins.</div>
      </div>
    );
  }

  return (
    <div style={{ ...CARD }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
      <div style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <Calendar size={12} /> RECENT HISTORY
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {last10.map((entry, i) => {
          const meta = CATEGORY_META[entry.category] || {};
          const date = new Date(entry.completedAt);
          const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: meta.bg || 'rgba(139,92,246,0.15)',
                border: `1px solid ${meta.color ? meta.color + '35' : 'rgba(139,92,246,0.25)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15,
              }}>
                {meta.icon || '✨'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.title}
                </div>
                <div style={{ fontSize: 11, color: '#8A84B6' }}>{entry.category}</div>
              </div>

              <div style={{ fontSize: 11, color: '#8A84B6', flexShrink: 0 }}>{label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WORK MODE SELECTOR
───────────────────────────────────────────────────────────────────────────── */
const MODE_META = {
  office:  { icon: '🏢', label: 'Office'  },
  remote:  { icon: '🏠', label: 'Remote'  },
  student: { icon: '📚', label: 'Student' },
  travel:  { icon: '✈️', label: 'Travel'  },
  weekend: { icon: '🌿', label: 'Weekend' },
  retired: { icon: '☀️', label: 'Retired' },
  custom:  { icon: '✨', label: 'Custom'  },
};

function WorkModeSelector({ current, onChange }) {
  const [open, setOpen] = useState(false);
  const meta = MODE_META[current] || MODE_META.office;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(139,92,246,0.15)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 20, padding: '5px 12px',
          color: '#C4B5FD', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <span>{meta.icon}</span>
        <span>{meta.label}</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute', top: '110%', left: 0, zIndex: 100,
              background: 'rgba(20,10,50,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 16,
              padding: '8px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              minWidth: 140,
            }}
          >
            {WORK_MODES.map(mode => {
              const m = MODE_META[mode] || {};
              return (
                <button
                  key={mode}
                  onClick={() => { onChange(mode); setOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 10,
                    background: mode === current ? 'rgba(139,92,246,0.2)' : 'transparent',
                    border: 'none', color: mode === current ? '#C4B5FD' : '#B8B4D8',
                    fontSize: 12, fontWeight: mode === current ? 600 : 400,
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  }}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
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
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      style={{
        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(34,18,73,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: 20, padding: '14px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 0 40px rgba(124,58,237,0.35), 0 16px 40px rgba(0,0,0,0.4)',
        maxWidth: 360, minWidth: 260,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.1 }}
        style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, boxShadow: '0 0 12px rgba(124,58,237,0.5)',
        }}
      >💜</motion.div>
      <p style={{ margin: 0, fontSize: 13, color: '#E2DEFF', lineHeight: 1.5, fontStyle: 'italic' }}>
        {text}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MILESTONE TOAST
───────────────────────────────────────────────────────────────────────────── */
function MilestoneToast({ data, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      style={{
        position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10000,
        background: 'linear-gradient(135deg, rgba(26,10,62,0.97), rgba(45,18,96,0.95))',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(168,85,247,0.4)',
        borderRadius: 24, padding: '20px 28px',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(124,58,237,0.4), 0 24px 60px rgba(0,0,0,0.5)',
        minWidth: 240,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: 2, duration: 0.5 }}
        style={{ fontSize: 44, marginBottom: 10 }}
      >
        {data.icon}
      </motion.div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Milestone Unlocked!</div>
      <div style={{ fontSize: 14, color: '#C4B5FD' }}>{data.label}</div>
      <div style={{ fontSize: 12, color: '#8A84B6', marginTop: 4 }}>{data.total} wins total</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function TinyWins() {
  const navigate = useNavigate();
  const { todayEntry } = useWeatherStore();

  const {
    dailyWins, completedToday, skippedToday,
    completionHistory, favorites, totalWins, workMode,
    checkAndRefresh, completeWin, skipWin, toggleFavorite,
    setWorkMode, showReflection, reflectionText, dismissReflection,
    showMilestone, milestoneData, dismissMilestone, getWeeklyStats,
  } = useTinyWinsStore();

  const [activeTab, setActiveTab] = useState('today');

  // Initialize
  useEffect(() => {
    const weatherId = todayEntry?.weather || 'clear-sky';
    checkAndRefresh(weatherId);
  }, [todayEntry?.weather]);

  const handleWorkModeChange = useCallback((mode) => {
    setWorkMode(mode);
  }, [setWorkMode]);

  const completedCount = completedToday.length;
  const allDone = completedCount >= 3 && dailyWins.length > 0;

  const favoriteChallenges = dailyWins.filter(w => favorites.includes(w.id));

  return (
    <>
      <style>{`
        @keyframes particleDrift2 {
          0%,100% { transform: translate(0,0); opacity: 0.15; }
          50%      { transform: translate(5px,-8px); opacity: 0.28; }
        }
        .tw-tab {
          padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600;
          cursor: pointer; border: none; font-family: inherit;
          transition: all 0.2s ease;
        }
        .tw-tab.active {
          background: linear-gradient(135deg, rgba(124,58,237,0.7), rgba(168,85,247,0.5));
          color: #fff;
          box-shadow: 0 0 16px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(168,85,247,0.3);
        }
        .tw-tab.inactive {
          background: rgba(255,255,255,0.05);
          color: rgba(184,180,216,0.7);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .tw-tab.inactive:hover { background: rgba(255,255,255,0.08); color: #E2DEFF; }
      `}</style>

      {/* Toasts */}
      <AnimatePresence>
        {showReflection && (
          <ReflectionToast key="reflection" text={reflectionText} onDismiss={dismissReflection} />
        )}
        {showMilestone && milestoneData && (
          <MilestoneToast key="milestone" data={milestoneData} onDismiss={dismissMilestone} />
        )}
      </AnimatePresence>

      <div style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 60% 50% at 15% 0%, rgba(124,58,237,0.13) 0%, transparent 55%),
          radial-gradient(ellipse 40% 60% at 85% 100%, rgba(168,85,247,0.08) 0%, transparent 55%),
          transparent
        `,
        fontFamily: "'Inter', sans-serif",
        padding: '0 0 40px',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          padding: '24px 24px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/home')}
              style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={18} color="#B8B4D8" />
            </button>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                Tiny Wins
              </h1>
              <p style={{ fontSize: 12, color: '#8A84B6', margin: 0 }}>Small steps. Big change.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <WorkModeSelector current={workMode} onChange={handleWorkModeChange} />
            <button style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Settings size={16} color="#B8B4D8" />
            </button>
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div style={{ padding: '18px 24px 0' }}>
          <div style={{ ...CARD, padding: '16px 20px', marginBottom: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                Today's Progress
              </span>
              <span style={{ fontSize: 12, color: '#8A84B6' }}>
                {completedCount} / {dailyWins.length || 3} completed
              </span>
            </div>
            {/* Bar */}
            <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dailyWins.length > 0 ? (completedCount / dailyWins.length) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                style={{
                  height: '100%', borderRadius: 6,
                  background: allDone
                    ? 'linear-gradient(90deg,#10B981,#34D399)'
                    : 'linear-gradient(90deg,#7C3AED,#A855F7)',
                  boxShadow: allDone
                    ? '0 0 8px rgba(16,185,129,0.5)'
                    : '0 0 8px rgba(139,92,246,0.5)',
                }}
              />
            </div>
            {allDone && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ margin: '8px 0 0', fontSize: 12, color: '#10B981', fontWeight: 600 }}
              >
                💜 All done for today. You showed up for yourself.
              </motion.p>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ padding: '18px 24px 14px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['today', 'history', 'stats', 'tree'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tw-tab ${activeTab === tab ? 'active' : 'inactive'}`}
            >
              {tab === 'today'   ? '🌿 Today'    :
               tab === 'history' ? '📅 History'  :
               tab === 'stats'   ? '📊 Stats'    :
                                   '🌳 Tree'    }
            </button>
          ))}
        </div>

        <div style={{ padding: '0 24px' }}>
          <AnimatePresence mode="wait">

            {/* ── TODAY'S WINS ── */}
            {activeTab === 'today' && (
              <motion.div
                key="today"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {dailyWins.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {dailyWins.map((win, i) => (
                      <TinyWinCard
                        key={win.id}
                        challenge={win}
                        index={i}
                        isCompleted={completedToday.includes(win.id)}
                        isSkipped={skippedToday.includes(win.id)}
                        isFavorite={favorites.includes(win.id)}
                        onComplete={completeWin}
                        onSkip={skipWin}
                        onFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ ...CARD, textAlign: 'center', padding: '36px 24px' }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🌱</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                      Your Tiny Wins are being prepared
                    </div>
                    <p style={{ fontSize: 13, color: '#8A84B6', margin: 0 }}>
                      Complete a Soul Climate check-in on the Home page to personalize your wins.
                    </p>
                  </div>
                )}

                {/* Favorites */}
                {favoriteChallenges.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Star size={11} /> SAVED
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {favoriteChallenges.map((win, i) => (
                        <TinyWinCard
                          key={win.id}
                          challenge={win}
                          index={i}
                          isCompleted={completedToday.includes(win.id)}
                          isSkipped={skippedToday.includes(win.id)}
                          isFavorite
                          onComplete={completeWin}
                          onSkip={skipWin}
                          onFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── HISTORY ── */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <HistoryList history={completionHistory} />
              </motion.div>
            )}

            {/* ── STATS ── */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <WeeklyStats getWeeklyStats={getWeeklyStats} />

                {/* Lifetime stats */}
                <div style={{ ...CARD }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
                  <div style={LABEL}>🏆 LIFETIME</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Total Wins', value: totalWins, icon: '✨' },
                      { label: 'Days Active', value: new Set(completionHistory.map(h => h.date)).size, icon: '📅' },
                      { label: 'Categories', value: new Set(completionHistory.map(h => h.category)).size, icon: '🗂' },
                      { label: 'Favorites', value: favorites.length, icon: '🔖' },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        padding: '12px 14px', borderRadius: 16,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stat.value}</div>
                        <div style={{ fontSize: 11, color: '#8A84B6', marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── HEALING TREE ── */}
            {activeTab === 'tree' && (
              <motion.div
                key="tree"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <HealingTreeProgress totalWins={totalWins} />

                {/* Tips */}
                <div style={{ ...CARD }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
                  <div style={LABEL}>💜 ABOUT YOUR TREE</div>
                  <p style={{ fontSize: 13, color: '#B8B4D8', lineHeight: 1.7, margin: 0 }}>
                    Your Healing Tree grows with every Tiny Win you complete. Progress never resets — because healing is cumulative. Each small action you take becomes a permanent part of your tree, your story, and your growth.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
