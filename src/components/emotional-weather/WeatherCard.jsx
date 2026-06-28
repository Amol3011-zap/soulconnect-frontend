import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function WeatherCard({ weather, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      role="radio"
      aria-checked={selected}
      aria-label={`${weather.label} — ${weather.tagline}`}
      tabIndex={0}
      onClick={() => onSelect(weather.id)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      animate={selected ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 160,
        borderRadius: 20,
        padding: '20px 12px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: 'pointer',
        border: selected
          ? `2px solid ${weather.color}`
          : '1.5px solid rgba(255,255,255,0.1)',
        background: selected
          ? weather.gradient
          : `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
        boxShadow: selected
          ? `0 0 28px ${weather.glowColor}, 0 4px 24px rgba(0,0,0,0.4)`
          : hovered
          ? `0 0 18px ${weather.glowColor}, 0 4px 20px rgba(0,0,0,0.3)`
          : '0 2px 12px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        outline: 'none',
        overflow: 'hidden',
        transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
      }}
    >
      {/* Gradient overlay on background */}
      {!selected && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            background: weather.gradient,
            opacity: hovered ? 0.18 : 0.08,
            transition: 'opacity 0.25s',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Selected checkmark badge */}
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: weather.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: '#fff',
            fontWeight: 800,
            boxShadow: `0 0 10px ${weather.glowColor}`,
          }}
        >
          ✓
        </motion.div>
      )}

      {/* Pulse ring on selected */}
      {selected && (
        <motion.div
          aria-hidden="true"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: 24,
            border: `2px solid ${weather.color}`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Floating icon */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ fontSize: 44, lineHeight: 1, userSelect: 'none' }}
        aria-hidden="true"
      >
        {weather.icon}
      </motion.div>

      {/* Label */}
      <div style={{
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: '-0.01em',
        lineHeight: 1.2,
      }}>
        {weather.label}
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 11,
        color: selected ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)',
        textAlign: 'center',
        lineHeight: 1.3,
        maxWidth: 110,
      }}>
        {weather.tagline}
      </div>
    </motion.button>
  );
}
