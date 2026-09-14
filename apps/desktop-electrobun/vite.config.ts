import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { electrobunViteAliases } from './.hutch/devkit/api/config/electrobun-vite';

const appDir = dirname(fileURLToPath(import.meta.url));
const viewsDir = resolve(appDir, 'src/mainview');

// Exposed to the front end as import.meta.env.VITE_APP_REVISION, which
// it logs on start up so that the running code is identifiable.
process.env.VITE_APP_REVISION = resolveRevision();

export default defineConfig({
  plugins: [react()],
  root: viewsDir,
  resolve: {
    // Vite has its own resolver and does not see the devkit aliases
    // Hutch injects into Electrobun's own bundles.
    alias: electrobunViteAliases(resolve(appDir, '.hutch/devkit')),
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      // The main app and onboarding windows are separate pages sharing
      // a single asset bundle.
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

/**
 * Resolves the commit the front end is being served from, marked as
 * dirty when the working tree carries uncommitted changes. Read when
 * the server starts, so it names the code the modules were served
 * from rather than the code on disk now.
 */
function resolveRevision(): string {
  try {
    const commit = execSync('git rev-parse --short HEAD').toString().trim();
    const changes = execSync('git status --porcelain').toString().trim();

    return changes ? `${commit}-dirty` : commit;
  } catch {
    // Built outside a checkout, which leaves the revision unknown
    return 'unknown';
  }
}
