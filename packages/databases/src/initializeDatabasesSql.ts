import { Workspaces } from '@minddrop/workspaces';
import { getDatabaseSqlAdapter } from './DatabaseSqlAdapter';
import { getAllDatabases } from './getAllDatabases';
import type { SqlInitializeResult } from './sql';

/**
 * Initializes the SQL database for a workspace by sending
 * all loaded databases to the backend for indexing.
 *
 * Should be called after databases have been loaded
 * (i.e. after `Databases.initialize()`).
 *
 * @returns The schema change flag and any incrementally
 *   changed or deleted entries (for search sync).
 */
export async function initializeDatabasesSql(): Promise<SqlInitializeResult> {
  const workspaces = Workspaces.getAll();

  if (workspaces.length === 0) {
    return { schemaChanged: false, changedEntries: [], deletedEntryIds: [] };
  }

  // Use the first workspace for now
  // TODO: Support multiple workspaces
  const workspaceId = workspaces[0].id;

  // Get all loaded databases from the store
  const databases = getAllDatabases();

  // Delegate to the platform adapter for efficient
  // backend execution (single RPC call)
  return getDatabaseSqlAdapter().initialize(workspaceId, databases);
}
