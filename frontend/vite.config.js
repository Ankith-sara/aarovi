import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: { port: 5173 },

  build: {
    sourcemap: false, // disable in prod for smaller output; enable only for staging
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false, // speeds up build; remove if you want accurate stats

    rollupOptions: {
      output: {
        // Vendor chunk splitting — keeps React & co. separately cached
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':     ['lucide-react', 'react-toastify'],
          'vendor-http':   ['axios'],
          'vendor-misc':   ['jwt-decode', 'react-helmet-async'],
        },
        // Predictable filenames for long-term caching
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  // Inline small assets instead of separate requests
  assetsInlineLimit: 4096,
});