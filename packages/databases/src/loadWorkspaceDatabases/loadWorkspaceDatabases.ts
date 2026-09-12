import { restoreDates } from '@minddrop/utils';
import { Workspace } from '@minddrop/workspaces';
import { getDatabaseBackendAdapter } from '../DatabaseBackendAdapter';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { loadDatabaseDesigns } from '../loadDatabaseDesigns';
import { loadDatabaseEntries } from '../loadDatabaseEntries';
import { loadDatabaseEntryTemplates } from '../loadDatabaseEntryTemplates';
import { loadDatabaseViews } from '../loadDatabaseViews';
import type { Database } from '../types';
import { convertSqlRecordToEntry } from '../utils';

/**
 * Loads a workspace's databases and entries from the backend into
 * the workspace's store records, along with the databases' views,
 * designs and entry templates.
 *
 * @param workspace - The workspace whose databases to load.
 * @returns Whether the SQL schema changed, requiring a full index rebuild.
 */
export async function loadWorkspaceDatabases(
  workspace: Workspace,
): Promise<{ schemaChanged: boolean }> {
  // Load all databases and entries from the backend
  const backend = getDatabaseBackendAdapter();
  const result = await backend.initializeBackend(workspace.id, workspace.path);

  // Restore dates in database configs (dates arrive as
  // ISO strings over RPC).
  const databases = result.databases.map((database) =>
    restoreDates<Database>(database),
  );

  // Load database configs into the workspace's store record
  DatabasesStore.in(workspace.id).load(databases);

  // Convert SQL entry records to DatabaseEntry objects
  const entries = result.entries.map((record) =>
    convertSqlRecordToEntry(
      record,
      resolveDatabase(databases, record.databaseId),
    ),
  );

  // Load entries and hydrate virtual collections
  loadDatabaseEntries(databases, entries, workspace.id);

  // Load database views, designs, and entry templates from the
  // databases' config directories.
  await Promise.all([
    loadDatabaseViews(databases, workspace),
    loadDatabaseDesigns(databases, workspace),
    loadDatabaseEntryTemplates(databases, workspace),
  ]);

  // Fire-and-forget background sync to detect filesystem
  // changes that occurred while the app was not running.
  // Skip if schema changed (full rebuild already scanned
  // the filesystem).
  if (!result.schemaChanged) {
    backend.backgroundSync(workspace.id, workspace.path);
  }

  return { schemaChanged: result.schemaChanged };
}

/**
 * Returns the database with the given ID from the loaded databases.
 *
 * @throws {DatabaseNotFoundError} If no loaded database has the ID.
 */
function resolveDatabase(databases: Database[], id: string): Database {
  const database = databases.find((candidate) => candidate.id === id);

  if (!database) {
    throw new DatabaseNotFoundError(id);
  }

  return database;
}
