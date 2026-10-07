import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// '/' for Vercel / Cloudflare; the GitHub Pages workflow sets BASE_PATH=/draxraw/
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    {
      // A <base> tag lets plain "img/..." paths work from any page (/films, /photos ...)
      name: 'inject-base-href',
      transformIndexHtml: () => [{ tag: 'base', attrs: { href: base }, injectTo: 'head-prepend' }],
    },
  ],
})
