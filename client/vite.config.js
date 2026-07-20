import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /api/* requests to Express backend in development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Proxy short-code redirects to Express backend in development
      // Matches any 5-8 character alphanumeric path segment
      '^/[a-zA-Z0-9_-]{5,8}$': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
