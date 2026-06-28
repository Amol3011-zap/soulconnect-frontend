import React from 'react';
import { motion } from 'motion/react';
import { WEATHERS } from './EmotionWeatherModal';

function CheckInPrompt({ onCheckIn }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 20,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(15,10,40,0.6) 100%)',
        border: '1px dashed rgba(139,92,246,0.35)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        textAlign: 'center',
      }}
    >
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ fontSize: 36, marginBottom: 12 }}
        aria-hidden="true"
      >
        🌙
      </motion.div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
        How are you feeling today?
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 16, lineHeight: 1.5 }}>
        Take a moment to check in with your emotional weather.
      </div>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onCheckIn}
        aria-label="Start daily emotional check-in"
        style={{
          padding: '10px 24px',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
        }}
      >
        Check In Now ✨
      </motion.button>
    </motion.div>
  );
}

export default function WeatherWidget({ entry, onChangeWeather, onViewHistory }) {
  if (!entry) {
    return <CheckInPrompt onCheckIn={onChangeWeather} />;
  }

  const weather = WEATHERS[entry.weather];
  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 20,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(109,46,205,0.15) 0%, rgba(15,10,40,0.6) 100%)',
        border: '1px solid rgba(139,92,246,0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow background tint */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: weather.gradient,
          opacity: 0.06,
          borderRadius: 20,
          pointerEvents: 'none',
        }}
      />

      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}>
          Today's Emotional Weather
        </div>
        <button
          onClick={onViewHistory}
          aria-label="View weather history"
          style={{
            background: 'none',
            border: 'none',
            fontSize: 12,
            fontWeight: 600,
            color: '#A855F7',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          View History
        </button>
      </div>

      {/* Main content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Icon with pulsing glow */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Pulsing glow */}
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              background: weather.glowColor,
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            style={{ fontSize: 52, lineHeight: 1, userSelect: 'none' }}
            aria-hidden="true"
          >
            {weather.icon}
          </motion.div>
        </div>

        {/* Text info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: 2,
          }}>
            {weather.label}
          </div>
          <div style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 8,
          }}>
            {weather.tagline}
          </div>
          {/* Quote */}
          <div style={{
            fontSize: 12,
            fontStyle: 'italic',
            color: '#F59E0B',
            lineHeight: 1.45,
          }}>
            "{weather.quote}"
          </div>
        </div>
      </div>

      {/* Footer row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          Checked in at {entry.time}
        </div>
        <button
          onClick={onChangeWeather}
          aria-label="Change today's weather"
          style={{
            background: 'none',
            border: 'none',
            fontSize: 12,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
            textUnderlineOffset: 2,
          }}
        >
          Change
        </button>
      </div>
    </motion.div>
  );
}
