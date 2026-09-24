import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DIFFICULTY_COLORS } from '../data/tinyWinsDatabase';

const CARD_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #DCD2F2',
  borderRadius: 20,
  padding: 18,
  boxShadow: '0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04)',
};

const PURPLE_BTN = {
  background: '#8066D5',
  border: 'none',
  borderRadius: 12,
  color: '#FFFFFF',
  fontWeight: 600,
  cursor: 'pointer',
  padding: '10px 20px',
  fontSize: 13,
  transition: 'all 0.3s ease',
  boxShadow: 'none',
};

export default function TinyWinCard({ challenge, onComplete, isCompleted }) {
  const [expandedWhy, setExpandedWhy] = useState(false);

  const handleComplete = () => {
    onComplete?.(challenge.id);
  };

  const difficultyColor = DIFFICULTY_COLORS[challenge.difficulty] || '#10B981';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      style={{
        ...CARD_STYLE,
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
            color: '#69677D',
            marginBottom: 4,
          }}>
            {challenge.category}
          </div>
          <h3 style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#171642',
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
        color: '#69677D',
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
          background: '#F7F5FB',
          border: '1px solid #E7E3EF',
          borderRadius: 16,
          padding: '4px 10px',
          fontSize: 11,
          color: '#69677D',
        }}>
          ⏱ {challenge.time < 1 ? Math.round(challenge.time * 60) + 's' : challenge.time + ' min'}
        </span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: '#F7F5FB',
          border: '1px solid #E7E3EF',
          borderRadius: 16,
          padding: '4px 10px',
          fontSize: 11,
          color: '#69677D',
        }}>
          <span style={{ color: difficultyColor }}>●</span> {challenge.difficulty}
        </span>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expandedWhy ? 'auto' : 0 }}
        style={{ overflow: 'hidden', marginBottom: expandedWhy ? 12 : 0 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: expandedWhy ? 1 : 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#EFEAFB',
            border: '1px solid #DCD2F2',
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <p style={{
            fontSize: 12,
            color: '#69677D',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {challenge.whyItHelps}
          </p>
        </motion.div>
      </motion.div>

      <div style={{ display: 'flex', gap: 8 }}>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpandedWhy(!expandedWhy)}
          style={{
            flex: 1,
            background: '#F7F5FB',
            border: '1px solid #E7E3EF',
            borderRadius: 10,
            color: '#5E47B8',
            fontSize: 12,
            fontWeight: 600,
            padding: '10px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          💡 {expandedWhy ? 'Hide' : 'Why?'}
        </motion.button>
        <motion.button
          whileHover={!isCompleted ? { y: -2 } : {}}
          whileTap={!isCompleted ? { scale: 0.95 } : {}}
          onClick={handleComplete}
          disabled={isCompleted}
          style={{
            flex: 1,
            ...PURPLE_BTN,
            opacity: isCompleted ? 0.5 : 1,
            cursor: isCompleted ? 'default' : 'pointer',
          }}
        >
          {isCompleted ? '✓ Done' : 'Complete'}
        </motion.button>
      </div>
    </motion.div>
  );
}
