// client/vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determine backend URL based on environment
  const backendUrl = mode === 'development' 
    ? env.VITE_BACKEND_URL || 'http://localhost:5000'
    : env.VITE_BACKEND_URL || 'https://medimapper.onrender.com'

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      port: 3000,
      proxy: mode === 'development' ? {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false
        }
      } : undefined
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl)
    }
  }
})