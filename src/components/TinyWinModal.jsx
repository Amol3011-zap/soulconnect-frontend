import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const AFFIRMATIONS = [
  "You showed up for yourself today.",
  "Small actions create lasting change.",
  "You chose yourself today.",
  "You kept your promise to yourself.",
  "You made progress.",
  "Every small win adds up to something beautiful.",
  "This moment will ripple forward.",
  "You are worth these small acts of care.",
  "Healing doesn't have to be dramatic. This counts.",
  "One breath, one step, one win at a time.",
];

function BreathingCircle() {
  return (
    <motion.div
      animate={{
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        repeat: Infinity,
        duration: 4,
        ease: 'easeInOut',
      }}
      style={{
        width: 140,
        height: 140,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, rgba(168,85,247,0.6), rgba(124,58,237,0.3))',
        border: '2px solid rgba(168,85,247,0.5)',
        boxShadow: '0 0 60px rgba(168,85,247,0.4), inset 0 0 40px rgba(168,85,247,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
      }}
    >
      🌿
    </motion.div>
  );
}

function BreathingPhase({ phase, instruction, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      style={{ textAlign: 'center' }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        {phase}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
        {instruction}
      </div>
    </motion.div>
  );
}

function CompletionScreen({ affirmation, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '40px 20px',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: 2, duration: 0.6 }}
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          boxShadow: '0 0 60px rgba(168,85,247,0.5)',
        }}
      >
        ✓
      </motion.div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 26,
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
        }}>
          Tiny Win Complete
        </h2>
        <p style={{
          fontSize: 14,
          color: '#B8B4D8',
          margin: 0,
          lineHeight: 1.6,
          maxWidth: 300,
          fontStyle: 'italic',
        }}>
          {affirmation}
        </p>
      </div>

      <motion.button
        whileHover={{ y: -2 }}
        onClick={onComplete}
        style={{
          marginTop: 20,
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          border: 'none',
          borderRadius: 16,
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
        }}
      >
        Back to Wins
      </motion.button>
    </motion.div>
  );
}

export default function TinyWinModal({ challenge, onClose, onComplete }) {
  const [phase, setPhase] = useState('intro');
  const [elapsed, setElapsed] = useState(0);
  const [affirmation] = useState(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);

  const BREATHING_PHASES = [
    { name: 'Inhale', instruction: 'Breathe in slowly...', duration: 4 },
    { name: 'Hold', instruction: 'Hold gently...', duration: 4 },
    { name: 'Exhale', instruction: 'Release slowly...', duration: 4 },
    { name: 'Rest', instruction: 'Rest and be still...', duration: 4 },
  ];

  const TOTAL_DURATION = BREATHING_PHASES.reduce((sum, p) => sum + p.duration, 0);
  const SESSION_DURATION = TOTAL_DURATION * 3; // 3 cycles

  useEffect(() => {
    if (phase === 'breathing') {
      if (elapsed >= SESSION_DURATION) {
        setPhase('complete');
        return;
      }

      const timer = setTimeout(() => setElapsed(e => e + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, elapsed, SESSION_DURATION]);

  const getCurrentPhaseInfo = () => {
    const pos = elapsed % TOTAL_DURATION;
    let currentPos = 0;
    for (const p of BREATHING_PHASES) {
      if (pos < currentPos + p.duration) {
        return p;
      }
      currentPos += p.duration;
    }
    return BREATHING_PHASES[0];
  };

  const currentPhase = getCurrentPhaseInfo();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(26,10,62,0.98) 0%, rgba(8,8,18,0.99) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, rgba(26,10,62,0.95) 0%, rgba(45,18,96,0.9) 50%, rgba(20,8,52,0.95) 100%)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 28,
          padding: '40px 28px',
          maxWidth: 400,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 100px rgba(124,58,237,0.2)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#B8B4D8',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <div style={{ fontSize: 44, lineHeight: 1 }}>{challenge.icon}</div>
              <div>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#fff',
                  margin: '0 0 8px',
                  textAlign: 'center',
                }}>
                  {challenge.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: 'rgba(184,180,216,0.75)',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>
                  {challenge.description}
                </p>
              </div>

              {challenge.whyItHelps && (
                <div style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  borderRadius: 16,
                  padding: 16,
                  width: '100%',
                }}>
                  <p style={{
                    fontSize: 12,
                    color: 'rgba(184,180,216,0.85)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    💡 {challenge.whyItHelps}
                  </p>
                </div>
              )}

              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => setPhase('breathing')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
                  border: 'none',
                  borderRadius: 16,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                  marginTop: 8,
                }}
              >
                Start Challenge
              </motion.button>
            </motion.div>
          )}

          {phase === 'breathing' && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 32,
              }}
            >
              <div style={{
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(196,181,253,0.5)',
              }}>
                {Math.ceil((SESSION_DURATION - elapsed) / TOTAL_DURATION)} of 3 cycles
              </div>

              <BreathingCircle />

              <BreathingPhase
                phase={currentPhase.name}
                instruction={currentPhase.instruction}
              />

              <div style={{
                display: 'flex',
                gap: 6,
                justifyContent: 'center',
              }}>
                {BREATHING_PHASES.map((p, i) => {
                  const phaseIndex = Array.from({ length: BREATHING_PHASES.length }).findIndex(
                    (_, idx) => {
                      const start = idx * BREATHING_PHASES.reduce((sum, pp, ii) => ii < idx ? sum + pp.duration : sum, 0);
                      return elapsed % TOTAL_DURATION >= start && elapsed % TOTAL_DURATION < start + p.duration;
                    }
                  );
                  return (
                    <div key={i} style={{
                      width: i === phaseIndex ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === phaseIndex ? '#8B5CF6' : 'rgba(255,255,255,0.15)',
                      transition: 'all 0.3s ease',
                    }} />
                  );
                })}
              </div>
            </motion.div>
          )}

          {phase === 'complete' && (
            <CompletionScreen
              affirmation={affirmation}
              onComplete={() => {
                onComplete();
                onClose();
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
