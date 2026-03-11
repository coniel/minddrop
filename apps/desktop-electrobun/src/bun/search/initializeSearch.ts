import { Search } from '@minddrop/search';
import { registerBunFileSystemAdapter } from './registerFileSystemAdapter';
import { createBunSqliteAdapter } from './registerSqliteAdapter';

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
  // persistence (SQLite directory creation, MiniSearch index I/O)
  registerBunFileSystemAdapter();

  // Register the Bun SQLite adapter so the search package
  // can open database connections
  Search.registerSqliteAdapter(createBunSqliteAdapter());
}
