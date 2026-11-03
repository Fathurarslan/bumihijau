import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Saat development, semua request ke /api diteruskan ke server Express (port 3001)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
