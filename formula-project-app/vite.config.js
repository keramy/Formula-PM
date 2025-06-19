import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      include: "**/*.{jsx,tsx,js,ts}",
    })
  ],
  server: {
    port: 3002,
    host: '0.0.0.0', // Essential for WSL2 localhost access
    open: false, // Disable auto-open due to WSL2 localhost issues
    hmr: {
      overlay: true,
      port: 3002
    },
    watch: {
      usePolling: true, // Essential for WSL2 file watching
      interval: 1000,
      binaryInterval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5014',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Proxy request:', req.method, req.url, '→', options.target + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy error:', err.message, 'for', req.url);
          });
        }
      }
    },
    fs: {
      strict: false
    },
    cors: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['date-fns', '@mui/material', '@emotion/react', '@emotion/styled', 'xlsx', 'file-saver'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
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
})