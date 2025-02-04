import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: '192.168.1.7',
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src"
    }
  }
})
