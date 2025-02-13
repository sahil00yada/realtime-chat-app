import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default {
  css: {
    postcss: './postcss.config.js' // Explicit path
  },
  plugins: [react()]
}
