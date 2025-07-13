import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist-demo',
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['src/**/*.ts']
  },
  esbuild: {
    target: 'es2020'
  }
}) 