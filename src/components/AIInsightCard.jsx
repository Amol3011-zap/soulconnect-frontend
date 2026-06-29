import React from 'react';
import { motion } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   AIInsightCard — Sidebar companion insight card
   Props:
     insight      — string (the insight sentence)
     suggestion   — string (the follow-up question)
     onAction     — () => void  (primary button click)
     actionLabel  — string (default "Start Breathing")
     isActioned   — bool (show completed state)
───────────────────────────────────────────────────────── */
export default function AIInsightCard({
  insight     = "You've been feeling overwhelmed lately.",
  suggestion  = 'Would you like to try a 2-minute breathing exercise?',
  onAction,
  actionLabel = 'Start Breathing',
  isActioned  = false,
}) {
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

      {/* Background glow blob */}
      <div style={{
        position: 'absolute', top: -30, right: -20,
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 65%)',
        filter: 'blur(16px)', pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, zIndex: 1, position: 'relative',
      }}>
        {/* Icon orb */}
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

      {/* Insight text */}
      <p style={{
        fontSize: 14, fontWeight: 600, color: '#E2DEFF',
        margin: '0 0 6px', lineHeight: 1.5, position: 'relative', zIndex: 1,
      }}>
        {insight}
      </p>

      {/* Suggestion */}
      <p style={{
        fontSize: 12, color: 'rgba(184,180,216,0.7)',
        margin: '0 0 14px', lineHeight: 1.6, position: 'relative', zIndex: 1,
      }}>
        {suggestion}
      </p>

      {/* Action button */}
      {isActioned ? (
        <motion.div
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          style={{
            width: '100%', padding: '10px', borderRadius: 13, textAlign: 'center',
            background: 'rgba(16,185,129,0.14)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#6EE7B7', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            position: 'relative', zIndex: 1,
          }}
        >
          ✓ Completed
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(124,58,237,0.5)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
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
          }}
        >
          🌬 {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
