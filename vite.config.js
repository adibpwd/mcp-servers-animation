import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import exportPlugin from './vite-plugin-export.js'

export default defineConfig({
  plugins: [react(), exportPlugin()],
  server: { port: 5173, host: 'localhost' }
})
