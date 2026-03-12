import type { SqlAdapter } from './types';

let adapter: SqlAdapter | null = null;

/**
 * Registers the platform-specific SQL adapter used to
 * open database connections.
 */
export function registerSqlAdapter(sqlAdapter: SqlAdapter): void {
  adapter = sqlAdapter;
}

/**
 * Returns the registered SQL adapter.
 * Throws if no adapter has been registered.
 */
export function getSqlAdapter(): SqlAdapter {
  if (!adapter) {
    throw new Error('SQL adapter not registered');
  }

  return adapter;
}
