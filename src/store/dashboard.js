import { create } from 'zustand';
import { dashboardAPI } from '../services/api';

const DEMO_STATS = {
  healing_streak:   { current: 0,   best: 0 },
  souls_healing:    { count: 847 },
  soul_points:      { total: 0, level: 1, next_level: 2, progress_pct: 0, points_to_next: 100 },
  healing_sessions: { this_week: 0, weekly_change: 0, change_display: '0' },
};

export const useDashboardStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────────────────────
  stats: null,
  loading: false,
  error: null,
  lastFetched: null,   // timestamp — avoid re-fetching within 60 seconds

  // ── Actions ───────────────────────────────────────────────────────────────
  fetchStats: async () => {
    const { loading, lastFetched } = get();
    if (loading) return;
    if (lastFetched && Date.now() - lastFetched < 60_000) return;

    set({ loading: true, error: null });
    try {
      const res = await dashboardAPI.getStats();
      set({ stats: res.data, lastFetched: Date.now(), loading: false });
    } catch (err) {
      set({ error: err?.message || 'Failed to load stats', loading: false });
    }
  },

  // Refresh live count only (lightweight — no auth needed)
  refreshLive: async () => {
    try {
      const res = await dashboardAPI.getLive();
      set(state => ({
        stats: state.stats ? {
          ...state.stats,
          souls_healing: { count: res.data.souls_healing_now },
        } : state.stats,
      }));
    } catch {}
  },

  getDisplayStats: () => get().stats || DEMO_STATS,

  invalidate: () => set({ lastFetched: null }),
  clearError: () => set({ error: null }),
}));
