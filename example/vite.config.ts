import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { clickToSource } from '@avoidray/click-to-source/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/click-to-source/',
  plugins: [clickToSource(), react()],
})
