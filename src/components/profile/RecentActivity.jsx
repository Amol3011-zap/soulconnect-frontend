import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const DEFAULT_ACTIVITIES = [
  { emoji: '💜', title: 'Helped Sarah', time: '2 hours ago' },
  { emoji: '🌱', title: 'Completed Breathing Challenge', time: 'Yesterday' },
  { emoji: '📖', title: 'Wrote a Journal Entry', time: '2 days ago' },
  { emoji: '😊', title: 'Logged an Amazing Day', time: '3 days ago' },
];

export default function RecentActivity({ activities = DEFAULT_ACTIVITIES, onViewAll }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
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
          Recent Activity
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {activities.slice(0, 4).map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              background: 'rgba(124, 58, 237, 0.08)',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            whileHover={{ background: 'rgba(124, 58, 237, 0.12)' }}
          >
            <div style={{ fontSize: 18, flexShrink: 0 }}>{activity.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                {activity.title}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2 }}>
                {activity.time}
              </div>
            </div>
            <ChevronRight size={14} color="rgba(184, 180, 216, 0.5)" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
