import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // Este alias debe apuntar a la carpeta src
    },
  },
  server: {
    host: true // O también: host: '0.0.0.0'
  }
})
