import { Sql } from '@minddrop/sql';
import { createBunSqlAdapter } from './bunSqlAdapter';

/**
 * Registers the Bun-native SQL adapter so the SQL package
 * can open database connections via bun:sqlite.
 * Called from the Bun process on startup.
 */
export function initializeSql(): void {
  console.log('[sql] Registering Bun SQL adapter');
  Sql.registerAdapter(createBunSqlAdapter());
}
