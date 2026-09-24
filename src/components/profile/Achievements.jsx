import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useAchievementsStore, ACHIEVEMENT_DEFINITIONS, ACHIEVEMENTS } from '../../store/achievements';
import { useMoodData } from '../../hooks/useMoodData';
import { useWeatherStore } from '../../store/weather';
import { useTinyWinsStore } from '../../store/tinyWins';
import { useStoriesStore } from '../../store/stories';

export default function Achievements({ onViewAll }) {
  const { unlockedAchievements, unlockAchievement } = useAchievementsStore();
  const { allEntries } = useMoodData();
  const { streak, longestStreak } = useWeatherStore();
  const { totalWins } = useTinyWinsStore();
  const { userStories } = useStoriesStore();

  // Auto-unlock achievements based on criteria
  useEffect(() => {
    const totalMoods = allEntries.filter(e => e.mood).length;

    // First Mood
    if (totalMoods >= 1 && !unlockedAchievements.includes(ACHIEVEMENTS.FIRST_MOOD)) {
      unlockAchievement(ACHIEVEMENTS.FIRST_MOOD);
    }

    // First Week (7 mood entries)
    if (totalMoods >= 7 && !unlockedAchievements.includes(ACHIEVEMENTS.FIRST_WEEK)) {
      unlockAchievement(ACHIEVEMENTS.FIRST_WEEK);
    }

    // 7 Day Streak
    if (streak >= 7 && !unlockedAchievements.includes(ACHIEVEMENTS.SEVEN_DAY_STREAK)) {
      unlockAchievement(ACHIEVEMENTS.SEVEN_DAY_STREAK);
    }

    // 30 Day Streak
    if (streak >= 30 && !unlockedAchievements.includes(ACHIEVEMENTS.THIRTY_DAY_STREAK)) {
      unlockAchievement(ACHIEVEMENTS.THIRTY_DAY_STREAK);
    }

    // 100 Mood Logs
    if (totalMoods >= 100 && !unlockedAchievements.includes(ACHIEVEMENTS.HUNDRED_MOOD_LOGS)) {
      unlockAchievement(ACHIEVEMENTS.HUNDRED_MOOD_LOGS);
    }

    // First Journal
    if (userStories.length >= 1 && !unlockedAchievements.includes(ACHIEVEMENTS.FIRST_JOURNAL)) {
      unlockAchievement(ACHIEVEMENTS.FIRST_JOURNAL);
    }

    // Community Helper (10 people helped)
    if (totalWins >= 10 && !unlockedAchievements.includes(ACHIEVEMENTS.COMMUNITY_HELPER)) {
      unlockAchievement(ACHIEVEMENTS.COMMUNITY_HELPER);
    }

    // First Connection
    if (totalWins >= 1 && !unlockedAchievements.includes(ACHIEVEMENTS.FIRST_CONNECTION)) {
      unlockAchievement(ACHIEVEMENTS.FIRST_CONNECTION);
    }

    // Challenge Champion (10 challenges)
    if (totalWins >= 10 && !unlockedAchievements.includes(ACHIEVEMENTS.CHALLENGE_CHAMPION)) {
      unlockAchievement(ACHIEVEMENTS.CHALLENGE_CHAMPION);
    }

    // Golden Lotus (reached level 5)
    if (longestStreak >= 30 && !unlockedAchievements.includes(ACHIEVEMENTS.GOLDEN_LOTUS)) {
      unlockAchievement(ACHIEVEMENTS.GOLDEN_LOTUS);
    }
  }, [allEntries, streak, longestStreak, totalWins, userStories, unlockedAchievements, unlockAchievement]);

  const displayBadges = unlockedAchievements
    .slice(0, 4)
    .map(id => ACHIEVEMENT_DEFINITIONS[id])
    .filter(Boolean);

  const moreCount = Math.max(0, unlockedAchievements.length - 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E7E3EF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        backdropFilter: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#171642', margin: 0 }}>
          Achievements
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          style={{
            fontSize: 12,
            color: '#5E47B8',
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

      {displayBadges.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#69677D', fontSize: 12 }}>
          Start logging your mood to unlock achievements! 🎉
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10 }}>
          {displayBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
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
                background: '#EFEAFB',
                borderRadius: 16,
                border: '1px solid #E7E3EF',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32 }}>{badge.emoji}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#171642', lineHeight: 1.3 }}>
                  {badge.title}
                </div>
                <div style={{ fontSize: 10, color: '#69677D', marginTop: 2, lineHeight: 1.2 }}>
                  {badge.description}
                </div>
              </div>
            </motion.div>
          ))}

          {moreCount > 0 && (
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
                background: '#EFEAFB',
                borderRadius: 16,
                border: '1px solid #E7E3EF',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: '#5E47B8' }}>+{moreCount}</div>
              <div style={{ fontSize: 10, color: '#69677D' }}>More</div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
