import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rewriteAll from 'vite-plugin-rewrite-all';


// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), rewriteAll()],
  server: {
    // Vite-specific setting to ensure React SPA routing works in development
    middlewareMode: true,
  },
  build: {
    // Output settings for production build
    outDir: 'dist',
  },
})
