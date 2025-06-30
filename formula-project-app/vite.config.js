import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      include: "**/*.{jsx,tsx,js,ts}"
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false, // Don't auto-open in WSL2
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ],
  server: {
    port: 3003,
    strictPort: false, // Allow fallback port for now
    host: '0.0.0.0', // Essential for WSL2 localhost access
    open: false, // Disable auto-open due to WSL2 localhost issues
    hmr: {
      overlay: true,
      port: 3003
    },
    watch: {
      usePolling: true, // Essential for WSL2 file watching
      interval: 500, // Reduced from 1000ms for better responsiveness
      binaryInterval: 2000, // Increased for binary files to reduce CPU usage
      ignored: [
        '**/node_modules/**', 
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.cache/**',
        '**/coverage/**',
        '**/*.log'
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5014',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
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
    include: [
      // Core dependencies that should be pre-bundled
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      
      // UI Framework
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      
      // Utilities
      'date-fns',
      'lodash',
      'axios',
      
      // File handling
      'xlsx',
      'file-saver',
      
      // Icons (React Icons)
      'react-icons/md',
      'react-icons/fa',
      'react-icons/ai',
      
      // Charts
      'recharts'
    ],
    exclude: [
      '@mui/icons-material', // Too large, load on demand
      'monaco-editor', // Large editor, load on demand
      'pdf-lib' // Large PDF library, load on demand
    ],
    force: false,
    // Use esbuild for faster dependency optimization
    esbuildOptions: {
      target: 'es2020', // Updated for better performance
      keepNames: true,
      minify: false // Keep readable for debugging
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for faster builds
    minify: 'esbuild', // Use esbuild for faster minification
    target: 'es2015',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - highest priority, loaded first
          'react-vendor': ['react', 'react-dom'],
          
          // UI Framework - Material-UI core (frequently used)
          'mui-core': ['@mui/material', '@mui/system', '@mui/styled-engine'],
          'mui-utils': ['@emotion/react', '@emotion/styled'],
          
          // Data & State Management
          'react-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'react-router': ['react-router-dom'],
          
          // Heavy Visualization Libraries - lazy load
          'charts': ['recharts'],
          
          // Document Generation - lazy load
          'pdf-utils': ['jspdf', 'html2canvas'],
          
          // File Handling - lazy load
          'file-utils': ['xlsx', 'file-saver'],
          
          // React Icons - separate for tree shaking
          'icons': ['react-icons/md', 'react-icons/fa', 'react-icons/ai'],
          
          // Utilities - stable dependencies
          'utils': ['date-fns', 'socket.io-client', 'react-beautiful-dnd', 'react-dropzone'],
          
          // Development tools
          'dev-tools': ['web-vitals']
        },
        // Optimize chunk names for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Optimize Rollup performance
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      // External dependencies to speed up build
      external: [],
      // Increase maxParallelFileOps for faster processing (WSL2 optimized)
      maxParallelFileOps: 5 // Reduced for WSL2 stability
    },
    // Increase thread pool size for faster builds
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/]
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize asset handling
    assetsInlineLimit: 4096,
    // Report compressed size (disable for faster builds)
    reportCompressedSize: false
  },
  // Add esbuild optimizations
  esbuild: {
    target: 'es2015',
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  // WSL2 Specific Optimizations
  clearScreen: false, // Prevent clearing console in WSL2
  logLevel: 'info',
  base: '/',
  // Improve cache handling for WSL2
  cacheDir: '.vite',
})