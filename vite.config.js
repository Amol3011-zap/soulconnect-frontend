import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cached separately, changes rarely
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // State management
          'vendor-store': ['zustand', 'zustand/middleware'],
          // HTTP client
          'vendor-http': ['axios'],
          // Authenticated-only pages — only loaded after login
          'pages-auth': [
            './src/pages/Dashboard.jsx',
            './src/pages/Matches.jsx',
            './src/pages/Chat.jsx',
            './src/pages/GroupChat.jsx',
          ],
          'pages-healers': [
            './src/pages/Healers.jsx',
            './src/pages/HealerDashboard.jsx',
          ],
          'pages-community': [
            './src/pages/Meetups.jsx',
            './src/pages/MoodTracker.jsx',
          ],
          'pages-account': [
            './src/pages/Account.jsx',
            './src/pages/Premium.jsx',
          ],
        },
      },
    },
    // Warn at 400KB, not the default 500KB
    chunkSizeWarningLimit: 400,
  },
})
