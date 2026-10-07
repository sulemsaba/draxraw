import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the same build works at a domain root (Vercel,
  // Cloudflare Pages) and under a subfolder (GitHub Pages: /draxraw/).
  base: './',
})
