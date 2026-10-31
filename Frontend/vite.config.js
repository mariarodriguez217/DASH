import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // En desarrollo, Vite reenvía los pedidos que empiezan con /api al back (puerto 3000).
  // Así el navegador ve un solo origen y no aparece el bloqueo de CORS.
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})