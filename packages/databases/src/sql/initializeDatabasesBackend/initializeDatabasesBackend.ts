import { Fs } from '@minddrop/file-system';
import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { loadCoreSerializers } from '../../EntrySerializers';
import {
  EntryContentPendingMetaKey,
  SqlDatabaseFileName,
} from '../../constants';
import { readAllEntryMetadata } from '../../readAllEntryMetadata';
import { readEntries } from '../../readEntries';
import { readWorkspaceDatabases } from '../../readWorkspaceDatabases';
import type { Database, Entry, SqlEntryRecord } from '../../types';
import {
  convertEntryToSqlRecord,
  mergeEntryMetadata,
  resolveCollectionProperties,
  resolveDatabasePath,
  resolveEntryAddressKey,
  resolveEntryMetadataKey,
} from '../../utils';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import {
  ENTRY_CONTENT_TRIGGERS_SQL,
  SCHEMA_SQL,
  SCHEMA_VERSION,
} from '../schema';
import { sqlDeleteDatabase } from '../sqlDeleteDatabase';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
import { sqlGetEntriesFull } from '../sqlGetEntriesFull';
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
 * @param workspaceId - The ID of the workspace whose databases to initialize.
 * @param workspacePath - The absolute path to the workspace root.
 */
export async function initializeDatabasesBackend(
  workspaceId: string,
  workspacePath: string,
): Promise<InitializeBackendResult> {
  // Load core entry serializers for reading entry files
  loadCoreSerializers();

  // Open or create the SQL database. Opened before the workspace
  // scan so that the scan can consult the recorded database paths.
  const dbPath = Fs.concatPath(
    Workspaces.resolveDataDirPath(workspaceId),
    SqlDatabaseFileName,
  );
  const { schemaChanged } = await Sql.open(workspaceId, dbPath, {
    schema: SCHEMA_SQL,
    version: SCHEMA_VERSION,
  });

  // The databases the index holds, as of the last session
  const indexedDatabases = sqlGetAllDatabases(workspaceId);

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
    .forEach((database) =>
      sqlDeleteDatabase(database.id, { silent: true }, workspaceId),
    );

  // On schema change (new DB or version mismatch), populate
  // SQL from the filesystem. Otherwise trust SQL as the cache
  // and let background sync handle any drift.
  if (schemaChanged) {
    // Mark the content index as pending. The rebuild loads the rows
    // before the content triggers exist.
    Sql.run(
      workspaceId,
      "INSERT OR REPLACE INTO meta (key, value) VALUES (?, '1')",
      EntryContentPendingMetaKey,
    );

    // Populate SQL from the filesystem
    await rebuildSqlFromFilesystem(workspaceId, databases, workspacePath);
  }

  // Create the content triggers. A fresh database does not have them
  // yet. Idempotent on an existing one.
  Sql.exec(workspaceId, ENTRY_CONTENT_TRIGGERS_SQL);

  // Query all entries with full property data and metadata
  const entries = sqlGetEntriesFull({ workspaceId });

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
async function rebuildSqlFromFilesystem(
  workspaceId: string,
  databases: Database[],
  workspacePath: string,
): Promise<void> {
  // Workspace-wide address index used to resolve entry references,
  // keyed lowercased to match addresses case-insensitively
  const entryIdByAddress = new Map<string, string>();

  // Staged read results per database
  const staged: { database: Database; entries: Entry[] }[] = [];

  // Entries whose sidecar timestamps need writing, collected during the
  // read pass and written in one batch at the end.
  const outdatedSidecars: { database: Database; entry: Entry }[] = [];

  // Pass 1: read all entries so references can resolve across databases
  for (const database of databases) {
    // Insert database record
    sqlUpsertDatabase(
      {
        id: database.id,
        name: database.name,
        path: database.path,
        icon: database.icon,
        properties: database.properties,
      },
      { silent: true },
      workspaceId,
    );

    // Read entries and metadata from disk in parallel
    const [{ entries: rawEntries }, metadataMap] = await Promise.all([
      readEntries(database, { workspacePath }),
      readAllEntryMetadata(resolveDatabasePath(database, workspacePath)),
    ]);

    // Merge metadata into entries before conversion, resolving their
    // timestamps against the sidecar.
    const entriesWithMetadata = rawEntries.map((rawEntry) => {
      const { entry, sidecarOutdated } = mergeEntryMetadata(
        rawEntry,
        database.properties,
        metadataMap[resolveEntryMetadataKey(rawEntry.path)],
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
      entryIdByAddress.set(resolveEntryAddressKey(entry, database), entry.id);
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
      sqlUpsertEntries(database.id, sqlRecords, { silent: true }, workspaceId);
    }
  }

  // Seed the sidecars in one batch at the end, keeping the index build
  // itself a read pass.
  await Promise.all(
    outdatedSidecars.map(({ database, entry }) =>
      writeEntryMetadata(
        resolveDatabasePath(database, workspacePath),
        entry.path,
        entry.metadata,
      ),
    ),
  );
}
