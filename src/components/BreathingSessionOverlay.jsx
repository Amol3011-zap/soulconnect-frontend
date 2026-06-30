import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BREATHING_PATTERNS = {
  3: { inhale: 3, hold: 2, exhale: 3, cycles: 5 },
  5: { inhale: 4, hold: 4, exhale: 4, cycles: 5 },
  7: { inhale: 5, hold: 5, exhale: 5, cycles: 7 },
};

const PHASE_TEXT = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
};

export default function BreathingSessionOverlay({ duration = 3, mood, onComplete, onClose }) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [phase, setPhase] = useState('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const pattern = BREATHING_PATTERNS[duration];
  const totalSeconds = duration * 60;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setShowConfetti(true);
          setTimeout(() => onComplete?.(), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  // Breathing phase animation
  useEffect(() => {
    if (!isRunning) return;

    const phaseMap = ['inhale', 'hold', 'exhale'];
    const cycleDuration = pattern.inhale + pattern.hold + pattern.exhale;
    const elapsedSeconds = totalSeconds - timeRemaining;
    const phaseIndex = Math.floor((elapsedSeconds % cycleDuration) / pattern[phaseMap[0]]);

    const currentPhase = phaseMap[phaseIndex % 3];
    const phaseDuration = pattern[currentPhase];
    const phaseElapsed = (elapsedSeconds % cycleDuration) % phaseDuration;
    const progress = (phaseElapsed / phaseDuration) * 100;

    setPhase(currentPhase);
    setPhaseProgress(progress);
  }, [timeRemaining, pattern, totalSeconds, isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodGradient = () => {
    switch (mood) {
      case 'clear-sky':
        return 'linear-gradient(180deg, rgba(254, 243, 199, 0.1) 0%, rgba(253, 224, 71, 0.05) 100%)';
      case 'hope':
        return 'linear-gradient(180deg, rgba(221, 214, 254, 0.1) 0%, rgba(168, 139, 250, 0.05) 100%)';
      case 'blooming':
        return 'linear-gradient(180deg, rgba(253, 242, 248, 0.1) 0%, rgba(244, 114, 182, 0.05) 100%)';
      case 'fog':
        return 'linear-gradient(180deg, rgba(229, 231, 235, 0.1) 0%, rgba(156, 163, 175, 0.05) 100%)';
      case 'heavy-rain':
        return 'linear-gradient(180deg, rgba(147, 197, 253, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)';
      case 'storm':
        return 'linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 74, 255, 0.05) 100%)';
      default:
        return 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)';
    }
  };

  const getCircleScale = () => {
    if (phase === 'inhale') return 1 + (phaseProgress / 100) * 0.3;
    if (phase === 'exhale') return 1.3 - (phaseProgress / 100) * 0.3;
    return 1.3;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
        onClick={onClose}
      >
        {/* Confetti */}
        {showConfetti &&
          Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                y: window.innerHeight / 2,
                x: window.innerWidth / 2,
              }}
              animate={{
                opacity: 0,
                y: -100,
                x: (Math.random() - 0.5) * 200,
              }}
              transition={{ duration: 2, delay: Math.random() * 0.3 }}
              style={{
                position: 'fixed',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: ['#6D4AFF', '#A78BFA', '#F5B841'][Math.floor(Math.random() * 3)],
                pointerEvents: 'none',
              }}
            />
          ))}

        {/* Card */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            width: '90%',
            maxWidth: 400,
            padding: 40,
            borderRadius: 24,
            background: getMoodGradient(),
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Lotus */}
          <motion.div
            animate={{ rotate: isRunning ? 360 : 0, scale: showConfetti ? 1.2 : 1 }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0.5 },
            }}
            style={{
              fontSize: showConfetti ? 120 : 80,
              marginBottom: 20,
            }}
          >
            🪷
          </motion.div>

          {/* Breathing Circle */}
          <div style={{ position: 'relative', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
            <motion.div
              animate={{ scale: getCircleScale() }}
              transition={{ duration: phase === 'hold' ? 0 : pattern[phase], ease: 'easeInOut' }}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '3px solid rgba(168, 139, 250, 0.5)',
                background: 'radial-gradient(circle, rgba(168, 139, 250, 0.2) 0%, transparent 70%)',
                boxShadow: '0 0 30px rgba(109, 74, 255, 0.3)',
              }}
            />
          </div>

          {/* Phase Text */}
          <motion.h2
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#E2DEFF',
              margin: '0 0 20px',
            }}
          >
            {PHASE_TEXT[phase]}
          </motion.h2>

          {/* Timer */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#A78BFA',
              marginBottom: 30,
              fontFamily: 'monospace',
            }}
          >
            {formatTime(timeRemaining)}
          </div>

          {/* Controls */}
          {!showConfetti && (
            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRunning(!isRunning)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: '#E2DEFF',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {isRunning ? '⏸ Pause' : '▶ Resume'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: '#E2DEFF',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                ✕ Exit
              </motion.button>
            </div>
          )}

          {/* Completion Message */}
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>✨</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
                Beautiful work.
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(226, 222, 255, 0.7)', margin: 0 }}>
                You just spent time taking care of yourself.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
