import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

function AnimatedCounter({ value, duration = 1 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = typeof value === 'number' ? value : 0;
    if (target === 0) return;

    let current = 0;
    const increment = target / (duration * 60);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [value, duration]);

  return <>{count}</>;
}

export default function StatsGrid({ totalWins = 12, journalEntries = 34, peopleHelped = 19, connections = 8 }) {
  const stats = [
    { icon: '🌱', label: 'Tiny Wins', value: totalWins },
    { icon: '📖', label: 'Journal Entries', value: journalEntries },
    { icon: '🤝', label: 'People Helped', value: peopleHelped },
    { icon: '💜', label: 'Meaningful Connections', value: connections },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(124, 58, 237, 0.2)' }}
          style={{
            background: 'rgba(34, 18, 73, 0.72)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 20,
            padding: 16,
            textAlign: 'center',
            backdropFilter: 'blur(24px)',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            <AnimatedCounter value={stat.value} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.7)', lineHeight: 1.3 }}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
