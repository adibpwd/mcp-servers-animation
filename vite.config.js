import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import exportPlugin from './vite-plugin-export.js'

export default defineConfig({
  plugins: [react(), exportPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    // Allow requests coming in with these Host headers:
    // - 'frontend' is how other containers (e.g. export-server) reach this
    //   service over the internal docker-compose network
    // - the rest cover access from the host machine / Tailscale
    allowedHosts: ['frontend', 'localhost', '127.0.0.1', '100.78.186.122'],
    // Docker bind mount (.:/app) kadang gak nerusin inotify event dari host
    // ke container, jadi HMR "gak sadar" file berubah. Polling maksa Vite
    // ngecek perubahan tiap 300ms — jadi gak perlu restart docker compose
    // tiap edit file.
    watch: {
      usePolling: true,
      interval: 300
    }
  }
})
