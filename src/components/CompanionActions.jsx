import React from 'react';
import { motion } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   CompanionActions — Primary + Secondary CTA buttons
   Props:
     onReflection  — () => void
     onCheckIn     — () => void
     reflectionLabel (optional, default "Today's Reflection")
     checkInLabel    (optional, default "Mind Check-In")
───────────────────────────────────────────────────────── */
export default function CompanionActions({
  onReflection,
  onCheckIn,
  reflectionLabel = "Today's Reflection",
  checkInLabel    = 'Mind Check-In',
}) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {/* Primary */}
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: '0 6px 28px rgba(124,58,237,0.55)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onReflection}
        style={{
          flex: 1, minWidth: 130,
          padding: '11px 18px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          border: 'none',
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'box-shadow 0.2s ease',
          letterSpacing: '-0.01em',
        }}
      >
        ✨ {reflectionLabel}
      </motion.button>

      {/* Secondary */}
      <motion.button
        whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.14)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onCheckIn}
        style={{
          flex: 1, minWidth: 120,
          padding: '11px 18px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          color: '#E2DEFF',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'background 0.2s ease',
          letterSpacing: '-0.01em',
        }}
      >
        💜 {checkInLabel}
      </motion.button>
    </div>
  );
}
