import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   FloatingCompanion — Bottom-right floating assistant button
   Props:
     onReflection     — () => void
     onBreathing      — () => void
     onEmotionalWeather — () => void
     onSupport        — () => void
───────────────────────────────────────────────────────── */
const MENU_ITEMS = [
  { id: 'reflection',      icon: '✨', label: "Today's Reflection",  color: '#A78BFA' },
  { id: 'breathing',       icon: '🌬', label: 'Breathing Exercise',   color: '#6EE7B7' },
  { id: 'weather',         icon: '🌤', label: 'Emotional Weather',    color: '#93C5FD' },
  { id: 'support',         icon: '💜', label: 'Need Support',         color: '#F9A8D4' },
];

export default function FloatingCompanion({
  onReflection,
  onBreathing,
  onEmotionalWeather,
  onSupport,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handlers = {
    reflection: onReflection,
    breathing:  onBreathing,
    weather:    onEmotionalWeather,
    support:    onSupport,
  };

  function handleItem(id) {
    setOpen(false);
    handlers[id]?.();
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }}
    >
      {/* Popup menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{  opacity: 0, y: 12, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            style={{
              background: 'rgba(18,10,44,0.92)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(168,85,247,0.28)',
              borderRadius: 22,
              padding: '14px 14px',
              boxShadow: '0 16px 56px rgba(0,0,0,0.55), 0 0 40px rgba(124,58,237,0.25)',
              minWidth: 230,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
              background: 'linear-gradient(90deg, #7C3AED, #A855F7, #F4C542, transparent)',
              borderRadius: '22px 22px 0 0',
            }} />

            {/* Title */}
            <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, paddingLeft: 2 }}>
              How can I help?
            </div>

            {MENU_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
                whileHover={{ background: 'rgba(139,92,246,0.2)', x: 3 }}
                onClick={() => handleItem(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background 0.18s ease, transform 0.18s ease',
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#E2DEFF' }}>
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <div style={{ position: 'relative' }}>
        {/* Pulsing glow ring */}
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            border: '1.5px solid rgba(168,85,247,0.5)',
            pointerEvents: 'none',
          }}
        />

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: '0 8px 40px rgba(124,58,237,0.65)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(v => !v)}
          style={{
            width: 62, height: 62,
            borderRadius: '50%',
            background: open
              ? 'linear-gradient(135deg, #A855F7, #7C3AED)'
              : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            border: '1.5px solid rgba(168,85,247,0.45)',
            boxShadow: '0 6px 32px rgba(124,58,237,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.25s ease, box-shadow 0.25s ease',
            position: 'relative',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ fontSize: 26, lineHeight: 1, display: 'block' }}
          >
            {open ? '✕' : '🤖'}
          </motion.span>
        </motion.button>
      </div>

      {/* Label (shown when closed) */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            style={{
              fontSize: 10, fontWeight: 700, color: 'rgba(196,181,253,0.7)',
              textAlign: 'center', letterSpacing: '0.03em',
              textShadow: '0 1px 6px rgba(0,0,0,0.6)',
            }}
          >
            Need Support?
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
