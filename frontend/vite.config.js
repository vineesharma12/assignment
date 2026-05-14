import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  },
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
});
