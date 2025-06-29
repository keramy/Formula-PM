import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      fastRefresh: false,
      babel: false // Completely disable babel transformations
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: false, // Disable minification for fastest builds
    target: 'esnext', // Use latest features for speed
    cssMinify: false, // Disable CSS minification
    rollupOptions: {
      output: {
        // Single chunk output for speed
        inlineDynamicImports: true,
        manualChunks: undefined
      },
      treeshake: false // Disable tree shaking for speed
    },
    commonjsOptions: {
      transformMixedEsModules: false
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 10000,
    assetsInlineLimit: 0 // Don't inline any assets
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: false
  },
  esbuild: {
    target: 'esnext',
    format: 'esm',
    minifyWhitespace: false,
    minifyIdentifiers: false,
    minifySyntax: false,
    legalComments: 'inline',
    treeShaking: false
  }
})