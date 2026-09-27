import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served at https://imanhuson.github.io/Portfolio/red-rising-archive/
export default defineConfig({
  base: '/Portfolio/red-rising-archive/',
  plugins: [react()],
})
