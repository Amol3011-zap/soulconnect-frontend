import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { WEATHERS } from './EmotionWeatherModal';

function generateInsights(history) {
  if (!history || history.length === 0) {
    return [
      'Start checking in daily to unlock personalized AI insights.',
      'Your emotional patterns will appear here after a few days.',
      'Consistency is the key to understanding your inner weather.',
    ];
  }

  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - 6);
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 13);

  const thisWeek = history.filter(e => new Date(e.date) >= thisWeekStart);
  const lastWeek = history.filter(e => {
    const d = new Date(e.date);
    return d >= lastWeekStart && d < thisWeekStart;
  });

  const positiveWeathers = new Set(['clear-sky', 'hope', 'blooming']);
  const negativeWeathers = new Set(['heavy-rain', 'storm', 'fog']);

  // Insight 1: Most frequent weather this week
  const freq = {};
  thisWeek.forEach(e => { freq[e.weather] = (freq[e.weather] || 0) + 1; });
  const topWeather = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  let insight1;
  if (topWeather) {
    const w = WEATHERS[topWeather[0]];
    const isPositive = positiveWeathers.has(topWeather[0]);
    insight1 = isPositive
      ? `This week you've been feeling "${w?.label || topWeather[0]}" most often — a beautiful sign of emotional growth.`
      : `"${w?.label || topWeather[0]}" has been your dominant feeling this week. Remember: all weather passes.`;
  } else {
    insight1 = 'Check in more consistently to reveal your weekly emotional pattern.';
  }

  // Insight 2: Compare to last week
  const thisPositive = thisWeek.filter(e => positiveWeathers.has(e.weather)).length;
  const lastPositive = lastWeek.filter(e => positiveWeathers.has(e.weather)).length;
  let insight2;
  if (thisWeek.length === 0) {
    insight2 = 'No data for this week yet. Your first check-in is the most important step.';
  } else if (lastWeek.length === 0) {
    insight2 = 'Great start! Keep checking in to compare your week-over-week progress.';
  } else if (thisPositive > lastPositive) {
    insight2 = `You're having ${thisPositive - lastPositive} more positive days than last week. Your healing is showing! 🌱`;
  } else if (thisPositive < lastPositive) {
    insight2 = 'This week feels harder than last — and that\'s okay. Every storm nurtures growth beneath the surface.';
  } else {
    insight2 = 'Your emotional rhythm has been steady this week. Consistency in checking in builds self-awareness.';
  }

  // Insight 3: Weekend pattern
  const weekendEntries = history.filter(e => {
    const day = new Date(e.date).getDay();
    return day === 0 || day === 6; // Sun or Sat
  });
  const weekendPositive = weekendEntries.filter(e => positiveWeathers.has(e.weather)).length;
  const weekendNegative = weekendEntries.filter(e => negativeWeathers.has(e.weather)).length;
  let insight3;
  if (weekendEntries.length < 2) {
    insight3 = 'Weekend data is still building. Check in on weekends to reveal your rest-day patterns.';
  } else if (weekendPositive > weekendNegative) {
    insight3 = 'You tend to feel brighter on weekends — rest and freedom clearly nourish your soul. 🌸';
  } else if (weekendNegative > weekendPositive) {
    insight3 = 'Weekends can feel heavier sometimes. Consider a gentle weekend ritual to ease the transition.';
  } else {
    insight3 = 'Your emotional weather is consistent across weekdays and weekends — a sign of inner stability.';
  }

  return [insight1, insight2, insight3];
}

export default function AIInsightCard({ history }) {
  const insights = useMemo(() => generateInsights(history), [history]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        borderRadius: 20,
        padding: '24px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
          boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
        }}
          aria-hidden="true"
        >
          ✦
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>AI Insights</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Personalized patterns from your check-ins</div>
        </div>
      </div>

      {/* Insights list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Purple bullet dot */}
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
              flexShrink: 0,
              marginTop: 5,
              boxShadow: '0 0 8px rgba(168,85,247,0.5)',
            }}
              aria-hidden="true"
            />
            <p style={{
              margin: 0,
              fontSize: 13,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.6,
            }}>
              {insight}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 16,
        paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ fontSize: 12 }} aria-hidden="true">⚡</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
          Powered by SoulConnect AI
        </span>
      </div>
    </motion.div>
  );
}
