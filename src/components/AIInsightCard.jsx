import React from 'react';
import { motion } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   AIInsightCard — Sidebar companion insight card
   Provides personalised progress, encouragement and guidance.
   Never duplicates Today's Focus / breathing exercises.

   Props:
     streak        — number (check-in streak days)
     winsToday     — number (tiny wins completed today)
     weeklyTotal   — number (wins this week)
     hasCheckedIn  — bool
     onViewProgress   — () => void
     onReflection     — () => void
     onWeeklyInsights — () => void
     onContinueJourney — () => void
───────────────────────────────────────────────────────── */

function pickInsight({ streak, winsToday, weeklyTotal, hasCheckedIn }) {
  if (streak >= 3) {
    return {
      state: 1,
      message: `You've checked in ${streak} day${streak !== 1 ? 's' : ''} in a row.\nConsistency is becoming a healthy habit.`,
      buttonLabel: 'View Progress',
      buttonKey: 'progress',
    };
  }
  if (winsToday >= 1) {
    return {
      state: 2,
      message: `Yesterday you completed ${winsToday} Tiny Win${winsToday !== 1 ? 's' : ''}.\nYou're making steady progress.`,
      buttonLabel: "Today's Reflection",
      buttonKey: 'reflection',
    };
  }
  if (weeklyTotal >= 3) {
    return {
      state: 3,
      message: 'Your emotional weather has improved this week.\n\nKeep taking one small step every day.',
      buttonLabel: 'Weekly Insights',
      buttonKey: 'weekly',
    };
  }
  if (hasCheckedIn) {
    return {
      state: 4,
      message: 'Welcome back.\n\nEvery time you return, you\'re investing in yourself.',
      buttonLabel: 'Continue Journey',
      buttonKey: 'journey',
    };
  }
  return {
    state: 5,
    message: 'You\'re showing up for yourself consistently.\n\nProgress isn\'t perfection.\nIt\'s consistency.',
    buttonLabel: 'See My Progress',
    buttonKey: 'progress',
  };
}

export default function AIInsightCard({
  streak           = 0,
  winsToday        = 0,
  weeklyTotal      = 0,
  hasCheckedIn     = false,
  onViewProgress,
  onReflection,
  onWeeklyInsights,
  onContinueJourney,
}) {
  const insight = pickInsight({ streak, winsToday, weeklyTotal, hasCheckedIn });

  function handleButton() {
    switch (insight.buttonKey) {
      case 'progress':  return onViewProgress?.();
      case 'reflection': return onReflection?.();
      case 'weekly':    return onWeeklyInsights?.();
      case 'journey':   return onContinueJourney?.();
    }
  }

  // Format message — newlines → line breaks
  const lines = insight.message.split('\n');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="sidebar-card-inner"
      style={{
        background: 'linear-gradient(145deg, rgba(34,18,73,0.88) 0%, rgba(52,22,100,0.82) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(168,85,247,0.18)',
        borderRadius: 24,
        padding: '18px 18px',
        marginBottom: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent gradient bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #7C3AED, #A855F7, #F4C542, transparent)',
        borderRadius: '24px 24px 0 0',
      }} />

      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -30, right: -20,
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 65%)',
        filter: 'blur(16px)', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative', zIndex: 1,
      }}>
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 0 16px rgba(124,58,237,0.5)',
          }}
        >
          🤖
        </motion.div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            COMPANION INSIGHT
          </div>
          <div style={{ fontSize: 10, color: 'rgba(139,116,230,0.6)', marginTop: 1 }}>
            Personalized for you
          </div>
        </div>
      </div>

      {/* Message */}
      <div style={{ marginBottom: 14, position: 'relative', zIndex: 1 }}>
        {lines.map((line, i) => (
          line === ''
            ? <div key={i} style={{ height: 6 }} />
            : <p key={i} style={{
                fontSize: i === 0 ? 14 : 12.5,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? '#E2DEFF' : 'rgba(184,180,216,0.7)',
                margin: 0,
                lineHeight: 1.55,
                marginBottom: lines[i + 1] !== undefined && lines[i + 1] !== '' ? 4 : 0,
              }}>
                {line}
              </p>
        ))}
      </div>

      {/* Action button */}
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(124,58,237,0.5)' }}
        whileTap={{ scale: 0.97 }}
        onClick={handleButton}
        style={{
          width: '100%', padding: '10px', borderRadius: 13,
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          border: 'none',
          color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          transition: 'box-shadow 0.2s ease',
          position: 'relative', zIndex: 1,
          letterSpacing: '-0.01em',
        }}
      >
        {insight.buttonLabel}
      </motion.button>
    </motion.div>
  );
}
