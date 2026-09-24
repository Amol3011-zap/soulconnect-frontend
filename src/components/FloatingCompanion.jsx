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
  { id: 'reflection',      icon: '✨', label: "Today's Reflection",  color: '#5E47B8' },
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
              background: '#16093A',
              border: '1px solid var(--sc-line)',
              borderRadius: 22,
              padding: '14px 14px',
              boxShadow: '0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04)',
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
              background: '#8066D5',
              borderRadius: '22px 22px 0 0',
            }} />

            {/* Title */}
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sc-gold-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, paddingLeft: 2 }}>
              How can I help?
            </div>

            {MENU_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
                whileHover={{ background: 'var(--sc-tint)', x: 3 }}
                onClick={() => handleItem(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  borderRadius: 14,
                  background: 'var(--sc-bg)',
                  border: '1px solid var(--sc-border)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
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
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--sc-text)' }}>
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <div style={{ position: 'relative', willChange: 'transform' }}>
        {/* Static glow ring — no infinite animation to avoid constant repaints */}
        <div
          style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            border: '1.5px solid var(--sc-line)',
            pointerEvents: 'none',
          }}
        />

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: 'none' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(v => !v)}
          style={{
            width: 62, height: 62,
            borderRadius: '50%',
            background: open
              ? 'linear-gradient(135deg, #A855F7, #7C3AED)'
              : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            border: '1.5px solid var(--sc-line)',
            boxShadow: 'none',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.25s ease, box-shadow 0.25s ease',
            position: 'relative',
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
              fontSize: 10, fontWeight: 700, color: 'var(--sc-text-2)',
              textAlign: 'center', letterSpacing: '0.03em',
              textShadow: 'none',
            }}
          >
            Need Support?
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
