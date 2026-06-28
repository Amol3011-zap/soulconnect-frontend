import React from 'react';
import { motion } from 'motion/react';

export default function WeatherRecommendation({ weather, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        marginTop: 28,
        borderRadius: 20,
        padding: '28px 32px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: `1px solid ${weather.color}44`,
        boxShadow: `0 0 32px ${weather.glowColor}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: weather.gradient,
          opacity: 0.08,
          borderRadius: 20,
          pointerEvents: 'none',
        }}
      />

      {/* Thank you heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 20 }}>🤍</span>
        <h3 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.01em',
        }}>
          Thank you for checking in.
        </h3>
      </motion.div>

      {/* Quote */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          margin: '0 0 22px',
          padding: '14px 18px',
          borderLeft: `3px solid ${weather.color}`,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '0 12px 12px 0',
        }}
      >
        <p style={{
          margin: 0,
          fontSize: 14,
          fontStyle: 'italic',
          color: '#F59E0B',
          lineHeight: 1.6,
        }}>
          "{weather.quote}"
        </p>
      </motion.blockquote>

      {/* Recommendation section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: weather.color,
          marginBottom: 10,
        }}>
          Today's Recommendation
        </div>

        <div style={{
          padding: '16px 20px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 20,
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 6,
            letterSpacing: '-0.01em',
          }}>
            {weather.recommendation.action}
          </div>
          <div style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.55,
          }}>
            {weather.recommendation.description}
          </div>
        </div>

        {/* CTA button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          aria-label="Continue to dashboard"
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            color: '#fff',
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
            letterSpacing: '-0.01em',
          }}
        >
          Let's Do It →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
