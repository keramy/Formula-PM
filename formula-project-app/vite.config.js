import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      include: "**/*.{jsx,tsx,js,ts}",
      babel: {
        // Disable babel plugins that slow down builds
        plugins: [],
        presets: []
      }
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
        target: 'http://localhost:5015',
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
      
      // Icons (selected subset)
      'iconoir-react',
      
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
        manualChunks(id) {
          // Advanced chunking strategy for optimal performance
          if (id.includes('node_modules')) {
            // Core React ecosystem - loaded first
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-core';
            }
            if (id.includes('react-router') || id.includes('@tanstack/react-query')) {
              return 'react-routing';
            }
            
            // UI Framework - separate for caching
            if (id.includes('@mui/material') || id.includes('@mui/icons-material')) {
              return 'mui-core';
            }
            if (id.includes('@emotion')) {
              return 'emotion';
            }
            
            // Icons - separate chunk for lazy loading
            if (id.includes('iconoir-react')) {
              return 'icons';
            }
            
            // Charts and visualization
            if (id.includes('recharts') || id.includes('d3')) {
              return 'charts';
            }
            
            // Utilities - frequently changing
            if (id.includes('date-fns') || id.includes('lodash') || id.includes('axios')) {
              return 'utils';
            }
            
            // File handling
            if (id.includes('xlsx') || id.includes('file-saver') || id.includes('pdf')) {
              return 'file-utils';
            }
            
            // Large libraries that change infrequently
            if (id.includes('monaco-editor') || id.includes('codemirror')) {
              return 'editors';
            }
            
            // Everything else
            return 'vendor';
          }
          
          // App-level chunking for pages
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
          if (id.includes('/src/components/')) {
            return 'components';
          }
          if (id.includes('/src/services/')) {
            return 'services';
          }
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