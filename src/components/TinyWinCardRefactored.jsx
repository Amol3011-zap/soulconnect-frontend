import React, { useState } from 'react';
import { motion } from 'motion/react';

const DIFFICULTY_COLORS = {
  Beginner: '#10B981',
  Intermediate: '#F59E0B',
  Advanced: '#EF4444',
};

export default function TinyWinCard({ challenge, isCompleted, onStart }) {
  const [expandedWhy, setExpandedWhy] = useState(false);
  const difficultyColor = DIFFICULTY_COLORS[challenge.difficulty] || '#10B981';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isCompleted ? { y: -4 } : {}}
      transition={{ duration: 0.4 }}
      style={{
        background: 'linear-gradient(145deg, rgba(26,10,62,0.95) 0%, rgba(45,18,96,0.9) 50%, rgba(20,8,52,0.95) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: 20,
        padding: 18,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(124,58,237,0.1)',
        opacity: isCompleted ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 32, lineHeight: 1 }}>{challenge.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(196,181,253,0.5)',
            marginBottom: 4,
          }}>
            {challenge.category}
          </div>
          <h3 style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            {challenge.title}
            {isCompleted && <span style={{ marginLeft: 6 }}>✓</span>}
          </h3>
        </div>
      </div>

      <p style={{
        fontSize: 12,
        color: 'rgba(184,180,216,0.75)',
        margin: '0 0 12px',
        lineHeight: 1.5,
      }}>
        {challenge.description}
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 16,
          padding: '4px 10px',
          fontSize: 11,
          color: '#B8B4D8',
        }}>
          ⏱ {challenge.time < 1 ? Math.round(challenge.time * 60) + 's' : challenge.time + ' min'}
        </span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 16,
          padding: '4px 10px',
          fontSize: 11,
          color: '#B8B4D8',
        }}>
          <span style={{ color: difficultyColor }}>●</span> {challenge.difficulty}
        </span>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expandedWhy ? 'auto' : 0 }}
        style={{ overflow: 'hidden', marginBottom: expandedWhy ? 12 : 0 }}
      >
        <div style={{
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: 12,
          padding: 12,
        }}>
          <p style={{
            fontSize: 12,
            color: 'rgba(184,180,216,0.85)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {challenge.whyItHelps}
          </p>
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: 8 }}>
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setExpandedWhy(!expandedWhy)}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            color: '#A78BFA',
            fontSize: 12,
            fontWeight: 600,
            padding: '10px 12px',
            cursor: 'pointer',
          }}
        >
          💡 {expandedWhy ? 'Hide' : 'Why?'}
        </motion.button>
        <motion.button
          whileHover={!isCompleted ? { y: -2 } : {}}
          onClick={onStart}
          disabled={isCompleted}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontWeight: 600,
            cursor: isCompleted ? 'default' : 'pointer',
            padding: '10px 20px',
            fontSize: 13,
            opacity: isCompleted ? 0.5 : 1,
          }}
        >
          {isCompleted ? '✓ Done' : 'Start'}
        </motion.button>
      </div>
    </motion.div>
  );
}
