import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'

// Main config - builds popup only
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Keep GIFs and PNGs in root
          if (assetInfo.name?.endsWith('.gif') || assetInfo.name?.endsWith('.png')) {
            return '[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})

