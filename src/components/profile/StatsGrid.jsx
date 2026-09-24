import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTinyWinsStore } from '../../store/tinyWins';
import { useStoriesStore } from '../../store/stories';
import { useMoodData } from '../../hooks/useMoodData';

function AnimatedCounter({ value, duration = 1 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = typeof value === 'number' ? value : 0;
    if (target === 0) {
      setCount(0);
      return;
    }

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

export default function StatsGrid() {
  const { totalWins } = useTinyWinsStore();
  const { userStories } = useStoriesStore();
  const { allEntries } = useMoodData();

  // Calculate stats from real data
  const journalEntries = userStories.length;
  const peopleHelped = Math.floor(totalWins * 0.5) || 0; // Mock calculation
  const connections = 8; // Would come from connections store
  const totalMoodEntries = allEntries.filter(e => e.mood).length;
  const averageMood = totalMoodEntries > 0
    ? Math.round(
        allEntries
          .filter(e => e.mood)
          .reduce((sum, e) => sum + e.mood, 0) / totalMoodEntries
      )
    : 0;

  const stats = [
    { icon: '🌱', label: 'Tiny Wins', value: totalWins },
    { icon: '📖', label: 'Journal Entries', short: 'Journal', value: journalEntries },
    { icon: '🤝', label: 'People Helped', short: 'Helped', value: peopleHelped },
    { icon: '💜', label: 'Meaningful Connections', short: 'Connections', value: connections },
  ];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      background: '#FFFFFF', border: '1px solid #E7E3EF', borderRadius: 20,
      padding: '14px 8px', marginBottom: 16,
      boxShadow: '0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04)',
    }}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            textAlign: 'center', padding: '0 4px',
            borderLeft: i === 0 ? 'none' : '1px solid #EFEBF7',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#171642', lineHeight: 1.2 }}>
            <AnimatedCounter value={stat.value} />
          </div>
          <div style={{ fontSize: 12, color: '#69677D', lineHeight: 1.3, marginTop: 2 }}>
            {stat.short || stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}