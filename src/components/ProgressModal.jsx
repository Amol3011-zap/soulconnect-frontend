import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   ProgressModal — "View Progress" / "See My Progress"
   Props:
     isOpen      — bool
     onClose     — () => void
     streak      — number (check-in streak days)
     totalWins   — number (lifetime tiny wins)
     winsToday   — number
     storiesCount — number
     daysActive  — number
     currentWeather — string | null
───────────────────────────────────────────────────────── */
const WEATHER_LABEL = {
  'clear-sky':  '☀️ Clear',
  'hope':       '🌤 Hopeful',
  'blooming':   '🌸 Blooming',
  'fog':        '🌫 Foggy',
  'heavy-rain': '🌧 Heavy',
  'storm':      '⚡ Storm',
};

function StatRow({ icon, label, value, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 14px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
        <span style={{ fontSize: 13, color: 'rgba(196,181,253,0.8)', fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{
        fontSize: 15, fontWeight: 800,
        color: accent || '#fff',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </span>
    </div>
  );
}

export default function ProgressModal({
  isOpen,
  onClose,
  streak       = 0,
  totalWins    = 0,
  winsToday    = 0,
  storiesCount = 0,
  daysActive   = 1,
  currentWeather = null,
}) {
  // Close on Escape
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

  const weatherLabel = currentWeather ? (WEATHER_LABEL[currentWeather] || '—') : '—';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="prog-backdrop"
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
            key="prog-modal"
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
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                📊 Your Progress
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                How You're Doing
              </h2>
              <p style={{ fontSize: 12, color: 'rgba(139,116,230,0.6)', margin: '5px 0 0', fontStyle: 'italic' }}>
                Every number here represents a choice you made for yourself.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <StatRow icon="🔥" label="Check-in Streak"      value={`${streak} day${streak !== 1 ? 's' : ''}`}  accent="#F59E0B" />
              <StatRow icon="🌿" label="Tiny Wins Completed"  value={totalWins}           accent="#10B981" />
              <StatRow icon="✨" label="Wins Today"           value={winsToday}            accent="#A78BFA" />
              <StatRow icon="📖" label="Community Posts"      value={storiesCount}         accent="#93C5FD" />
              <StatRow icon="📅" label="Days Active"          value={daysActive}           accent="#F4C542" />
              <StatRow icon="🌤" label="Today's Weather"      value={weatherLabel}         accent="#C4B5FD" />
            </div>

            {/* Encouragement */}
            <div style={{
              padding: '12px 14px',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: 16, borderLeft: '3px solid #A855F7',
            }}>
              <p style={{ fontSize: 13, color: 'rgba(196,181,253,0.85)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                {streak >= 7
                  ? '🌟 A whole week of showing up. That\'s rare and beautiful.'
                  : streak >= 3
                    ? '💜 You\'re building something real. Keep going.'
                    : '🌱 Every great habit starts exactly where you are right now.'
                }
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
