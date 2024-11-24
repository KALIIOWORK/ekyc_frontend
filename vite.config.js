import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rewriteAll from 'vite-plugin-rewrite-all';


// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), rewriteAll()],
  server: {
    historyApiFallback: true, // Ensures local dev handles SPA routes
  },
  build: {
    // Output settings for production build
    outDir: 'dist',
  },
})
