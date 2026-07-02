import React from 'react';
import { motion } from 'motion/react';

export default function ProfileHeader({ user, streak, mood, onEditClick }) {
  const initials = (user?.name || 'S')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const moodEmoji = {
    1: '😭', 3: '😔', 5: '😐', 7: '🙂', 9: '😁'
  };

  const getMoodEmoji = () => {
    if (!mood) return '😊';
    return Object.entries(moodEmoji).reduce(([bestScore], [score]) =>
      Math.abs(parseInt(score) - mood) < Math.abs(parseInt(bestScore) - mood)
        ? [score]
        : [bestScore]
    )[0].split('').reverse()[0] || moodEmoji[Math.round(mood)];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'rgba(34, 18, 73, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: '20px 16px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Left: Avatar + Online */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {initials}
        </div>
        {/* Online indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#10B981',
            border: '2px solid #171126',
          }}
        />
      </div>

      {/* Center: Name + Mood + Streak */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          {user?.name || 'Soul Traveler'}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.6)', marginBottom: 8 }}>
          You don't have to go through it alone.
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(184, 180, 216, 0.8)' }}>
            <span>{getMoodEmoji()}</span>
            <span>Hopeful</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(184, 180, 216, 0.8)' }}>
            <span>🔥</span>
            <span>{streak || 0}d Streak</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(184, 180, 216, 0.8)' }}>
            <span>🌱</span>
            <span>Level 4</span>
          </div>
        </div>
      </div>

      {/* Right: Edit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEditClick}
        style={{
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid rgba(139, 92, 246, 0.3)',
          background: 'rgba(124, 58, 237, 0.1)',
          color: '#A78BFA',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
          flexShrink: 0,
        }}
      >
        ✏️ Edit
      </motion.button>
    </motion.div>
  );
}
