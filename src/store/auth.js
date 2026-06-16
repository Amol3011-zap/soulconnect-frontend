import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null, // 'user' | 'healer' — stored explicitly so API response doesn't need to include it
      setAuth: (user, token, role) => set({ user, token, role: role || user?.role || null }),
      logout: () => set({ user: null, token: null, role: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);
