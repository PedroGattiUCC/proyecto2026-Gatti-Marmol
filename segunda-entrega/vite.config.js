import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api': path.resolve(import.meta.dirname, 'src/api'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
      '@components': path.resolve(import.meta.dirname, 'src/components'),
      '@layouts': path.resolve(import.meta.dirname, 'src/layouts'),
      '@pages': path.resolve(import.meta.dirname, 'src/pages'),
      '@styles': path.resolve(import.meta.dirname, 'src/styles'),
    },
  },
})
