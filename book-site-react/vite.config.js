import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served at https://imanhuson.github.io/Portfolio/book-site-react/ — GitHub
// Pages serves this from a subpath, not the domain root, so asset URLs need
// the matching base path or they 404 (same class of bug the plain-HTML
// book-site's root index.html was added to work around).
export default defineConfig({
  base: '/Portfolio/book-site-react/',
  plugins: [react()],
})
