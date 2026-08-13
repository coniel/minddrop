import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const viewsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  'src/mainview',
);

export default defineConfig({
  plugins: [react()],
  root: viewsDir,
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      // The main app and onboarding windows are separate pages sharing
      // a single asset bundle
      input: {
        index: resolve(viewsDir, 'index.html'),
        onboarding: resolve(viewsDir, 'onboarding.html'),
      },
    },
  },
  server: {
    port: 5183,
    strictPort: true,
  },
});
