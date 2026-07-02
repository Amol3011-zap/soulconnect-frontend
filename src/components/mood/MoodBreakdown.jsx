import React from 'react';
import { motion } from 'motion/react';

export default function MoodBreakdown({ moodBreakdown }) {
  const MOODS = [
    { score: 1, emoji: '😭', label: 'Awful', color: '#EF4444' },
    { score: 3, emoji: '😔', label: 'Not Good', color: '#F97316' },
    { score: 5, emoji: '😐', label: 'Okay', color: '#F59E0B' },
    { score: 7, emoji: '🙂', label: 'Good', color: '#10B981' },
    { score: 9, emoji: '😁', label: 'Amazing', color: '#6D4AFF' },
  ];

  const total = Object.values(moodBreakdown).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
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
          📊 Mood Breakdown
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(184, 180, 216, 0.7)', margin: 0 }}>
          Log moods to see your distribution
        </p>
      </motion.div>
    );
  }

  const chartSize = 220;
  const radius = 70;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;

  let currentAngle = -Math.PI / 2;
  const slices = [];
  const labels = [];

  MOODS.forEach(mood => {
    const count = moodBreakdown[mood.score] || 0;
    if (count === 0) return;

    const sliceAngle = (count / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    slices.push({
      pathD,
      color: mood.color,
      count,
      score: mood.score,
    });

    const labelRadius = radius * 0.65;
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);

    labels.push({
      x: labelX,
      y: labelY,
      emoji: mood.emoji,
      count,
      percentage: Math.round((count / total) * 100),
    });

    currentAngle = endAngle;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      style={{
        background: 'rgba(34,18,73,0.72)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 28,
        backdropFilter: 'blur(24px)',
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
        📊 Mood Breakdown
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
        {/* Donut Chart */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`} style={{ overflow: 'visible' }}>
            {slices.map((slice, i) => (
              <motion.path
                key={i}
                d={slice.pathD}
                fill={slice.color}
                fillOpacity="0.8"
                stroke={slice.color}
                strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              />
            ))}

            {/* Center circle (donut hole) */}
            <circle cx={centerX} cy={centerY} r={40} fill="#0B0618" />

            {/* Labels on chart */}
            {labels.map((label, i) => (
              <motion.g
                key={`label-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.4 }}
              >
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="20"
                  fontWeight="600"
                >
                  {label.emoji}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOODS.map((mood, i) => {
            const count = moodBreakdown[mood.score] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <motion.div
                key={mood.score}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: count > 0 ? `${mood.color}1a` : 'transparent',
                  borderRadius: 10,
                  border: count > 0 ? `1px solid ${mood.color}40` : '1px solid transparent',
                }}
              >
                <div style={{ fontSize: 18 }}>{mood.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
                    {mood.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.7)' }}>
                    {count} entries
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: mood.color,
                    minWidth: '40px',
                    textAlign: 'right',
                  }}
                >
                  {pct}%
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
