import { registerBunFileSystemAdapter } from './registerFileSystemAdapter';

/**
 * Registers platform adapters for the search system.
 * Called from the Bun process on startup.
 *
 * The actual data population is driven by the frontend
 * via the `searchInitialize` RPC after it has loaded all
 * databases.
 */
export function initializeSearch(): void {
  console.log('[search] Registering search platform adapters');

  // Register a Bun-native file system adapter for search
  // persistence (MiniSearch index I/O)
  registerBunFileSystemAdapter();
}
