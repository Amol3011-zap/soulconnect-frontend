import axios from 'axios';
import { useAuthStore } from '../store/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (phone, password) => api.post('/auth/login', { phone, password }),
  forgotPassword: (phone) => api.post('/auth/forgot-password', { phone }),
  verifyResetOTP: (phone, otp) => api.post('/auth/verify-reset-otp', { phone, otp }),
  resetPassword: (phone, otp, password) => api.post('/auth/reset-password', { phone, otp, password }),
  changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword }),
};

export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

export const matchAPI = {
  findMatches: () => api.post('/matches/find'),
  acceptMatch: (matchedUserId) => api.post('/matches/accept', { matched_user_id: matchedUserId }),
  getHistory: () => api.get('/matches/history'),
};

export const chatAPI = {
  sendMessage: (matchId, message) => api.post('/chats/send', { match_id: matchId, message }),
  getHistory: (matchId) => api.get(`/chats/${matchId}/history`),
  rateMatch: (matchId, rating, feedback) => api.post('/chats/rate', { match_id: matchId, rating, feedback }),
};

export const healerAPI = {
  listHealers: (problem) => api.get('/healers/', { params: { problem } }),
  getHealer: (healerId) => api.get(`/healers/${healerId}`),
  bookSession: (data) => api.post('/healers/book-session', data),
};

export const meetupAPI = {
  listMeetups: (problem, city) => api.get('/meetups/', { params: { problem, city } }),
  getMeetup: (meetupId) => api.get(`/meetups/${meetupId}`),
  joinMeetup: (meetupId) => api.post('/meetups/join', { meetup_id: meetupId }),
  getMyMeetups: () => api.get('/meetups/my-meetups'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
};

export const challengesAPI = {
  getToday: () => api.get('/challenges/today').catch(err => {
    const status = err?.response?.status;
    if (status === 401) throw { type: 'auth', message: 'Session expired. Please log in again.' };
    if (status === 404) throw { type: 'not_found', message: 'Challenges not found.' };
    throw { type: 'network', message: 'Could not load challenges. Check your connection.' };
  }),

  complete: (challengeId, actualDuration = null) =>
    api.post(`/challenges/complete/${challengeId}`, { actual_duration: actualDuration }).catch(err => {
      const status = err?.response?.status;
      if (status === 400) throw { type: 'already_done', message: 'Already completed today!' };
      if (status === 401) throw { type: 'auth', message: 'Session expired. Please log in again.' };
      if (status === 404) throw { type: 'not_found', message: 'Challenge not found.' };
      throw { type: 'network', message: 'Could not complete challenge. Try again.' };
    }),

  getWeeklySummary: () => api.get('/challenges/weekly-summary').catch(err => {
    const status = err?.response?.status;
    if (status === 401) throw { type: 'auth', message: 'Session expired. Please log in again.' };
    throw { type: 'network', message: 'Could not load weekly summary.' };
  }),

  getLeaderboard: () => api.get('/challenges/leaderboard').catch(err => {
    const status = err?.response?.status;
    if (status === 401) throw { type: 'auth', message: 'Session expired. Please log in again.' };
    throw { type: 'network', message: 'Could not load leaderboard.' };
  }),
};

export const journeyAPI = {
  logActivity: (data) => api.post('/journey/activity', data),
  getProgress: () => api.get('/journey/progress'),
  getActivities: (days = 30, activityType = null) =>
    api.get('/journey/activities', { params: { days, activity_type: activityType || undefined } }),
  getStats: () => api.get('/journey/stats'),
};

export const paymentAPI = {
  createOrder: (amount, description) => api.post('/payments/create-order', { amount, description }),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats').catch(err => {
    const status = err?.response?.status;
    if (status === 401) throw { type: 'auth', message: 'Session expired. Please log in again.' };
    throw { type: 'network', message: 'Could not load dashboard stats.' };
  }),
  sessionStart: (type) => api.post(`/dashboard/session/start/${type}`).catch(() => {}),
  sessionEnd: () => api.post('/dashboard/session/end').catch(() => {}),
  getLive: () => api.get('/dashboard/live').catch(() => ({ data: { souls_healing_now: 847 } })),
};

export const onboardingAPI = {
  getStatus: () => api.get('/onboarding/status'),
  getProfile: () => api.get('/onboarding/profile'),
  complete: (data) => api.post('/onboarding/complete', data),
  saveProblems: (data) => api.post('/onboarding/step/problems', data),
  saveIntensity: (data) => api.post('/onboarding/step/intensity', data),
  saveNeeds: (data) => api.post('/onboarding/step/needs', data),
  saveDisplayName: (data) => api.post('/onboarding/step/display-name', data),
  saveLanguage: (data) => api.post('/onboarding/step/language', data),
  saveAvailability: (data) => api.post('/onboarding/step/availability', data),
  saveCity: (data) => api.post('/onboarding/step/city', data),
  saveNotifications: (data) => api.post('/onboarding/step/notifications', data),
};
