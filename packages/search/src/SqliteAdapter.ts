import type { SqliteAdapter } from './types';

let adapter: SqliteAdapter | null = null;

/**
 * Back-end only. Registers the platform-specific SQLite
 * adapter used by the search package to open database
 * connections.
 */
export function registerSqliteAdapter(sqliteAdapter: SqliteAdapter): void {
  adapter = sqliteAdapter;
}

/**
 * Returns the registered SQLite adapter.
 * Throws if no adapter has been registered.
 */
export function getSqliteAdapter(): SqliteAdapter {
  if (!adapter) {
    throw new Error('SQLite adapter not registered');
  }

  return adapter;
}
