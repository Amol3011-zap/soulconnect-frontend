import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const DEFAULT_BADGES = [
  { emoji: '🌱', title: 'First Week', sub: 'Completed your first week of self care' },
  { emoji: '🤝', title: 'Community Helper', sub: 'Helped 10 people in the community' },
  { emoji: '💜', title: 'Good Listener', sub: 'Supported 5 people in circles' },
  { emoji: '🏆', title: '30 Day Streak', sub: 'Logged mood for 30 consecutive days' },
];

export default function Achievements({ badges = DEFAULT_BADGES, onViewAll }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      style={{
        background: 'rgba(34, 18, 73, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        backdropFilter: 'blur(24px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>
          Achievements
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          style={{
            fontSize: 12,
            color: '#A78BFA',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          View All
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10 }}>
        {badges.slice(0, 4).map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: 14,
              background: 'rgba(124, 58, 237, 0.08)',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32 }}>{badge.emoji}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                {badge.title}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2, lineHeight: 1.2 }}>
                {badge.sub}
              </div>
            </div>
          </motion.div>
        ))}

        {/* +9 more badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.05 }}
          onClick={onViewAll}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 14,
            background: 'rgba(124, 58, 237, 0.08)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.04)',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#A78BFA' }}>+9</div>
          <div style={{ fontSize: 10, color: 'rgba(184, 180, 216, 0.6)' }}>More</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
