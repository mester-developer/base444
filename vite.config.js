import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server config for the Base44 sandbox: reachable on 3000, bound to all
// interfaces, and tolerant of the proxied preview host (the sandbox host changes).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    watch: { usePolling: true, interval: 300 },
  },
})
