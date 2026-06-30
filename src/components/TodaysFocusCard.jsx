import React, { useState } from 'react';
import { motion } from 'motion/react';

const DURATIONS = [
  {
    value: 3,
    title: 'Quick Reset',
    subtitle: 'Perfect when you need a short moment to breathe.',
  },
  {
    value: 5,
    title: 'Calm & Center',
    subtitle: 'Slow down and reconnect with yourself.',
  },
  {
    value: 7,
    title: 'Deep Relaxation',
    subtitle: 'A longer guided breathing experience.',
  },
];

const SECTION_LABEL = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(196,181,253,0.5)',
  marginBottom: 12,
};

const CARD_STYLE = {
  background: 'linear-gradient(145deg, rgba(26,10,62,0.95) 0%, rgba(45,18,96,0.9) 50%, rgba(20,8,52,0.95) 100%)',
  border: '1px solid rgba(139,92,246,0.2)',
  borderRadius: 20,
  padding: 18,
  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(124,58,237,0.1)',
};

const PURPLE_BTN = {
  background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
  border: 'none',
  borderRadius: 12,
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
};

export default function TodaysFocusCard({ onStartSession, breathingDone }) {
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentDuration = DURATIONS.find((d) => d.value === selectedDuration);

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handleStartSession = () => {
    onStartSession?.(selectedDuration);
  };

  return (
    <div style={{ ...CARD_STYLE, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <div style={SECTION_LABEL}>TODAY'S FOCUS ⓘ</div>

      {/* Title + Icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <motion.h3
            key={currentDuration.title}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {currentDuration.title}
          </motion.h3>
        </div>
        <span style={{ fontSize: 28, lineHeight: 1 }}>🌿</span>
      </div>

      {/* Subtitle */}
      <motion.p
        key={currentDuration.subtitle}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: 12,
          color: 'rgba(184,180,216,0.65)',
          margin: '0 0 16px',
          lineHeight: 1.5,
        }}
      >
        {currentDuration.subtitle}
      </motion.p>

      {/* Duration Label */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(196,181,253,0.4)',
          marginBottom: 10,
        }}
      >
        Choose your session
      </div>

      {/* Duration Buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {DURATIONS.map((duration) => (
          <motion.button
            key={duration.value}
            onClick={() => handleDurationChange(duration.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 12,
              border: selectedDuration === duration.value ? '1px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.1)',
              background:
                selectedDuration === duration.value
                  ? 'rgba(139,92,246,0.25)'
                  : 'rgba(255,255,255,0.05)',
              color: '#E2DEFF',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow:
                selectedDuration === duration.value
                  ? '0 0 16px rgba(139,92,246,0.4)'
                  : 'none',
            }}
          >
            {duration.value} min
          </motion.button>
        ))}
      </div>

      {/* Confirmation Message */}
      {showConfirmation && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: 11,
            color: '#A78BFA',
            textAlign: 'center',
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          ✨ Great choice! Small steps create lasting change.
        </motion.div>
      )}

      {/* Difficulty Badge */}
      <div style={{ marginBottom: 14 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 11,
            color: '#B8B4D8',
          }}
        >
          <span>🟢</span> Beginner
        </span>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleStartSession}
        style={{
          ...PURPLE_BTN,
          width: '100%',
          padding: '12px',
          fontSize: 13,
          borderRadius: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {breathingDone ? '✓ Completed' : `▶ Start ${selectedDuration}m Session`}
      </motion.button>
    </div>
  );
}
