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
  login: (phone) => api.post('/auth/login', { phone }),
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

export const paymentAPI = {
  createOrder: (amount, description) => api.post('/payments/create-order', { amount, description }),
  verifyPayment: (data) => api.post('/payments/verify', data),
};
