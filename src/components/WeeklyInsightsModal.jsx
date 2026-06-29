import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   WeeklyInsightsModal — "Weekly Insights" button
   Props:
     isOpen        — bool
     onClose       — () => void
     weeklyStats   — { total, daily, byCategory } from getWeeklyStats()
     checkInsThisWeek — number
     storiesThisWeek  — number
───────────────────────────────────────────────────────── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOTIVATIONAL = [
  'Small steps compounding into big change.',
  'Consistency is the quiet superpower.',
  'Progress isn\'t perfection — it\'s showing up.',
  'Every check-in is an act of self-respect.',
  'You are building a better version of yourself, one day at a time.',
];

function MiniBarChart({ daily = [] }) {
  const max = Math.max(...daily.map(d => d.count || 0), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 48 }}>
      {DAYS.map((day, i) => {
        const count = daily[i]?.count || 0;
        const h = Math.max(4, Math.round((count / max) * 40));
        return (
          <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: '100%', height: h, borderRadius: 4,
              background: count > 0
                ? 'linear-gradient(180deg, #A855F7, #7C3AED)'
                : 'rgba(255,255,255,0.07)',
              boxShadow: count > 0 ? '0 0 6px rgba(168,85,247,0.4)' : 'none',
            }} />
            <span style={{ fontSize: 9, color: '#8A84B6' }}>{day[0]}</span>
          </div>
        );
      })}
    </div>
  );
}

function InsightRow({ icon, label, value, accent = '#fff' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontSize: 17 }}>{icon}</span>
        <span style={{ fontSize: 13, color: 'rgba(196,181,253,0.8)', fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 15, fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>{value}</span>
    </div>
  );
}

export default function WeeklyInsightsModal({
  isOpen,
  onClose,
  weeklyStats      = {},
  checkInsThisWeek = 0,
  storiesThisWeek  = 0,
}) {
  const { total = 0, daily = [] } = weeklyStats;
  const quote = MOTIVATIONAL[new Date().getDay() % MOTIVATIONAL.length];

  React.useEffect(() => {
    if (!isOpen) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="wi-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 1200,
              background: 'rgba(4,2,20,0.72)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Modal */}
          <motion.div
            key="wi-modal"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92,  y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1201,
              width: '92%', maxWidth: 420,
              maxHeight: '88vh', overflowY: 'auto',
              scrollbarWidth: 'none',
              background: 'linear-gradient(145deg, rgba(22,10,54,0.98) 0%, rgba(40,18,88,0.96) 100%)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(168,85,247,0.25)',
              borderRadius: 28,
              padding: '28px 24px 24px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.65), 0 0 60px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
          >
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, #7C3AED, #A855F7, #F4C542, transparent)',
              borderRadius: '28px 28px 0 0',
            }} />

            {/* Close */}
            <motion.button
              whileHover={{ background: 'rgba(255,255,255,0.14)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              style={{
                position: 'absolute', top: 18, right: 18,
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(196,181,253,0.7)',
                fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >✕</motion.button>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                📈 This Week
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                Weekly Insights
              </h2>
            </div>

            {/* Bar chart */}
            <div style={{
              padding: '14px', borderRadius: 18,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              marginBottom: 14,
            }}>
              <div style={{ fontSize: 11, color: '#8A84B6', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Daily Tiny Wins
              </div>
              <MiniBarChart daily={daily} />
            </div>

            {/* Stats rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <InsightRow icon="📅" label="Check-ins"           value={checkInsThisWeek} accent="#F59E0B" />
              <InsightRow icon="🌿" label="Tiny Wins"           value={total}            accent="#10B981" />
              <InsightRow icon="💬" label="Community Activity"  value={storiesThisWeek}  accent="#93C5FD" />
            </div>

            {/* Motivational quote */}
            <div style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(168,85,247,0.08))',
              border: '1px solid rgba(168,85,247,0.22)',
              borderRadius: 16,
              borderLeft: '3px solid #A855F7',
            }}>
              <p style={{ fontSize: 13, color: '#E2DEFF', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
                💜 "{quote}"
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
