import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite configuration for Formula PM - Optimized for WSL2 performance
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration for optimal WSL2 performance
  server: {
    port: 3000,
    host: '0.0.0.0', // Important for WSL2 networking
    open: false, // Don't auto-open browser in WSL2
    hmr: {
      port: 3001, // Use different port for HMR
      host: 'localhost'
    },
    fs: {
      strict: false, // Allow serving files from outside root
    },
    // Force polling for file watching in WSL2
    watch: {
      usePolling: true,
      interval: 1000,
    }
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
  
  // Build configuration
  build: {
    outDir: 'build', // Keep same build directory for GitHub Pages compatibility
    sourcemap: false, // Disable source maps for faster builds
    rollupOptions: {
      output: {
        // Optimize chunk splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['recharts'],
          utils: ['date-fns', 'axios'],
        }
      }
    }
  },
  
  // GitHub Pages base path
  base: process.env.NODE_ENV === 'production' ? '/formula-pm/' : '/',
  
  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'recharts',
      'axios',
      'date-fns'
    ]
  },
  
  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }
});