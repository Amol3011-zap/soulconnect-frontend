import { useEffect } from 'react';
import { motion } from 'motion/react';

/* ─────────────────────────────────────────────────────────────────────────────
   REFLECTION TOAST — extracted verbatim from Home.jsx
───────────────────────────────────────────────────────────────────────────── */
export default function ReflectionToast({ text, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{  opacity: 0, y: 40, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      style={{
        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#FFFFFF',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        border: '1px solid #DCD2F2',
        borderRadius: 20,
        padding: '14px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04)',
        maxWidth: 360, minWidth: 260,
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: '#8066D5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        boxShadow: 'none',
      }}>
        💜
      </div>
      <p style={{
        margin: 0, fontSize: 13, color: '#171642',
        lineHeight: 1.5, fontStyle: 'italic', fontWeight: 400,
      }}>
        {text}
      </p>
    </motion.div>
  );
}
