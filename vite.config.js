import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rewriteAll from 'vite-plugin-rewrite-all';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), rewriteAll()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "../../../index.scss";`, // Optional: Import global SCSS variables or mixins
      },
    },
  },
})
