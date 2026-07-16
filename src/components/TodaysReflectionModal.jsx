import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReflectionTextarea from './ReflectionTextarea';
import ReflectionActions from './ReflectionActions';

/* ─────────────────────────────────────────────────────────
   TodaysReflectionModal
   Props:
     isOpen         — bool
     onClose        — () => void
     onSaved        — ({ isUpdate: bool }) => void  (called after successful save)
     saveReflection — async (text: string) => { isUpdate: bool }
     initialValue   — string | null  (today's existing reflection text)
     isExisting     — bool
     userName       — string
     winsToday      — number (tiny wins completed today)
     hasCheckedIn   — bool
───────────────────────────────────────────────────────── */

const TODAY_QUESTION = "What is one thing you're grateful for today?";

// Small floating particle for the modal backdrop-area
function ModalParticles() {
  const pts = [
    { id: 0, size: 2,   left: '6%',  top: '12%', dur: 9,  d: 0,    op: 0.18, c: '#A78BFA' },
    { id: 1, size: 1.5, left: '90%', top: '8%',  dur: 12, d: 1.2,  op: 0.14, c: '#F4C542' },
    { id: 2, size: 2,   left: '15%', top: '80%', dur: 10, d: 0.6,  op: 0.16, c: '#C4B5FD' },
    { id: 3, size: 1.5, left: '82%', top: '72%', dur: 14, d: 2,    op: 0.13, c: '#A78BFA' },
    { id: 4, size: 2.5, left: '50%', top: '92%', dur: 8,  d: 0.4,  op: 0.12, c: '#F4C542' },
    { id: 5, size: 1.5, left: '72%', top: '20%', dur: 11, d: 1.8,  op: 0.15, c: '#C4B5FD' },
  ];
  return (
    <>
      {pts.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.c, opacity: p.op,
            left: p.left, top: p.top,
            animation: `reflPtDrift ${p.dur}s ease-in-out ${p.d}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
}

export default function TodaysReflectionModal({
  isOpen,
  onClose,
  onSaved,
  saveReflection,
  initialValue = null,
  isExisting   = false,
  userName     = 'Friend',
  winsToday    = 0,
  hasCheckedIn = false,
}) {
  const [text, setText]       = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync textarea with existing reflection when modal opens
  useEffect(() => {
    if (isOpen) {
      setText(initialValue?.text ?? '');
    }
  }, [isOpen, initialValue]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function handleClose() {
    if (isSaving) return;
    onClose();
  }

  const handleSave = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSaving(true);
    try {
      // Simulate async network latency (remove when wiring real API)
      await new Promise(r => setTimeout(r, 700));
      const result = await saveReflection(trimmed);
      onSaved?.(result);
      onClose();
    } catch (err) {
      console.error('Failed to save reflection:', err);
    } finally {
      setIsSaving(false);
    }
  }, [text, saveReflection, onSaved, onClose]);

  const canSave = text.trim().length > 0;

  return (
    <>
      <style>{`
        @keyframes reflPtDrift {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(5px,-8px); }
          66%      { transform: translate(-3px,5px); }
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* ── BACKDROP ── */}
            <motion.div
              key="refl-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={handleClose}
              style={{
                position: 'fixed', inset: 0, zIndex: 1100,
                background: 'rgba(4,2,20,0.72)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            />

            {/* ── MODAL ── */}
            <motion.div
              key="refl-modal"
              initial={{ opacity: 0, scale: 0.88, y: 28 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.92,  y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1101,
                width: '92%',
                maxWidth: 520,
                maxHeight: '90vh',
                overflowY: 'auto',
                scrollbarWidth: 'none',

                /* Glassmorphism */
                background: 'linear-gradient(145deg, rgba(22,10,54,0.97) 0%, rgba(40,18,88,0.96) 55%, rgba(18,8,46,0.97) 100%)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(168,85,247,0.25)',
                borderRadius: 28,
                padding: '30px 28px 26px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.65), 0 0 80px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
              }}
            >
              {/* Particles */}
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 28, pointerEvents: 'none' }}>
                <ModalParticles />
              </div>

              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, #7C3AED, #A855F7, #F4C542, transparent)',
                borderRadius: '28px 28px 0 0',
              }} />

              {/* Close button */}
              <motion.button
                whileHover={{ background: 'rgba(255,255,255,0.14)', scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                disabled={isSaving}
                style={{
                  position: 'absolute', top: 18, right: 20,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(196,181,253,0.7)',
                  fontSize: 16, cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s ease',
                  zIndex: 2, lineHeight: 1,
                }}
              >
                ✕
              </motion.button>

              {/* ── HEADER ── */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: 22, position: 'relative', zIndex: 1 }}
              >
                {/* Emoji + Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                    style={{ fontSize: 26, lineHeight: 1 }}
                  >
                    🌟
                  </motion.div>
                  <div>
                    <div style={{
                      fontSize: 11, fontWeight: 700,
                      color: '#F4C542', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2,
                    }}>
                      Soul Reflection
                    </div>
                    <h2 style={{
                      fontSize: 22, fontWeight: 800, color: '#fff',
                      margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em',
                    }}>
                      Today's Reflection
                    </h2>
                  </div>
                </div>

                {/* Personalised context */}
                <div style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(168,85,247,0.18)',
                  borderRadius: 14,
                  padding: '12px 14px',
                }}>
                  <p style={{ fontSize: 13, color: 'rgba(196,181,253,0.85)', margin: 0, lineHeight: 1.65 }}>
                    Hello, <strong style={{ color: '#fff' }}>{userName}</strong> 👋
                  </p>
                  <p style={{ fontSize: 12.5, color: 'rgba(184,180,216,0.7)', margin: '6px 0 0', lineHeight: 1.65 }}>
                    {winsToday > 0
                      ? `Yesterday you completed ${winsToday} Tiny Win${winsToday !== 1 ? 's' : ''}.`
                      : 'Every day is a new beginning.'
                    }
                    {hasCheckedIn
                      ? ' You checked in again today. '
                      : ' Take a moment for yourself. '
                    }
                    <span style={{ color: '#C4B5FD', fontStyle: 'italic' }}>Take a moment to reflect.</span>
                  </p>
                </div>
              </motion.div>

              {/* ── QUESTION ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                style={{ marginBottom: 16, position: 'relative', zIndex: 1 }}
              >
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '14px 16px',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(168,85,247,0.08))',
                  border: '1px solid rgba(168,85,247,0.22)',
                  borderRadius: 16,
                  borderLeft: '3px solid #A855F7',
                }}>
                  <span style={{ fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>💭</span>
                  <p style={{
                    fontSize: 15, fontWeight: 600,
                    color: '#E2DEFF', margin: 0, lineHeight: 1.55,
                    fontStyle: 'italic',
                  }}>
                    "{TODAY_QUESTION}"
                  </p>
                </div>
              </motion.div>

              {/* ── TEXTAREA ── */}
              <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
                <ReflectionTextarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  disabled={isSaving}
                  autoFocus={isOpen}
                />
              </div>

              {/* ── ACTIONS ── */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <ReflectionActions
                  onSave={handleSave}
                  onCancel={handleClose}
                  isSaving={isSaving}
                  isUpdate={isExisting}
                  disabled={!canSave}
                />
              </div>

              {/* Existing indicator */}
              {isExisting && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  style={{
                    marginTop: 14, fontSize: 11,
                    color: 'rgba(139,116,230,0.55)',
                    textAlign: 'center', fontStyle: 'italic',
                    position: 'relative', zIndex: 1,
                  }}
                >
                  ✦ Your reflection from today has been pre-loaded.
                </motion.p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
