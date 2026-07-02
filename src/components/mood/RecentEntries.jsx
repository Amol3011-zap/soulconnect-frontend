import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function RecentEntries({ allEntries, onDelete }) {
  const recentEntries = allEntries.slice(0, 10);

  const MOODS_MAP = {
    1: { emoji: '😭', label: 'Awful', color: '#EF4444' },
    3: { emoji: '😔', label: 'Not Good', color: '#F97316' },
    5: { emoji: '😐', label: 'Okay', color: '#F59E0B' },
    7: { emoji: '🙂', label: 'Good', color: '#10B981' },
    9: { emoji: '😁', label: 'Amazing', color: '#6D4AFF' },
  };

  function getMoodMeta(score) {
    if (!score) return null;
    return Object.values(MOODS_MAP).reduce((a, b) =>
      Math.abs(b.emoji.charCodeAt(0) - score) < Math.abs(a.emoji.charCodeAt(0) - score) ? b : a,
      Object.values(MOODS_MAP)[2]
    );
  }

  function getMoodLabel(score) {
    const closest = Object.entries(MOODS_MAP).reduce(([bestScore, bestMood], [s, mood]) =>
      Math.abs(parseInt(s) - score) < Math.abs(parseInt(bestScore) - score)
        ? [s, mood]
        : [bestScore, bestMood]
    );
    return closest[1];
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (recentEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: 'rgba(34,18,73,0.72)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 28,
          backdropFilter: 'blur(24px)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
          📝 Recent Entries
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(184, 180, 216, 0.7)', margin: 0 }}>
          No entries yet. Log your first mood!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        background: 'rgba(34,18,73,0.72)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 28,
        backdropFilter: 'blur(24px)',
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
        📝 Recent Entries
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {recentEntries.map((entry, i) => {
            if (!entry.mood) return null;
            const moodLabel = getMoodLabel(entry.mood);
            const preview = entry.reflection
              ? entry.reflection.substring(0, 60) + (entry.reflection.length > 60 ? '...' : '')
              : 'No notes';

            return (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  background: `${moodLabel.color}12`,
                  border: `1px solid ${moodLabel.color}30`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                whileHover={{
                  background: `${moodLabel.color}1a`,
                  borderColor: `${moodLabel.color}50`,
                  y: -2,
                }}
              >
                {/* Mood emoji */}
                <div style={{ fontSize: 32, flexShrink: 0 }}>
                  {moodLabel.emoji}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                      {moodLabel.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        background: `${moodLabel.color}25`,
                        borderRadius: 6,
                        color: moodLabel.color,
                      }}
                    >
                      {Math.round((entry.mood / 10) * 100)}%
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.7)', marginBottom: 4 }}>
                    {formatDate(entry.date)}
                  </div>

                  {preview && (
                    <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)', fontStyle: 'italic' }}>
                      {preview}
                    </div>
                  )}
                </div>

                {/* Delete button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(entry.date)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'rgba(255, 59, 48, 0.2)',
                    color: '#FF3B30',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  Delete
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
