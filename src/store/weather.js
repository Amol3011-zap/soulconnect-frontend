import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getToday,
  saveEntry,
  getHistory,
  getWeekly,
  getStreak,
  generateMockHistory,
  localDateKey,
} from '../services/MockWeatherAPI';
import { soulClimateAPI } from '../services/api';
import { SOUL_CLIMATE_SERVER } from '../config/FEATURE_FLAGS';
import { recordSoulClimateMood } from '../hooks/useMoodData';

// The user's IANA timezone (e.g. "Asia/Kolkata"); the server computes the
// calendar day from it.
export const userTimezone = () => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; }
};

// todayEntry only counts if it belongs to this user and to today's LOCAL date.
export const isCheckedInToday = (entry, userId) =>
  Boolean(entry && entry.date === localDateKey() && (entry.userId == null || entry.userId === userId));

export const useWeatherStore = create(
  persist(
    (set, get) => ({
      todayEntry: null,
      history: [],
      weeklyData: [],
      streak: 0,
      showModal: false,
      historyOpen: false,

      // Load today's entry + supporting local data. The daily check-in now
      // lives in the Home Soul Climate card, so nothing opens automatically.
      checkTodayAndInit: (userId) => {
        if (!userId) return;
        try {
          generateMockHistory(userId);
          const local = getToday(userId);
          const current = get().todayEntry;
          set({
            todayEntry: local || (isCheckedInToday(current, userId) ? current : null),
            history: getHistory(userId, 30),
            weeklyData: getWeekly(userId),
            streak: getStreak(userId),
            showModal: false,
          });
        } catch (err) {
          console.error('[WeatherStore] checkTodayAndInit error:', err);
        }
      },

      // Server is the source of truth when enabled: refresh today's state
      // (another device, logout/login, a new local day).
      syncToday: async (userId) => {
        if (!SOUL_CLIMATE_SERVER || !userId) return;
        try {
          const res = await soulClimateAPI.getToday(userTimezone());
          if (res.checked_in) {
            const entry = { id: 'server', date: res.local_date, weather: res.weather, userId, time: null };
            set({ todayEntry: entry });
          } else if (isCheckedInToday(get().todayEntry, userId)) {
            set({ todayEntry: null });
          }
        } catch {
          /* keep what we have; the card still works */
        }
      },

      // The one daily check-in. Resolves { ok, entry } or { ok: false, message }.
      checkIn: async (weatherId, userId) => {
        const existing = get().todayEntry;
        if (isCheckedInToday(existing, userId)) return { ok: true, entry: existing };

        let entry;
        if (SOUL_CLIMATE_SERVER) {
          try {
            const res = await soulClimateAPI.checkIn(weatherId, userTimezone());
            entry = { id: 'server', date: res.local_date, weather: res.weather, userId, time: null };
          } catch (err) {
            if (err?.type === 'already_checked_in' && err.entry?.weather) {
              entry = { id: 'server', date: err.entry.local_date, weather: err.entry.weather, userId, time: null };
            } else {
              return { ok: false, message: err?.message || "Couldn't save your check-in. Please try again." };
            }
          }
        }
        try {
          // Local copy keeps the history widgets and streak working.
          const local = getToday(userId) || saveEntry(entry?.weather || weatherId, userId);
          entry = entry || local;
          recordSoulClimateMood(entry.weather);
          set({
            todayEntry: entry,
            history: getHistory(userId, 30),
            weeklyData: getWeekly(userId),
            streak: getStreak(userId),
            showModal: false,
          });
          return { ok: true, entry };
        } catch (err) {
          console.error('[WeatherStore] checkIn error:', err);
          return { ok: false, message: "Couldn't save your check-in. Please try again." };
        }
      },

      // Legacy entry point (EmotionWeatherModal): same once-per-day rule.
      submitWeather: (weatherId, userId) => { get().checkIn(weatherId, userId); },

      openHistory: () => set({ historyOpen: true }),
      closeHistory: () => set({ historyOpen: false }),
      dismissModal: () => set({ showModal: false }),
    }),
    {
      name: 'weather-store',
      partialize: (state) => ({
        todayEntry: state.todayEntry,
        streak: state.streak,
      }),
    }
  )
);
