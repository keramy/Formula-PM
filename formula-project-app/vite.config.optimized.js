import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false, // Disable for production
      include: "**/*.{jsx,js}",
      babel: {
        // Minimal babel configuration for speed
        compact: true,
        plugins: [],
        presets: []
      }
    })
  ],
  server: {
    port: 3003,
    strictPort: false,
    host: '0.0.0.0',
    open: false,
    hmr: {
      overlay: true,
      port: 3003
    },
    watch: {
      usePolling: true,
      interval: 1000,
      binaryInterval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5014',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
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
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ],
    exclude: ['@mui/icons-material', 'iconoir-react'],
    force: false,
    esbuildOptions: {
      target: 'es2015',
      keepNames: false,
      minify: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled']
        },
        compact: true
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false
      },
      maxParallelFileOps: 20
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      extensions: ['.js', '.cjs']
    },
    cssCodeSplit: false, // Disable CSS splitting for speed
    assetsInlineLimit: 8192,
    reportCompressedSize: false
  },
  esbuild: {
    target: 'es2015',
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    drop: ['console', 'debugger']
  },
  base: '/',
  // Disable plugins that might slow down builds
  json: {
    stringify: true
  }
})