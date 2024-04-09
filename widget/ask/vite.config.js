// const fs = require('fs')
// const path = require('path')

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    target: 'es6',
    lib: {
      entry: 'src/voxgig-podmind-ask.js',
      name: 'VoxgigPodmindAsk',
      fileName: 'voxgig-podmind-ask',
    },
    emptyOutDir: false,
    rollupOptions: {
      treeshake: false,
      logLevel: 'debug',
      plugins: [],
    },
  },  
})


