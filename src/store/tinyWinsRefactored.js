import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TINY_WINS_DATABASE, getTodaysChallenges } from '../data/tinyWinsDatabase';

function todayString() {
  return new Date().toISOString().split('T')[0];
}

function getMidnightMs() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
}

export const useTinyWinsRefactoredStore = create(
  persist(
    (set, get) => ({
      // Daily session
      dailySession: null,
      lastGeneratedDate: null,
      recentChallengeIds: [],

      // Streak
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,

      // History
      completionHistory: [],
      totalWins: 0,

      // Initialize or refresh daily
      initializeDailySession: (weatherId = 'clear-sky') => {
        const state = get();
        const today = todayString();

        if (state.lastGeneratedDate === today && state.dailySession) {
          return;
        }

        const challengeIds = getTodaysChallenges(weatherId, state.recentChallengeIds);
        const challenges = TINY_WINS_DATABASE.filter(c => challengeIds.includes(c.id));

        set({
          dailySession: {
            date: today,
            generatedAt: new Date().toISOString(),
            challengeIds,
            challenges,
            completedChallengeIds: [],
            completedAt: null,
            mood: weatherId,
          },
          lastGeneratedDate: today,
        });
      },

      // Complete a challenge
      completeChallenge: (challengeId) => {
        const state = get();
        if (!state.dailySession) return;

        const alreadyCompleted = state.dailySession.completedChallengeIds.includes(challengeId);
        if (alreadyCompleted) return;

        const challenge = state.dailySession.challenges.find(c => c.id === challengeId);
        if (!challenge) return;

        const updatedCompletedIds = [...state.dailySession.completedChallengeIds, challengeId];
        const isAllDone = updatedCompletedIds.length === 3;

        const historyEntry = {
          id: `${challengeId}-${Date.now()}`,
          challengeId,
          title: challenge.title,
          category: challenge.category,
          date: state.dailySession.date,
          completedAt: new Date().toISOString(),
        };

        set({
          dailySession: {
            ...state.dailySession,
            completedChallengeIds: updatedCompletedIds,
            completedAt: isAllDone ? new Date().toISOString() : null,
          },
          completionHistory: [...state.completionHistory, historyEntry],
          totalWins: state.totalWins + 1,
        });

        // Update streak if all done
        if (isAllDone) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          const wasYesterdayDone = state.completionHistory.some(
            entry => entry.date === yesterdayStr
          );

          let newStreak = state.currentStreak + 1;
          if (!wasYesterdayDone && state.currentStreak > 0) {
            newStreak = 1;
          }

          set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            lastCompletedDate: state.dailySession.date,
          });
        }
      },

      // Get countdown to next Tiny Wins
      getCountdownToNext: () => {
        const remaining = getMidnightMs();
        const totalSeconds = Math.floor(remaining / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { hours, minutes, seconds, totalMs: remaining };
      },

      // Get stats
      getStats: () => {
        const state = get();
        const today = todayString();

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);
        const weekStartStr = weekStart.toISOString().split('T')[0];

        const thisWeek = state.completionHistory.filter(
          entry => entry.date >= weekStartStr
        );

        const categoryCount = {};
        thisWeek.forEach(entry => {
          categoryCount[entry.category] = (categoryCount[entry.category] || 0) + 1;
        });

        const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);

        // Completion percentage
        const totalDays = new Set(state.completionHistory.map(h => h.date)).size;
        const completionPercentage = totalDays > 0 ? Math.round((totalDays / 30) * 100) : 0;

        return {
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          totalWins: state.totalWins,
          thisWeekWins: thisWeek.length,
          activeDays: new Set(state.completionHistory.map(h => h.date)).size,
          favoriteCategory: sortedCategories[0]?.[0] || null,
          completionPercentage,
          weekData: Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const count = thisWeek.filter(h => h.date === dateStr).length;
            return { date: dateStr, count, label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d.getDay()] };
          }),
        };
      },

      // Get daily progress
      getDailyProgress: () => {
        const state = get();
        if (!state.dailySession) return { completed: 0, total: 3 };

        return {
          completed: state.dailySession.completedChallengeIds.length,
          total: state.dailySession.challenges.length,
          isComplete: state.dailySession.completedChallengeIds.length === 3,
        };
      },

      // Reset daily session (for testing/debugging)
      resetDaily: () => {
        set({
          dailySession: null,
          lastGeneratedDate: null,
        });
      },
    }),
    {
      name: 'tiny-wins-refactored',
      partialize: (state) => ({
        dailySession: state.dailySession,
        lastGeneratedDate: state.lastGeneratedDate,
        recentChallengeIds: state.recentChallengeIds,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastCompletedDate: state.lastCompletedDate,
        completionHistory: state.completionHistory,
        totalWins: state.totalWins,
      }),
    }
  )
);
