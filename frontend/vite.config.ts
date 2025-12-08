import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import proxyOptions from './proxyOptions.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
// Config updated to trigger restart
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 8080,
    proxy: proxyOptions
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: '../genmedai/public/frontend',
    emptyOutDir: true,
    target: 'es2015',
  },
});
