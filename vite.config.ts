import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Sandbox plumbing: the preview gateway only exposes port 3000.
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    watch: {
      ignored: ['**/skills/**', '**/download/**', '**/.zscripts/**'],
    },
  },
  // Only scan the real entry — avoids crawling system template folders (e.g. skills/)
  optimizeDeps: {
    entries: ['index.html'],
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
})
