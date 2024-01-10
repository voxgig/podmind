import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import Model from './model/model.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Model.main.conf.port.frontend,
    proxy: {
      '/api': 'http://127.0.0.1:' + Model.main.conf.port.backend
    }
  },
  build: {
    minify: false,
    commonjsOptions: {
    },
  }
})
