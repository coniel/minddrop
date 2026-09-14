import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { electrobunViteAliases } from './.hutch/devkit/api/config/electrobun-vite';

const appDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  resolve: {
    // Vite has its own resolver and does not see the devkit aliases
    // Hutch injects into Electrobun's own bundles.
    alias: electrobunViteAliases(resolve(appDir, '.hutch/devkit')),
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5914,
    strictPort: true,
  },
});
