import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'robust-vibrancy-production-f830.up.railway.app'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'robust-vibrancy-production-f830.up.railway.app'
    ]
  }
})