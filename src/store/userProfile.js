import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserProfileStore = create(
  persist(
    (set) => ({
      // User data
      user: null,
      profile: null,

      // Saved content
      savedGuides: [],
      assessmentHistory: [],
      journeyProgress: {},

      // Preferences
      theme: 'dark',
      notifications: true,
      emailUpdates: false,

      // UI state
      isLoading: false,
      error: null,

      // Actions
      setUser(user) {
        set({ user });
      },

      setProfile(profile) {
        set({ profile });
      },

      setSavedGuides(guides) {
        set({ savedGuides: guides });
      },

      addSavedGuide(guide) {
        set((state) => ({
          savedGuides: [{ ...guide, savedAt: new Date() }, ...state.savedGuides],
        }));
      },

      removeSavedGuide(guideId) {
        set((state) => ({
          savedGuides: state.savedGuides.filter((g) => g.id !== guideId),
        }));
      },

      isSavedGuide(guideId) {
        return (state) => state.savedGuides.some((g) => g.id === guideId);
      },

      setAssessmentHistory(history) {
        set({ assessmentHistory: history });
      },

      addAssessmentResult(result) {
        set((state) => ({
          assessmentHistory: [{ ...result, completedAt: new Date() }, ...state.assessmentHistory],
        }));
      },

      setJourneyProgress(progress) {
        set({ journeyProgress: progress });
      },

      updateJourneyProgress(journeyId, step) {
        set((state) => ({
          journeyProgress: {
            ...state.journeyProgress,
            [journeyId]: {
              ...state.journeyProgress[journeyId],
              currentStep: step,
              lastAccessed: new Date(),
            },
          },
        }));
      },

      setTheme(theme) {
        set({ theme });
      },

      setNotifications(enabled) {
        set({ notifications: enabled });
      },

      setEmailUpdates(enabled) {
        set({ emailUpdates: enabled });
      },

      setIsLoading(loading) {
        set({ isLoading: loading });
      },

      setError(error) {
        set({ error });
      },

      clearError() {
        set({ error: null });
      },

      reset() {
        set({
          user: null,
          profile: null,
          savedGuides: [],
          assessmentHistory: [],
          journeyProgress: {},
        });
      },
    }),
    {
      name: 'user-profile-store',
      partialize: (state) => ({
        savedGuides: state.savedGuides,
        assessmentHistory: state.assessmentHistory,
        journeyProgress: state.journeyProgress,
        theme: state.theme,
        notifications: state.notifications,
        emailUpdates: state.emailUpdates,
      }),
    }
  )
);
