import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0', // Better for Docker/WSL2 compatibility
    hmr: {
      overlay: false // Disable error overlay for faster development
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Development optimizations
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      'axios',
      'date-fns',
      'recharts'
    ],
    force: false // Set to true if you want to force re-optimization
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext', // Use latest JS features for faster builds
    minify: 'esbuild', // Faster than terser
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
          utils: ['axios', 'date-fns', 'recharts'],
        },
      },
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/formula-pm/' : '/',
  // Cache optimizations
  cacheDir: '.vite',
})