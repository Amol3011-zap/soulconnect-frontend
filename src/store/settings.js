import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Privacy & Safety
      privateProfile: false,
      hideOnlineStatus: false,
      hideLastSeen: false,
      allowFriendRequests: true,
      allowDirectMessages: true,
      blockedUsers: [],

      // Emotional Safety
      hideTriggeringTopics: false,
      safeMode: false,
      anonymousMode: false,
      pauseFriendRequests: false,
      pauseConversations: false,
      reduceNotifications: false,
      hideDisturbingStories: false,
      showBreathingExerciseFirst: true,
      showCrisisResources: true,
      triggerTopics: [],

      // Notifications
      pushNotifications: true,
      emailNotifications: true,
      moodReminder: true,
      journalReminder: true,
      breathingReminder: true,
      challengeReminder: true,
      messageNotifications: true,
      friendRequestNotifications: true,
      communityReplyNotifications: true,
      weeklyReport: true,
      monthlyReport: true,
      reminderTime: '09:00',

      // Mood Tracker
      dailyMoodReminder: true,
      moodReminderTime: '09:00',
      moodScale: 'emoji', // emoji or numeric
      weeklyMoodSummary: true,
      monthlyMoodSummary: true,

      // Journal
      autoSaveJournal: true,
      journalLock: false,
      journalBiometricLock: false,

      // Community
      whoCanMessage: 'friends', // friends | followers | everyone
      whoCanViewProfile: 'friends', // friends | followers | everyone | anonymous
      whoCanViewMood: 'friends',
      whoCanViewJournal: 'private', // private | friends
      whoCanTagMe: 'friends',

      // Appearance
      darkMode: true,
      accentColor: '#7C3AED',
      fontSize: 'normal', // small | normal | large
      reduceMotion: false,
      highContrast: false,
      compactMode: false,

      // Language & Localization
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      weekStartsOn: 'sunday', // sunday | monday

      // Security
      twoFactorEnabled: false,
      passkeysEnabled: false,
      trustedDevices: [],
      activeSessions: [],

      // Actions
      updateSetting: (key, value) => set({ [key]: value }),

      updateSettings: (settings) => set(settings),

      togglePrivateProfile: () => set((s) => ({ privateProfile: !s.privateProfile })),

      toggleNotifications: (type) =>
        set((s) => ({
          [type]: !s[type],
        })),

      addBlockedUser: (userId) =>
        set((s) => ({
          blockedUsers: [...new Set([...s.blockedUsers, userId])],
        })),

      removeBlockedUser: (userId) =>
        set((s) => ({
          blockedUsers: s.blockedUsers.filter((id) => id !== userId),
        })),

      addTriggerTopic: (topic) =>
        set((s) => ({
          triggerTopics: [...new Set([...s.triggerTopics, topic])],
        })),

      removeTriggerTopic: (topic) =>
        set((s) => ({
          triggerTopics: s.triggerTopics.filter((t) => t !== topic),
        })),

      reset: () =>
        set({
          privateProfile: false,
          hideOnlineStatus: false,
          hideLastSeen: false,
          allowFriendRequests: true,
          allowDirectMessages: true,
          blockedUsers: [],
          hideTriggeringTopics: false,
          safeMode: false,
          anonymousMode: false,
          pauseFriendRequests: false,
          pauseConversations: false,
          reduceNotifications: false,
          hideDisturbingStories: false,
          showBreathingExerciseFirst: true,
          showCrisisResources: true,
          triggerTopics: [],
          pushNotifications: true,
          emailNotifications: true,
          moodReminder: true,
          journalReminder: true,
          breathingReminder: true,
          challengeReminder: true,
          messageNotifications: true,
          friendRequestNotifications: true,
          communityReplyNotifications: true,
          weeklyReport: true,
          monthlyReport: true,
          reminderTime: '09:00',
          dailyMoodReminder: true,
          moodReminderTime: '09:00',
          moodScale: 'emoji',
          weeklyMoodSummary: true,
          monthlyMoodSummary: true,
          autoSaveJournal: true,
          journalLock: false,
          journalBiometricLock: false,
          whoCanMessage: 'friends',
          whoCanViewProfile: 'friends',
          whoCanViewMood: 'friends',
          whoCanViewJournal: 'private',
          whoCanTagMe: 'friends',
          darkMode: true,
          accentColor: '#7C3AED',
          fontSize: 'normal',
          reduceMotion: false,
          highContrast: false,
          compactMode: false,
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          weekStartsOn: 'sunday',
          twoFactorEnabled: false,
          passkeysEnabled: false,
          trustedDevices: [],
          activeSessions: [],
        }),
    }),
    { name: 'settings-store' }
  )
);
