import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAchievementsStore = create(
  persist(
    (set) => ({
      unlockedAchievements: [],
      unlockAchievement: (achievementId) =>
        set((state) => {
          if (!state.unlockedAchievements.includes(achievementId)) {
            return { unlockedAchievements: [...state.unlockedAchievements, achievementId] };
          }
          return state;
        }),
      hasAchievement: (achievementId) => (state) => state.unlockedAchievements.includes(achievementId),
    }),
    { name: 'achievements-store' }
  )
);

export const ACHIEVEMENTS = {
  FIRST_MOOD: 'first_mood',
  FIRST_WEEK: 'first_week',
  SEVEN_DAY_STREAK: 'seven_day_streak',
  THIRTY_DAY_STREAK: 'thirty_day_streak',
  HUNDRED_MOOD_LOGS: 'hundred_mood_logs',
  FIRST_JOURNAL: 'first_journal',
  COMMUNITY_HELPER: 'community_helper',
  FIRST_CONNECTION: 'first_connection',
  CHALLENGE_CHAMPION: 'challenge_champion',
  GOLDEN_LOTUS: 'golden_lotus',
};

export const ACHIEVEMENT_DEFINITIONS = {
  [ACHIEVEMENTS.FIRST_MOOD]: {
    id: ACHIEVEMENTS.FIRST_MOOD,
    emoji: '😊',
    title: 'First Mood',
    description: 'Logged your first mood',
    rarity: 'common',
  },
  [ACHIEVEMENTS.FIRST_WEEK]: {
    id: ACHIEVEMENTS.FIRST_WEEK,
    emoji: '🌱',
    title: 'First Week',
    description: 'Completed your first week of self care',
    rarity: 'common',
  },
  [ACHIEVEMENTS.SEVEN_DAY_STREAK]: {
    id: ACHIEVEMENTS.SEVEN_DAY_STREAK,
    emoji: '🔥',
    title: '7 Day Streak',
    description: 'Logged mood for 7 consecutive days',
    rarity: 'uncommon',
  },
  [ACHIEVEMENTS.THIRTY_DAY_STREAK]: {
    id: ACHIEVEMENTS.THIRTY_DAY_STREAK,
    emoji: '🏆',
    title: '30 Day Streak',
    description: 'Logged mood for 30 consecutive days',
    rarity: 'rare',
  },
  [ACHIEVEMENTS.HUNDRED_MOOD_LOGS]: {
    id: ACHIEVEMENTS.HUNDRED_MOOD_LOGS,
    emoji: '💯',
    title: 'Centennial',
    description: 'Logged 100 moods',
    rarity: 'rare',
  },
  [ACHIEVEMENTS.FIRST_JOURNAL]: {
    id: ACHIEVEMENTS.FIRST_JOURNAL,
    emoji: '📖',
    title: 'First Journal',
    description: 'Wrote your first journal entry',
    rarity: 'common',
  },
  [ACHIEVEMENTS.COMMUNITY_HELPER]: {
    id: ACHIEVEMENTS.COMMUNITY_HELPER,
    emoji: '🤝',
    title: 'Community Helper',
    description: 'Helped 10 people in the community',
    rarity: 'uncommon',
  },
  [ACHIEVEMENTS.FIRST_CONNECTION]: {
    id: ACHIEVEMENTS.FIRST_CONNECTION,
    emoji: '💜',
    title: 'First Connection',
    description: 'Made your first meaningful connection',
    rarity: 'common',
  },
  [ACHIEVEMENTS.CHALLENGE_CHAMPION]: {
    id: ACHIEVEMENTS.CHALLENGE_CHAMPION,
    emoji: '⭐',
    title: 'Challenge Champion',
    description: 'Completed 10 challenges',
    rarity: 'uncommon',
  },
  [ACHIEVEMENTS.GOLDEN_LOTUS]: {
    id: ACHIEVEMENTS.GOLDEN_LOTUS,
    emoji: '🌸',
    title: 'Golden Lotus',
    description: 'Reached Level 5 personal growth',
    rarity: 'legendary',
  },
};
