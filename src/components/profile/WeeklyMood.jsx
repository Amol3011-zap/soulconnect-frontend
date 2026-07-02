import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export default function WeeklyMood({ onViewFull, moods = [5, 5, 5, 5, 5, 5, 5] }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const moodEmojis = { 1: '😭', 3: '😔', 5: '😐', 7: '🙂', 9: '😁' };

  const getMoodEmoji = (score) => {
    if (!score) return '😐';
    return Object.entries(moodEmojis).reduce(([bestScore, bestEmoji], [s, emoji]) =>
      Math.abs(parseInt(s) - score) < Math.abs(parseInt(bestScore) - score)
        ? [s, emoji]
        : [bestScore, bestEmoji]
    )[1];
  };

  // Use only the 7 days
  const displayMoods = useMemo(() => {
    const last7 = moods.slice(-7);
    // Pad with neutral mood if less than 7 days
    while (last7.length < 7) {
      last7.unshift(5);
    }
    return last7;
  }, [moods]);

  // Calculate line coordinates
  const width = 240;
  const height = 50;
  const points = displayMoods.map((mood, i) => {
    const x = (i / 6) * width;
    const y = height - ((mood - 1) / 9) * height;
    return `${x},${y}`;
  }).join(' ');

  // Calculate sentiment
  const avgMood = Math.round(displayMoods.reduce((a, b) => a + b, 0) / displayMoods.length);
  const sentiment = avgMood >= 7 ? 'Keep it up! You had more good days this week.' :
                    avgMood >= 5 ? 'You\'re staying balanced. Keep going!' :
                    'We\'re here for you. It gets better!';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      style={{
        background: 'rgba(34, 18, 73, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        backdropFilter: 'blur(24px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
            Your Mood This Week
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.6)', margin: 0 }}>
            {sentiment}
          </p>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewFull}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid rgba(139, 92, 246, 0.3)',
            background: 'transparent',
            color: '#A78BFA',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          View Full <ChevronRight size={14} />
        </motion.button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, justifyContent: 'space-between' }}>
        {displayMoods.map((mood, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div style={{ fontSize: 20 }}>{getMoodEmoji(mood)}</div>
            <div style={{ fontSize: 9, color: 'rgba(184, 180, 216, 0.6)' }}>{days[i]}</div>
          </motion.div>
        ))}
      </div>

      {/* Animated line under moods */}
      <svg width="100%" height="2" style={{ marginTop: 12, opacity: 0.5 }}>
        <motion.polyline
          points={points}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  );
}
