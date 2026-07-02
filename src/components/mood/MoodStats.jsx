import React from 'react';
import { motion } from 'motion/react';

export default function MoodStats({ streak, longestStreak, wellnessScore, totalEntries }) {
  const stats = [
    { icon: '💜', label: 'Wellness Score', value: `${wellnessScore}/100`, sub: wellnessScore >= 70 ? '✨ Great!' : wellnessScore >= 50 ? '📈 Improving' : '💪 Keep going' },
    { icon: '🔥', label: 'Current Streak', value: `${streak}`, sub: streak > 1 ? '🎯 Amazing!' : '🚀 Start today' },
    { icon: '🏆', label: 'Longest Streak', value: `${longestStreak}`, sub: 'Your best! 🌟' },
    { icon: '📝', label: 'Total Entries', value: totalEntries, sub: 'Well tracked!' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(124, 58, 237, 0.25)' }}
          style={{
            background: 'rgba(34,18,73,0.72)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 20,
            backdropFilter: 'blur(24px)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>{stat.icon}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            {stat.value}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.7)', marginBottom: 8 }}>
            {stat.label}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#A78BFA' }}>
            {stat.sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
