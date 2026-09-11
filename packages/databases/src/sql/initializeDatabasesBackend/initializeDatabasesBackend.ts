import { Fs } from '@minddrop/file-system';
import { Sql } from '@minddrop/sql';
import { Paths } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { loadCoreSerializers } from '../../DatabaseEntrySerializers';
import { SqlDatabaseFileName } from '../../constants';
import { readAllEntryMetadata } from '../../readAllEntryMetadata';
import { readDatabaseEntries } from '../../readDatabaseEntries';
import { readWorkspaceDatabases } from '../../readWorkspaceDatabases';
import type { Database, DatabaseEntry, SqlEntryRecord } from '../../types';
import {
  convertEntryToSqlRecord,
  databaseEntryAddress,
  entryMetadataKey,
  mergeEntryMetadata,
  resolveCollectionProperties,
  resolveDatabasePath,
} from '../../utils';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import { SCHEMA_SQL, SCHEMA_VERSION } from '../schema';
import { sqlDeleteDatabase } from '../sqlDeleteDatabase';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
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
 * @param workspaceId - The ID of the workspace whose data directory holds the SQL database.
 * @param workspacePath - The absolute path to the workspace root.
 */
export async function initializeDatabasesBackend(
  workspaceId: string,
  workspacePath: string,
): Promise<InitializeBackendResult> {
  // Load core entry serializers for reading entry files
  loadCoreSerializers();

  // Set the workspace path for path resolution
  Paths.workspace = workspacePath;

  // Open or create the SQL database. Opened before the workspace
  // scan so that the scan can consult the recorded database paths.
  const dbPath = Fs.concatPath(
    Workspaces.resolveDataDirPath(workspaceId),
    SqlDatabaseFileName,
  );
  const { schemaChanged } = await Sql.open(dbPath, {
    schema: SCHEMA_SQL,
    version: SCHEMA_VERSION,
  });

  // The databases the index holds, as of the last session
  const indexedDatabases = sqlGetAllDatabases();

  // Read database configs from the workspace, passing the recorded
  // paths so that a copied database directory rather than the
  // original is the one given a fresh ID. Empty on a schema rebuild,
  // leaving the scan order to decide.
  const databases = await readWorkspaceDatabases(
    workspacePath,
    new Map(indexedDatabases.map((database) => [database.id, database.path])),
  );

  // Drop the databases deleted since the last session, whose entries
  // would otherwise be served from the index with no database to
  // resolve them against. Their entry records go with them, through
  // the foreign key's cascade.
  const scannedIds = new Set<string>(databases.map((database) => database.id));

  indexedDatabases
    .filter((database) => !scannedIds.has(database.id))
    .forEach((database) => sqlDeleteDatabase(database.id, { silent: true }));

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
  // Workspace-wide address index used to resolve entry references,
  // keyed lowercased to match addresses case-insensitively
  const entryIdByAddress = new Map<string, string>();

  // Staged read results per database
  const staged: { database: Database; entries: DatabaseEntry[] }[] = [];

  // Entries whose sidecar timestamps need writing, collected during the
  // read pass and written in one batch at the end.
  const outdatedSidecars: { database: Database; entry: DatabaseEntry }[] = [];

  // Pass 1: read all entries so references can resolve across databases
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
      readDatabaseEntries(database),
      readAllEntryMetadata(resolveDatabasePath(database)),
    ]);

    // Merge metadata into entries before conversion, resolving their
    // timestamps against the sidecar.
    const entriesWithMetadata = rawEntries.map((rawEntry) => {
      const { entry, sidecarOutdated } = mergeEntryMetadata(
        rawEntry,
        database.properties,
        metadataMap[entryMetadataKey(rawEntry.path)],
      );

      // Collect entries whose sidecar has no timestamps yet, or whose
      // timestamp properties have since been edited outside the app.
      if (sidecarOutdated) {
        outdatedSidecars.push({ database, entry });
      }

      return entry;
    });

    // Index the entries by address
    entriesWithMetadata.forEach((entry) => {
      entryIdByAddress.set(
        databaseEntryAddress(entry, database).toLowerCase(),
        entry.id,
      );
    });

    // Stage the read results for the resolution pass
    staged.push({ database, entries: entriesWithMetadata });
  }

  // Pass 2: resolve entry references and upsert
  for (const { database, entries } of staged) {
    // Resolve collection property addresses to entry IDs
    const resolvedEntries = entries.map((entry) => ({
      ...entry,
      properties: resolveCollectionProperties(
        entry.properties,
        database,
        entryIdByAddress,
      ),
    }));

    // Convert to SQL records and upsert
    const sqlRecords = resolvedEntries.map((entry) =>
      convertEntryToSqlRecord(entry, database),
    );

    if (sqlRecords.length > 0) {
      sqlUpsertEntries(database.id, sqlRecords, { silent: true });
    }
  }

  // Seed the sidecars in one batch at the end, keeping the index build
  // itself a read pass.
  await Promise.all(
    outdatedSidecars.map(({ database, entry }) =>
      writeEntryMetadata(
        resolveDatabasePath(database),
        entry.path,
        entry.metadata,
      ),
    ),
  );
}
