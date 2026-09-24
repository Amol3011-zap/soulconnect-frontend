import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* Logged-in app theme: 'light' | 'dark' | 'system'.
   The resolved theme is written to <html data-sc-theme="light|dark">, and the
   dark tokens in src/index.css apply only under .sc-app / .sc-portal, so the
   public marketing pages never change. index.html runs the same resolution
   inline before first paint (keep the two in sync) so there's no flash. */

const MODES = ['light', 'dark', 'system'];
const media = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

export const resolveTheme = (mode) =>
  mode === 'dark' || (mode === 'system' && media()?.matches) ? 'dark' : 'light';

function applyTheme(resolved) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-sc-theme', resolved);
}

let unlistenSystem = null;

// index.html has already resolved the theme before React loads; start from
// that so the first render matches what's on screen.
const initialResolved =
  typeof document !== 'undefined' &&
  document.documentElement.getAttribute('data-sc-theme') === 'dark' ? 'dark' : 'light';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'light',
      resolved: initialResolved,
      // Kept for older callers (ThemeToggle): true when the app is dark.
      dark: initialResolved === 'dark',

      setMode: (mode) => {
        if (!MODES.includes(mode)) return;
        const resolved = resolveTheme(mode);
        applyTheme(resolved);
        set({ mode, resolved, dark: resolved === 'dark' });
        get().watchSystem();
      },
      toggle: () => get().setMode(get().resolved === 'dark' ? 'light' : 'dark'),

      // Follow the OS setting live while in 'system' mode.
      watchSystem: () => {
        unlistenSystem?.();
        unlistenSystem = null;
        const mq = media();
        if (!mq || get().mode !== 'system') return;
        const onChange = () => {
          const resolved = resolveTheme('system');
          applyTheme(resolved);
          set({ resolved, dark: resolved === 'dark' });
        };
        mq.addEventListener('change', onChange);
        unlistenSystem = () => mq.removeEventListener('change', onChange);
      },

      init: () => get().setMode(get().mode),
    }),
    {
      name: 'theme-store',
      version: 1,
      partialize: (s) => ({ mode: s.mode }),
      // v0 stored { dark } from the old, unused toggle; start everyone on light.
      migrate: () => ({ mode: 'light' }),
    }
  )
);

// For components that need a JS value (data-driven tints, SVG art).
export const useIsDark = () => useThemeStore((s) => s.resolved === 'dark');
