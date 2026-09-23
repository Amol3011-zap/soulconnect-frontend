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
        background: 'rgba(34,18,73,0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: 20,
        padding: '14px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 0 40px rgba(124,58,237,0.35), 0 16px 40px rgba(0,0,0,0.4)',
        maxWidth: 360, minWidth: 260,
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        boxShadow: '0 0 12px rgba(124,58,237,0.5)',
      }}>
        💜
      </div>
      <p style={{
        margin: 0, fontSize: 13, color: '#E2DEFF',
        lineHeight: 1.5, fontStyle: 'italic', fontWeight: 400,
      }}>
        {text}
      </p>
    </motion.div>
  );
}
