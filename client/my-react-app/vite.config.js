import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss()
  ],
  server: {
    proxy: {
      // This intercept any request starting with "/api"
      '/api': {
        target: 'http://localhost:3000', // Your Backend Port
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
