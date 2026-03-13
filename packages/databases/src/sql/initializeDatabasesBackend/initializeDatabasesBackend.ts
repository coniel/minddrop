import { Sql } from '@minddrop/sql';
import { Paths } from '@minddrop/utils';
import { loadCoreSerializers } from '../../DatabaseEntrySerializers';
import { readDatabaseEntryFiles } from '../../readDatabaseEntryFiles';
import { readDatabaseMetadata } from '../../readDatabaseMetadata';
import { readWorkspaceDatabases } from '../../readWorkspaceDatabases';
import type { Database, SqlEntryRecord } from '../../types';
import { convertEntryToSqlRecord } from '../../utils';
import { SCHEMA_SQL, SCHEMA_VERSION } from '../schema';
import { sqlGetAllEntriesFull } from '../sqlGetAllEntriesFull';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';

export interface InitializeBackendResult {
  /**
   * The database configs read from the workspace.
   */
  databases: Database[];

  /**
   * All entries with full property data and metadata,
   * queried from SQL after initialization.
   */
  entries: SqlEntryRecord[];

  /**
   * Whether the SQL schema changed (new DB or version
   * mismatch), indicating a full search index rebuild
   * is needed. When true, background sync can be skipped
   * since a full filesystem scan was already performed.
   */
  schemaChanged: boolean;
}

/**
 * Backend-side orchestrator for database initialization.
 * Reads database configs from disk, ensures SQL is populated,
 * and returns all data needed to hydrate frontend stores.
 *
 * On normal startup (SQL exists, schema matches), entries are
 * served directly from SQL with no filesystem entry reads.
 * Filesystem diffing happens later via background sync.
 *
 * On first run or schema change, performs a full filesystem
 * scan to populate SQL before returning.
 *
 * @param workspaceId - The workspace ID (used for SQL database path).
 * @param workspacePath - The absolute path to the workspace root.
 */
export async function initializeDatabasesBackend(
  workspaceId: string,
  workspacePath: string,
): Promise<InitializeBackendResult> {
  // Load core entry serializers for reading entry files
  loadCoreSerializers();

  // Set the workspace path so entry ID derivation works
  Paths.workspace = workspacePath;

  // Read database configs from the workspace
  const databases = await readWorkspaceDatabases(workspacePath);

  // Open or create the SQL database
  const dbPath = `${Sql.getConfigPath()}/${workspaceId}/data.db`;
  const { schemaChanged } = await Sql.open(dbPath, {
    schema: SCHEMA_SQL,
    version: SCHEMA_VERSION,
  });

  // On schema change (new DB or version mismatch), populate
  // SQL from the filesystem. Otherwise trust SQL as the cache
  // and let background sync handle any drift.
  if (schemaChanged) {
    await rebuildSqlFromFilesystem(databases);
  }

  // Query all entries with full property data and metadata
  const entries = sqlGetAllEntriesFull();

  return {
    databases,
    entries,
    schemaChanged,
  };
}

/**
 * Reads all entry files and metadata from the filesystem
 * and populates SQL from scratch. Used on first run or
 * after a schema version change.
 */
async function rebuildSqlFromFilesystem(databases: Database[]): Promise<void> {
  for (const database of databases) {
    // Insert database record
    sqlUpsertDatabase(
      {
        id: database.id,
        name: database.name,
        path: database.path,
        icon: database.icon,
      },
      { silent: true },
    );

    // Read entries and metadata from disk in parallel
    const [rawEntries, metadataMap] = await Promise.all([
      readDatabaseEntryFiles(database),
      readDatabaseMetadata(database.path),
    ]);

    // Merge metadata into entries before conversion
    const entriesWithMetadata = rawEntries.map((entry) => {
      const metadata = metadataMap[entry.id];

      if (metadata) {
        return { ...entry, metadata };
      }

      return entry;
    });

    // Convert to SQL records and upsert
    const sqlRecords = entriesWithMetadata.map((entry) =>
      convertEntryToSqlRecord(entry, database),
    );

    if (sqlRecords.length > 0) {
      sqlUpsertEntries(database.id, sqlRecords, { silent: true });
    }
  }
}
