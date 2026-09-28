import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  // '@/...' -> src/ (used by the shadcn/ui components in src/components/ui)
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      // Dev only. The browser calls same-origin /api and Vite forwards it
      // to the Railway backend, so CORS never applies -- this is what lets
      // a phone on the LAN (http://192.168.x.x:5173) use signup/login,
      // which the backend's CORS allow-list (localhost only) rejects.
      // Origin is stripped so the backend treats it as a server-to-server
      // call. NOTE: this is the PRODUCTION backend and database.
      '/api': {
        target: 'https://soulconnect-backend-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'));
        },
      },
    },
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
          // three.js — only pulled in by the lazy-loaded Globe3D component
          // (Pulse page / Landing's Global Pulse section); own chunk so it's
          // cached separately and never bundled with critical-path code.
          'vendor-three': ['three'],
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
