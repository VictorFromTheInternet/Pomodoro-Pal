import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'

// Separate config for content script - must be IIFE format
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't clear dist since popup build runs first
    rollupOptions: {
      input: resolve(__dirname, 'src/content.jsx'),
      output: {
        entryFileNames: 'content.js',
        format: 'iife',
        inlineDynamicImports: true // Bundle everything into single file
      }
    }
  }
})
