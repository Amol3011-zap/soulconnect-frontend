import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BreathingSessionOverlay from './BreathingSessionOverlay';

const MOOD_FOCUS = {
  'clear-sky': { title: 'Stay Present', icon: '☀️', color: '#FCD34D' },
  'hope': { title: 'Build Hope', icon: '🌤', color: '#A78BFA' },
  'blooming': { title: 'Keep Growing', icon: '🌸', color: '#F472B6' },
  'fog': { title: 'Find Clarity', icon: '🌫', color: '#9CA3AF' },
  'heavy-rain': { title: 'Calm Your Mind', icon: '🌧', color: '#60A5FA' },
  'storm': { title: 'Regain Control', icon: '⚡', color: '#7C3AED' },
};

const DURATION_DETAILS = {
  3: {
    label: '3 min',
    desc: 'Quick reset',
    fullDesc: 'Take a short mindful pause to reset your nervous system.',
  },
  5: {
    label: '5 min',
    desc: 'Deep breathing',
    fullDesc: 'Slow your breathing and relax your body.',
  },
  7: {
    label: '7 min',
    desc: 'Full guided relaxation',
    fullDesc: 'A guided breathing session to reduce anxiety and restore calm.',
  },
};

export default function TodaysFocusCard({ selectedMood, onSessionComplete }) {
  const [duration, setDuration] = useState(3);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSession, setShowSession] = useState(false);

  const moodData = MOOD_FOCUS[selectedMood] || MOOD_FOCUS['clear-sky'];
  const durationData = DURATION_DETAILS[duration];

  const handleComplete = () => {
    setIsCompleted(true);
    setShowSession(false);
    onSessionComplete?.();
  };

  const getMoodBackground = () => {
    switch (selectedMood) {
      case 'clear-sky':
        return 'linear-gradient(145deg, rgba(254, 243, 199, 0.08) 0%, rgba(253, 224, 71, 0.03) 100%)';
      case 'hope':
        return 'linear-gradient(145deg, rgba(221, 214, 254, 0.08) 0%, rgba(168, 139, 250, 0.03) 100%)';
      case 'blooming':
        return 'linear-gradient(145deg, rgba(253, 242, 248, 0.08) 0%, rgba(244, 114, 182, 0.03) 100%)';
      case 'fog':
        return 'linear-gradient(145deg, rgba(229, 231, 235, 0.08) 0%, rgba(156, 163, 175, 0.03) 100%)';
      case 'heavy-rain':
        return 'linear-gradient(145deg, rgba(147, 197, 253, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%)';
      case 'storm':
        return 'linear-gradient(145deg, rgba(124, 58, 237, 0.08) 0%, rgba(109, 74, 255, 0.03) 100%)';
      default:
        return 'linear-gradient(145deg, rgba(139, 92, 246, 0.08) 0%, rgba(168, 85, 247, 0.03) 100%)';
    }
  };

  const getMoodBorderColor = () => {
    switch (selectedMood) {
      case 'clear-sky':
        return 'rgba(253, 211, 77, 0.2)';
      case 'hope':
        return 'rgba(168, 139, 250, 0.2)';
      case 'blooming':
        return 'rgba(244, 114, 182, 0.2)';
      case 'fog':
        return 'rgba(156, 163, 175, 0.2)';
      case 'heavy-rain':
        return 'rgba(59, 130, 246, 0.2)';
      case 'storm':
        return 'rgba(124, 58, 237, 0.2)';
      default:
        return 'rgba(139, 92, 246, 0.2)';
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: getMoodBackground(),
          border: `1.5px solid ${getMoodBorderColor()}`,
          borderRadius: 24,
          padding: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Mood particles animation */}
        {selectedMood === 'blooming' && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: -200, opacity: [0, 1, 0] }}
                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  fontSize: 14,
                  pointerEvents: 'none',
                }}
              >
                🌸
              </motion.div>
            ))}
          </>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>✅</span>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>
              Today's Focus Completed
            </h3>
          </div>

          <p style={{ fontSize: 14, color: 'rgba(184, 180, 216, 0.8)', margin: '0 0 16px' }}>
            Beautiful work. You just spent time taking care of yourself.
          </p>

          <div
            style={{
              display: 'inline-block',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 12,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              color: '#A78BFA',
            }}
          >
            +1 Healing Point
          </div>
        </div>
      </motion.div>
    );
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: getMoodBackground(),
          border: `1.5px solid ${getMoodBorderColor()}`,
          borderRadius: 24,
          padding: isMobile ? '16px' : '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Mood-based background effects */}
        {selectedMood === 'clear-sky' && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(253, 211, 77, 0.3) 0%, transparent 70%)',
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
        )}

        {selectedMood === 'blooming' && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: -200, opacity: [0, 0.6, 0] }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  left: `${20 + i * 30}%`,
                  fontSize: 20,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              >
                🌸
              </motion.div>
            ))}
          </>
        )}

        {selectedMood === 'fog' && (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.4, 0.2], x: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, delay: i * 1 }}
                style={{
                  position: 'absolute',
                  top: i * 40,
                  left: 0,
                  right: 0,
                  height: 60,
                  background: 'radial-gradient(ellipse, rgba(156, 163, 175, 0.2) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  zIndex: 0,
                }}
              />
            ))}
          </>
        )}

        {selectedMood === 'heavy-rain' && (
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 200, opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 1.5,
                  delay: (i % 5) * 0.2,
                  repeat: Infinity,
                }}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  width: 2,
                  height: 12,
                  background: 'rgba(59, 130, 246, 0.4)',
                  borderRadius: 1,
                  zIndex: 0,
                }}
              />
            ))}
          </>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isMobile ? 14 : 20 }}>
            <span style={{ fontSize: isMobile ? 20 : 24 }}>🌿</span>
            <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: '#fff', margin: 0 }}>
              Today's Focus
            </h2>
          </div>

          {/* Focus Title */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: moodData.color,
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {moodData.icon} {moodData.title}
            </div>
            <p style={{ fontSize: 13, color: 'rgba(184, 180, 216, 0.6)', margin: 0 }}>
              Adapted to your mood
            </p>
          </div>

          {/* Duration Selection */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(196, 181, 253, 0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>
              Choose Duration
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 6 : 8 }}>
              {[3, 5, 7].map((dur) => (
                <motion.button
                  key={dur}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDuration(dur)}
                  style={{
                    padding: isMobile ? '8px 6px' : '10px 12px',
                    borderRadius: 12,
                    border:
                      duration === dur
                        ? `2px solid rgba(168, 139, 250, 0.6)`
                        : '1px solid rgba(168, 139, 250, 0.2)',
                    background:
                      duration === dur
                        ? 'rgba(139, 92, 246, 0.15)'
                        : 'rgba(139, 92, 246, 0.08)',
                    color: '#E2DEFF',
                    fontSize: isMobile ? 11 : 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ○ {dur}m
                </motion.button>
              ))}
            </div>
          </div>

          {/* Duration Details */}
          <div style={{ marginBottom: 24, padding: '14px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#A78BFA', margin: '0 0 6px' }}>
              {durationData.desc}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.7)', margin: 0, lineHeight: 1.5 }}>
              {durationData.fullDesc}
            </p>
          </div>

          {/* Difficulty Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: 'rgba(196, 181, 253, 0.6)' }}>🟢 Beginner</span>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSession(true)}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            ▶ Start Session
          </motion.button>
        </div>
      </motion.div>

      {/* Breathing Session Overlay */}
      <AnimatePresence>
        {showSession && (
          <BreathingSessionOverlay
            duration={duration}
            mood={selectedMood}
            onComplete={handleComplete}
            onClose={() => setShowSession(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
