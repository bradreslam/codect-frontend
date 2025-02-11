import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:5231',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})
