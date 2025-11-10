import { defineConfig } from 'vite'
import {resolve} from 'path'

// Separate config for background service worker - must be IIFE format
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't clear dist since other builds run first
    rollupOptions: {
      input: resolve(__dirname, 'src/background.ts'),
      output: {
        entryFileNames: 'background.js',
        format: 'iife',
        inlineDynamicImports: true // Bundle everything into single file
      }
    }
  }
})
