import React from 'react';
import { motion } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   ReflectionActions — Save + Cancel buttons
   Props:
     onSave     — () => void
     onCancel   — () => void
     isSaving   — bool
     isUpdate   — bool (changes label to "Update Reflection")
     disabled   — bool
───────────────────────────────────────────────────────── */
export default function ReflectionActions({
  onSave,
  onCancel,
  isSaving  = false,
  isUpdate  = false,
  disabled  = false,
}) {
  const saveLabel = isSaving
    ? 'Saving...'
    : isUpdate
      ? 'Update Reflection'
      : '💜 Save Reflection';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.22 }}
      style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
    >
      {/* Primary — Save / Update */}
      <motion.button
        whileHover={!isSaving && !disabled ? { scale: 1.03, boxShadow: '0 6px 28px rgba(124,58,237,0.55)' } : {}}
        whileTap={!isSaving && !disabled ? { scale: 0.97 } : {}}
        onClick={onSave}
        disabled={isSaving || disabled}
        style={{
          flex: 1, minWidth: 160,
          padding: '12px 20px',
          borderRadius: 14,
          background: isSaving
            ? 'linear-gradient(135deg, #5B21B6, #7C3AED)'
            : 'linear-gradient(135deg, #7C3AED, #A855F7)',
          border: 'none',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          cursor: isSaving || disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease',
          opacity: disabled ? 0.55 : 1,
          letterSpacing: '-0.01em',
        }}
      >
        {isSaving ? (
          <>
            <LoadingSpinner />
            Saving…
          </>
        ) : (
          saveLabel
        )}
      </motion.button>

      {/* Secondary — Cancel */}
      <motion.button
        whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.12)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onCancel}
        disabled={isSaving}
        style={{
          flex: '0 0 auto',
          padding: '12px 22px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(196,181,253,0.8)',
          fontSize: 14,
          fontWeight: 600,
          cursor: isSaving ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'background 0.2s ease',
          opacity: isSaving ? 0.5 : 1,
          letterSpacing: '-0.01em',
        }}
      >
        Cancel
      </motion.button>
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 16 16"
      style={{ animation: 'reflectionSpin 0.8s linear infinite', flexShrink: 0 }}
    >
      <style>{`
        @keyframes reflectionSpin { to { transform: rotate(360deg); } }
      `}</style>
      <circle
        cx="8" cy="8" r="6"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
      />
      <path
        d="M8 2 A6 6 0 0 1 14 8"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
