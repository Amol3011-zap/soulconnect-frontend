import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PHASE_CYCLE = 16; // seconds: 4 inhale + 4 hold + 4 exhale + 4 hold

// Duration presets
const DURATIONS = {
  3: 3 * 60,   // 180 seconds
  5: 5 * 60,   // 300 seconds
  7: 7 * 60,   // 420 seconds
};

const PHASES = [
  { name: 'Inhale',  start: 0,  end: 4,  instruction: 'Breathe in slowly...',  scale: 1.28, color: '#8B5CF6' },
  { name: 'Hold',    start: 4,  end: 8,  instruction: 'Hold gently...',         scale: 1.28, color: '#A855F7' },
  { name: 'Exhale',  start: 8,  end: 12, instruction: 'Release slowly...',      scale: 0.78, color: '#6D28D9' },
  { name: 'Rest',    start: 12, end: 16, instruction: 'Rest and be still...',   scale: 0.78, color: '#7C3AED' },
];

function getPhase(elapsed) {
  const pos = elapsed % PHASE_CYCLE;
  return PHASES.find(p => pos >= p.start && pos < p.end) || PHASES[0];
}

function getPhaseIndex(elapsed) {
  const pos = elapsed % PHASE_CYCLE;
  return PHASES.findIndex(p => pos >= p.start && pos < p.end);
}

// SVG ring for session progress
function ProgressRing({ progress, size = 240, stroke = 3 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  return (
    <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(139,92,246,0.12)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(139,92,246,0.6)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
}

export default function BreathingSession({ onClose, onComplete, duration = 7 }) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const TOTAL_SECONDS = DURATIONS[duration] || DURATIONS[7];
  const remaining = TOTAL_SECONDS - elapsed;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = elapsed / TOTAL_SECONDS;
  const phase = getPhase(elapsed);
  const phaseIdx = getPhaseIndex(elapsed);
  const cycleCount = Math.floor(elapsed / PHASE_CYCLE);

  useEffect(() => {
    if (paused || done) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev + 1 >= TOTAL_SECONDS) { setDone(true); return TOTAL_SECONDS; }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [paused, done]);

  function handleComplete() {
    onComplete?.();
    onClose();
  }

  const RING_SIZE = 240;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-modal="true"
      aria-label="Breathing session"
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'radial-gradient(ellipse at 50% 20%, #1a0533 0%, #080812 65%, #050308 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <style>{`
        @keyframes breatheIn {
          0%   { transform: scale(0.78); opacity: 0.7; }
          100% { transform: scale(1.28); opacity: 1;   }
        }
        @keyframes breatheOut {
          0%   { transform: scale(1.28); opacity: 1;   }
          100% { transform: scale(0.78); opacity: 0.7; }
        }
        @keyframes holdLarge {
          0%, 100% { transform: scale(1.28); opacity: 1; }
        }
        @keyframes holdSmall {
          0%, 100% { transform: scale(0.78); opacity: 0.7; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 40px 10px rgba(139,92,246,0.25); }
          50%       { box-shadow: 0 0 70px 24px rgba(139,92,246,0.45); }
        }
        .breathing-circle {
          transition: transform 4s ease-in-out;
        }
        .check-pulse {
          animation: checkPulse 0.6s ease forwards;
        }
        @keyframes checkPulse {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Exit breathing session"
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '6px 14px',
          color: 'rgba(255,255,255,0.5)', fontSize: 13,
          cursor: 'pointer',
        }}
      >
        ✕ Exit
      </button>

      {/* Session header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: '#F4C542', letterSpacing: '0.12em', marginBottom: 6 }}>
          BREATHING SESSION
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          Calm Your Mind · {duration} Minutes
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {done ? (
          /* ── COMPLETION SCREEN ── */
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
            style={{ textAlign: 'center', maxWidth: 360 }}
          >
            {/* Check circle */}
            <div className="check-pulse" style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 0 60px rgba(139,92,246,0.5)',
            }}>
              <span style={{ fontSize: 40 }}>✓</span>
            </div>

            <h2 style={{ margin: '0 0 10px', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Session Complete
            </h2>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: '#B8B4D8', lineHeight: 1.6 }}>
              {duration} minutes of mindful breathing done.
            </p>
            <p style={{ margin: '0 0 36px', fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, fontStyle: 'italic' }}>
              Take a moment to notice how you feel right now.
            </p>

            <button
              onClick={handleComplete}
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                border: 'none', borderRadius: 16, padding: '14px 40px',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
              }}
            >
              Continue Journey →
            </button>
          </motion.div>
        ) : (
          /* ── BREATHING SESSION ── */
          <motion.div
            key="session"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}
          >
            {/* Timer */}
            <div style={{
              fontSize: 44, fontWeight: 800, color: '#fff',
              letterSpacing: '-0.03em', lineHeight: 1,
              marginBottom: 40, fontVariantNumeric: 'tabular-nums',
            }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>

            {/* Breathing circle + progress ring */}
            <div style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE, marginBottom: 40 }}>
              <ProgressRing progress={progress} size={RING_SIZE} />

              {/* Outer glow ring */}
              <div style={{
                position: 'absolute',
                inset: 20,
                borderRadius: '50%',
                border: '1px solid rgba(139,92,246,0.15)',
                pointerEvents: 'none',
              }} />

              {/* Breathing circle */}
              <motion.div
                key={`${phaseIdx}-${cycleCount}`}
                initial={{ scale: phaseIdx === 0 || phaseIdx === 3 ? 0.78 : 1.28 }}
                animate={{ scale: phase.scale }}
                transition={{
                  duration: phase.end - phase.start,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  inset: 36,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 35%, ${phase.color}55, ${phase.color}22)`,
                  border: `1.5px solid ${phase.color}66`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 50px ${phase.color}33, inset 0 0 30px ${phase.color}11`,
                  willChange: 'transform',
                  animationPlayState: paused ? 'paused' : 'running',
                }}
              >
                <span style={{ fontSize: 32, userSelect: 'none' }}>
                  {phaseIdx === 0 ? '🌬️' : phaseIdx === 1 ? '✨' : phaseIdx === 2 ? '🍃' : '🌙'}
                </span>
              </motion.div>
            </div>

            {/* Phase text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${phaseIdx}-${cycleCount}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center', marginBottom: 48 }}
              >
                <div style={{
                  fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}>
                  {phase.name}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                  {phase.instruction}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Phase dots */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
              {PHASES.map((p, i) => (
                <div key={i} style={{
                  width: i === phaseIdx ? 24 : 6,
                  height: 6, borderRadius: 3,
                  background: i === phaseIdx ? '#8B5CF6' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setPaused(p => !p)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14, padding: '12px 32px',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', minWidth: 120,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {paused ? '▶ Resume' : '⏸ Pause'}
              </button>
            </div>

            {/* Paused indicator */}
            {paused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}
              >
                SESSION PAUSED
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
