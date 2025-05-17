import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    base: './', // ✅ add this if missing
  build: {
    outDir: 'dist',
  },
  base: './', // this ensures relative asset paths
})
