import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      primaryProblem: null,
      setAuth: (user, token, role) => set({ user, token, role: role || user?.role || null }),
      setPrimaryProblem: (problem) => set({ primaryProblem: problem }),
      logout: () => set({ user: null, token: null, role: null, primaryProblem: null }),
    }),
    { name: 'auth-store' }
  )
);
