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
          // Stories data — large DB, own chunk so it doesn't inflate auth bundle
          'data-stories': ['./src/data/storiesDB.js'],
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
    // Matches.jsx is a legacy page that won't be hit normally; suppress its warning
    chunkSizeWarningLimit: 500,
  },
})
