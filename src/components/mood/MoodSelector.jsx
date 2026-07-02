import React from 'react';
import { motion } from 'motion/react';
import { MOODS_5 } from '../../hooks/useMoodData';

export default function MoodSelector({ mood, onMoodSelect, todayMoodMeta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        background: 'rgba(34,18,73,0.72)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 28,
        backdropFilter: 'blur(24px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
              How are you feeling today?
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.7)', margin: 0 }}>
              Tap to log your mood
            </p>
          </div>
          {todayMoodMeta && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: `${todayMoodMeta.color}1a`,
                border: `1.5px solid ${todayMoodMeta.color}40`,
                borderRadius: 14,
                padding: '10px 14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, color: 'rgba(226, 222, 255, 0.7)', marginBottom: 4, fontWeight: 600 }}>
                Today's Mood
              </div>
              <div style={{ fontSize: 24 }}>{todayMoodMeta.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: todayMoodMeta.color, marginTop: 4 }}>
                {todayMoodMeta.label}
              </div>
            </motion.div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
            gap: 10,
            justifyItems: 'stretch',
          }}
        >
          {MOODS_5.map((m, i) => (
            <motion.button
              key={m.score}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMoodSelect(m.score)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: 14,
                borderRadius: 14,
                border: mood === m.score
                  ? `2px solid ${m.color}`
                  : '1px solid rgba(168, 139, 250, 0.2)',
                background: mood === m.score
                  ? `${m.color}20`
                  : 'rgba(139, 92, 246, 0.08)',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                boxShadow: mood === m.score ? `0 8px 24px ${m.color}40` : 'none',
                transition: 'all 0.2s',
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: mood === m.score ? 32 : 28, transition: 'font-size 0.2s' }}>
                {m.emoji}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', overflowWrap: 'break-word' }}>
                {m.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Glow background effect */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(140, 82, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
    </motion.div>
  );
}
