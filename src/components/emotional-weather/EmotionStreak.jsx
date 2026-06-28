import React from 'react';
import { motion } from 'motion/react';

function getStreakMessage(streak) {
  if (streak === 0) return "Start your first check-in today. Every journey begins with one step. 🌱";
  if (streak === 1) return "You've taken the first step. The seed is planted. 🌱";
  if (streak < 5) return "You're building a sacred habit. Keep showing up for yourself. ✨";
  if (streak < 10) return "Wow! Your consistency is creating real inner change. 🌸";
  if (streak < 20) return "You're on fire! This level of self-awareness is rare and beautiful. 🔥";
  if (streak < 30) return "Almost a full moon cycle of check-ins! You're transforming. 🌕";
  return "30-day master! You've earned the Golden Lotus. True dedication. 🪷";
}

function LotusPetal({ active, index }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.06 }}
      style={{
        width: 32,
        height: 36,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      {/* Petal SVG shape */}
      <svg viewBox="0 0 32 36" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <ellipse
          cx="16" cy="22" rx="10" ry="14"
          fill={active ? 'rgba(245,184,65,0.2)' : 'rgba(255,255,255,0.04)'}
          stroke={active ? '#F59E0B' : 'rgba(255,255,255,0.1)'}
          strokeWidth="1.5"
        />
        <ellipse
          cx="16" cy="22" rx="10" ry="14"
          fill={active ? 'rgba(245,184,65,0.15)' : 'transparent'}
          transform="rotate(45, 16, 22)"
          stroke={active ? 'rgba(245,184,65,0.4)' : 'rgba(255,255,255,0.06)'}
          strokeWidth="1"
        />
      </svg>
      {/* Center glow on active */}
      {active && (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: index * 0.1 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#F59E0B',
            boxShadow: '0 0 8px #F59E0B, 0 0 16px rgba(245,184,65,0.5)',
            position: 'relative',
            zIndex: 1,
          }}
        />
      )}
    </motion.div>
  );
}

export default function EmotionStreak({ streak, weeklyData }) {
  const safeStreak = streak || 0;
  const showGoldenLotus = safeStreak >= 30;

  // Last 7 days check-in status from weeklyData
  const last7 = (weeklyData || []).map(d => !!d.weather);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        borderRadius: 20,
        padding: '24px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow for high streaks */}
      {safeStreak >= 7 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,184,65,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
          Daily Check-in Streak
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          Your commitment to self-awareness
        </div>
      </div>

      {/* Streak count */}
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 20,
        }}
      >
        <motion.div
          animate={safeStreak > 0 ? { rotate: [-5, 5, -5] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ fontSize: 40, userSelect: 'none' }}
          aria-hidden="true"
        >
          🔥
        </motion.div>
        <div>
          <div style={{
            fontSize: 48,
            fontWeight: 900,
            color: safeStreak === 0 ? 'rgba(255,255,255,0.2)' : '#F59E0B',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: safeStreak > 0 ? '0 0 24px rgba(245,184,65,0.5)' : 'none',
          }}>
            {safeStreak}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            {safeStreak === 1 ? 'Day' : 'Days'} in a row
          </div>
        </div>
      </motion.div>

      {/* 7 Lotus Petals (last 7 days) */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Last 7 days
        </div>
        <div style={{
          display: 'flex',
          gap: 6,
          alignItems: 'center',
        }}
          aria-label={`${last7.filter(Boolean).length} of last 7 days checked in`}
          role="img"
        >
          {Array.from({ length: 7 }, (_, i) => (
            <LotusPetal key={i} active={last7[i] || false} index={i} />
          ))}
        </div>
        {/* Day labels */}
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          {(weeklyData || []).map((d, i) => (
            <div key={i} style={{
              width: 32,
              textAlign: 'center',
              fontSize: 10,
              color: 'rgba(255,255,255,0.25)',
            }}>
              {d.day || ['S','M','T','W','T','F','S'][i]}
            </div>
          ))}
        </div>
      </div>

      {/* Golden Lotus achievement */}
      {showGoldenLotus && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(245,184,65,0.15), rgba(245,184,65,0.05))',
            border: '1px solid rgba(245,184,65,0.35)',
            marginBottom: 14,
            boxShadow: '0 0 20px rgba(245,184,65,0.15)',
          }}
        >
          <span style={{ fontSize: 28 }} aria-hidden="true">🪷</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F59E0B' }}>Golden Lotus</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>30-day achievement unlocked</div>
          </div>
        </motion.div>
      )}

      {/* Motivational message */}
      <p style={{
        margin: 0,
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 1.55,
        fontStyle: 'italic',
      }}>
        {getStreakMessage(safeStreak)}
      </p>
    </motion.div>
  );
}
