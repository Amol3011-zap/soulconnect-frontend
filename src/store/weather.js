import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getToday,
  saveEntry,
  getHistory,
  getWeekly,
  getStreak,
  generateMockHistory,
} from '../services/MockWeatherAPI';

export const useWeatherStore = create(
  persist(
    (set, get) => ({
      todayEntry: null,
      history: [],
      weeklyData: [],
      streak: 0,
      showModal: false,
      historyOpen: false,

      // Load today's entry + all supporting data. Show modal if no entry today.
      checkTodayAndInit: (userId) => {
        if (!userId) return;
        try {
          generateMockHistory(userId);
          const todayEntry = getToday(userId);
          const history = getHistory(userId, 30);
          const weeklyData = getWeekly(userId);
          const streak = getStreak(userId);
          set({
            todayEntry,
            history,
            weeklyData,
            streak,
            showModal: !todayEntry,
          });
        } catch (err) {
          console.error('[WeatherStore] checkTodayAndInit error:', err);
        }
      },

      // Save a weather check-in
      submitWeather: (weatherId, userId) => {
        try {
          const entry = saveEntry(weatherId, userId);
          const history = getHistory(userId, 30);
          const weeklyData = getWeekly(userId);
          const streak = getStreak(userId);
          set({
            todayEntry: entry,
            history,
            weeklyData,
            streak,
            showModal: false,
          });
        } catch (err) {
          console.error('[WeatherStore] submitWeather error:', err);
        }
      },

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
