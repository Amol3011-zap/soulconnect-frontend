import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { challengesAPI } from '../services/api';

export const useChallengesStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      data: null,           // full today response from API
      loading: false,
      completing: null,     // challenge_id currently being completed
      error: null,
      lastFetched: null,    // timestamp — avoid re-fetching within 30s

      // ── Actions ────────────────────────────────────────────────────────────
      fetchToday: async () => {
        const { lastFetched, loading } = get();
        if (loading) return;
        // Cache: don't re-fetch if loaded within last 30 seconds
        if (lastFetched && Date.now() - lastFetched < 30_000) return;

        set({ loading: true, error: null });
        try {
          const res = await challengesAPI.getToday();
          set({ data: res.data, lastFetched: Date.now(), loading: false });
        } catch (err) {
          set({ error: err?.message || 'Failed to load challenges', loading: false });
        }
      },

      completeChallenge: async (challengeId, actualDuration = null) => {
        const { data } = get();
        if (!data) return;

        set({ completing: challengeId, error: null });
        try {
          const res = await challengesAPI.complete(challengeId, actualDuration);
          const result = res.data;

          set(state => ({
            completing: null,
            data: state.data ? {
              ...state.data,
              challenges: state.data.challenges.map(c =>
                c.id === challengeId ? { ...c, completed: true } : c
              ),
              completed: state.data.completed + 1,
              current_streak: result.current_streak,
              longest_streak: result.longest_streak,
              total_points: result.total_earned,
              points_earned_today: state.data.points_earned_today + result.total_points,
              points_remaining: Math.max(0, state.data.points_remaining - result.total_points),
            } : null,
          }));

          return { success: true, result };
        } catch (err) {
          set({ completing: null, error: err?.message || 'Failed to complete challenge' });
          return { success: false, error: err };
        }
      },

      clearError: () => set({ error: null }),
      invalidate: () => set({ lastFetched: null }),  // force re-fetch next time
    }),
    {
      name: 'challenges-store',
      // Only persist the challenge data and streak info, not loading states
      partialize: (state) => ({
        data: state.data,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
