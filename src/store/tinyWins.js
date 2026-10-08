import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { selectDailyWins, getRandomReflection } from '../engine/tinyWinsEngine';
import { useAuthStore } from './auth';

/* The person's primary and secondary problems, chosen at signup. Read lazily
   from the auth store so tiny wins stay curated to what they are carrying. */
function getStruggles() {
  try {
    const u = useAuthStore.getState().user || {};
    return [u.primary_problem, ...(u.secondary_problems || [])].filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Local-calendar-day string, e.g. '2026-09-21'.
 *
 * Deliberately NOT `new Date().toISOString().split('T')[0]` — that reads the
 * UTC day, so for users ahead of UTC (e.g. India, UTC+5:30) "today" would
 * flip several hours before their actual local midnight. Uses the Date
 * object's local getters instead, so the day boundary matches the device's
 * own clock/timezone.
 */
export function todayString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const useTinyWinsStore = create(
  persist(
    (set, get) => ({
      // ── User Preferences ──────────────────────────────────
      workMode: 'office',         // 'office'|'remote'|'student'|'travel'|'weekend'|'retired'|'custom'
      preferences: {
        categories: [],           // [] = all categories
        difficulty: 'all',        // 'all'|'easy'|'medium'
      },
      paused: false,

      // ── Daily State ───────────────────────────────────────
      dailyWins: [],              // [challenge, challenge, challenge] - today's 3
      dailyDate: null,            // 'YYYY-MM-DD' when daily wins were last generated

      // ── Completion State ──────────────────────────────────
      completedToday: [],         // [challengeId, ...] completed today
      skippedToday: [],           // [challengeId, ...] skipped today

      // ── History ───────────────────────────────────────────
      // Array of { id, challengeId, title, category, date, completedAt }
      completionHistory: [],

      // ── Favorites ─────────────────────────────────────────
      favorites: [],              // [challengeId, ...]

      // ── Healing Tree ──────────────────────────────────────
      totalWins: 0,               // lifetime completed count

      // ── Reflection UI ────────────────────────────────────
      showReflection: false,
      reflectionText: '',
      showMilestone: false,
      milestoneData: null,        // { icon, label }

      // ─────────────────────────────────────────────────────
      // Actions
      // ─────────────────────────────────────────────────────

      /** Generate or refresh daily wins. Call this on app load. */
      checkAndRefresh: (weatherId = 'clear-sky') => {
        const state = get();
        const today = todayString();

        // Already generated for today
        if (state.dailyDate === today && state.dailyWins.length === 3) return;

        // Get recently completed IDs (last 21 = last ~7 days × 3/day)
        const recentlyCompletedIds = state.completionHistory
          .slice(-21)
          .map(h => h.challengeId);

        const wins = selectDailyWins({
          weatherId,
          workMode: state.workMode,
          struggles: getStruggles(),
          recentlyCompletedIds,
          completedTodayIds: [],
        });

        set({
          dailyWins: wins,
          dailyDate: today,
          completedToday: [],
          skippedToday: [],
        });
      },

      /** Complete a Tiny Win */
      completeWin: (challengeId) => {
        const state = get();
        if (state.completedToday.includes(challengeId)) return;

        const challenge = state.dailyWins.find(w => w.id === challengeId);
        if (!challenge) return;

        const reflection = getRandomReflection();
        const newTotal = state.totalWins + 1;

        // Check for milestone
        let showMilestone = false;
        let milestoneData = null;
        const MILESTONES = [25, 100, 250, 500];
        if (MILESTONES.includes(newTotal)) {
          showMilestone = true;
          const icons = { 25: '🌿', 100: '🌸', 250: '🦋', 500: '🪷' };
          const labels = { 25: 'New Leaf', 100: 'Flower', 250: 'Butterfly', 500: 'Golden Lotus' };
          milestoneData = { icon: icons[newTotal], label: labels[newTotal], total: newTotal };
        }

        const historyEntry = {
          id: `${challengeId}-${Date.now()}`,
          challengeId,
          title: challenge.title,
          category: challenge.category,
          date: todayString(),
          completedAt: new Date().toISOString(),
        };

        set({
          completedToday: [...state.completedToday, challengeId],
          completionHistory: [...state.completionHistory, historyEntry],
          totalWins: newTotal,
          showReflection: true,
          reflectionText: reflection,
          showMilestone,
          milestoneData,
        });
      },

      /** Skip a Tiny Win */
      skipWin: (challengeId) => {
        const state = get();
        if (!state.skippedToday.includes(challengeId)) {
          set({ skippedToday: [...state.skippedToday, challengeId] });
        }
      },

      /** Toggle favorite */
      toggleFavorite: (challengeId) => {
        const state = get();
        const isFav = state.favorites.includes(challengeId);
        set({
          favorites: isFav
            ? state.favorites.filter(id => id !== challengeId)
            : [...state.favorites, challengeId],
        });
      },

      /** Update work mode */
      setWorkMode: (mode) => set({ workMode: mode }),

      /** Pause / unpause */
      setPaused: (val) => set({ paused: val }),

      /** Dismiss reflection */
      dismissReflection: () => set({ showReflection: false, reflectionText: '' }),

      /** Dismiss milestone */
      dismissMilestone: () => set({ showMilestone: false, milestoneData: null }),

      /** Get weekly stats */
      getWeeklyStats: () => {
        const state = get();
        const today = new Date();
        const last7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          return todayString(d);
        });

        const weekHistory = state.completionHistory.filter(h => last7.includes(h.date));
        const byCategory = {};
        weekHistory.forEach(h => {
          byCategory[h.category] = (byCategory[h.category] || 0) + 1;
        });

        const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
        return {
          total: weekHistory.length,
          mostCompleted: sortedCats[0]?.[0] || null,
          leastCompleted: sortedCats[sortedCats.length - 1]?.[0] || null,
          byCategory,
          daily: last7.map(date => ({
            date,
            count: weekHistory.filter(h => h.date === date).length,
          })).reverse(),
        };
      },
    }),
    {
      name: 'tiny-wins-store',
      partialize: (state) => ({
        workMode: state.workMode,
        preferences: state.preferences,
        paused: state.paused,
        dailyWins: state.dailyWins,
        dailyDate: state.dailyDate,
        completedToday: state.completedToday,
        skippedToday: state.skippedToday,
        completionHistory: state.completionHistory,
        favorites: state.favorites,
        totalWins: state.totalWins,
      }),
      // v1: dailyDate/completionHistory[].date switched from UTC to local
      // calendar day (see todayString() above). Force exactly one clean
      // regeneration on first load post-deploy by clearing the stored
      // dailyDate, rather than guessing at a UTC->local conversion for a
      // value that only matters for "is this still today". Historical
      // completionHistory entries are left untouched — their old UTC-day
      // strings just age out of the 7-day weekly-stats window naturally,
      // no destructive rewrite needed.
      version: 1,
      migrate: (persistedState, version) => {
        if (version < 1 && persistedState) {
          return { ...persistedState, dailyDate: null };
        }
        return persistedState;
      },
    }
  )
);
