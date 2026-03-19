import { Sql } from '@minddrop/sql';
import { Paths } from '@minddrop/utils';
import { loadCoreSerializers } from '../DatabaseEntrySerializers';
import { readDatabaseEntries } from '../readDatabaseEntries';
import { readDatabaseMetadata } from '../readDatabaseMetadata';
import { readWorkspaceDatabases } from '../readWorkspaceDatabases';
import type { BackgroundSyncChangeset, Database } from '../types';
import { convertEntryToSqlRecord } from '../utils';
import { sqlDeleteDatabase } from './sqlDeleteDatabase';
import { sqlDeleteEntries } from './sqlDeleteEntries';
import { sqlGetAllDatabases } from './sqlGetAllDatabases';
import { sqlGetAllEntriesFull } from './sqlGetAllEntriesFull';
import { sqlGetEntryTimestamps } from './sqlGetEntryTimestamps';
import { sqlUpdateEntryMetadata } from './sqlUpdateEntryMetadata';
import { sqlUpsertDatabase } from './sqlUpsertDatabase';
import { sqlUpsertEntries } from './sqlUpsertEntries';

/**
 * Scans the filesystem for changes that occurred while the
 * app was not running. Compares against SQL, updates SQL,
 * and returns a changeset for the frontend to patch its
 * stores.
 *
 * Called as a fire-and-forget background task after the app
 * has finished initializing from SQL.
 *
 * @param workspacePath - The absolute path to the workspace root.
 */
export async function backgroundSyncDatabases(
  workspacePath: string,
): Promise<BackgroundSyncChangeset> {
  // Ensure serializers and workspace path are set
  loadCoreSerializers();
  Paths.workspace = workspacePath;

  // Read current database configs from the filesystem
  const fileSystemDatabases = await readWorkspaceDatabases(workspacePath);

  // Get existing databases from SQL
  const sqlDatabases = sqlGetAllDatabases();
  const sqlDatabaseIds = new Set(sqlDatabases.map((database) => database.id));

  // Detect new or updated databases
  const upsertedDatabases: Database[] = [];

  for (const database of fileSystemDatabases) {
    const existing = sqlDatabases.find(
      (sqlDatabase) => sqlDatabase.id === database.id,
    );

    // New database or metadata changed
    const isNew = !existing;
    const metadataChanged =
      existing &&
      (existing.name !== database.name ||
        existing.icon !== database.icon ||
        existing.path !== database.path);

    if (isNew || metadataChanged) {
      // Upsert to SQL
      sqlUpsertDatabase(
        {
          id: database.id,
          name: database.name,
          path: database.path,
          icon: database.icon,
        },
        { silent: true },
      );

      upsertedDatabases.push(database);
    }
  }

  // Detect deleted databases
  const fileSystemDatabaseIds = new Set(
    fileSystemDatabases.map((database) => database.id),
  );
  const deletedDatabaseIds = [...sqlDatabaseIds].filter(
    (id) => !fileSystemDatabaseIds.has(id),
  );

  // Track all upserted/deleted entry IDs across databases
  const allUpsertedEntryIds = new Set<string>();
  const allDeletedEntryIds: string[] = [];

  // Collect entry IDs before CASCADE delete removes them,
  // then delete the databases from SQL
  for (const id of deletedDatabaseIds) {
    const entryIds = [...sqlGetEntryTimestamps(id).keys()];

    allDeletedEntryIds.push(...entryIds);
    sqlDeleteDatabase(id, { silent: true });
  }

  // Sync entries for each filesystem database
  for (const database of fileSystemDatabases) {
    // Read entries and metadata from disk in parallel
    const [rawEntries, metadataMap] = await Promise.all([
      readDatabaseEntries(database),
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

    // Convert to SQL records
    const freshRecords = entriesWithMetadata.map((entry) =>
      convertEntryToSqlRecord(entry, database),
    );

    // Get existing timestamps and metadata from SQL
    const existingTimestamps = sqlGetEntryTimestamps(database.id);
    const existingMetadata = sqlGetEntryMetadataMap(database.id);

    // Find new or modified entries
    const changedRecords = freshRecords.filter((record) => {
      const existingTimestamp = existingTimestamps.get(record.id);

      return (
        existingTimestamp === undefined ||
        existingTimestamp !== record.lastModified
      );
    });

    // Find entries whose metadata changed but content did not
    const metadataOnlyChanged = freshRecords.filter((record) => {
      const existingTimestamp = existingTimestamps.get(record.id);
      const existingMeta = existingMetadata.get(record.id);

      // Skip entries already covered by the full upsert
      if (
        existingTimestamp === undefined ||
        existingTimestamp !== record.lastModified
      ) {
        return false;
      }

      return existingMeta !== record.metadata;
    });

    // Find deleted entries
    const freshIds = new Set(freshRecords.map((record) => record.id));
    const deletedIds = [...existingTimestamps.keys()].filter(
      (id) => !freshIds.has(id),
    );

    // Upsert changed entries to SQL
    if (changedRecords.length > 0) {
      sqlUpsertEntries(database.id, changedRecords, { silent: true });
    }

    // Update metadata for metadata-only changes
    for (const record of metadataOnlyChanged) {
      sqlUpdateEntryMetadata(record.id, JSON.parse(record.metadata));
    }

    // Delete removed entries from SQL
    if (deletedIds.length > 0) {
      sqlDeleteEntries(database.id, deletedIds, { silent: true });
    }

    // Track changed entry IDs
    for (const record of changedRecords) {
      allUpsertedEntryIds.add(record.id);
    }

    for (const record of metadataOnlyChanged) {
      allUpsertedEntryIds.add(record.id);
    }

    allDeletedEntryIds.push(...deletedIds);
  }

  const hasChanges =
    upsertedDatabases.length > 0 ||
    deletedDatabaseIds.length > 0 ||
    allUpsertedEntryIds.size > 0 ||
    allDeletedEntryIds.length > 0;

  // If nothing changed, return empty changeset
  if (!hasChanges) {
    return {
      hasChanges: false,
      upsertedDatabases: [],
      deletedDatabaseIds: [],
      upsertedEntries: [],
      deletedEntryIds: [],
    };
  }

  // Query updated entries from SQL with full property data
  const allEntries = sqlGetAllEntriesFull();
  const upsertedEntries = allEntries.filter((entry) =>
    allUpsertedEntryIds.has(entry.id),
  );

  return {
    hasChanges: true,
    upsertedDatabases,
    deletedDatabaseIds,
    upsertedEntries,
    deletedEntryIds: allDeletedEntryIds,
  };
}

/**
 * Returns a map of entry ID to serialized metadata JSON for
 * all entries in the given database.
 */
function sqlGetEntryMetadataMap(databaseId: string): Map<string, string> {
  const rows = Sql.all<{ id: string; metadata: string }>(
    'SELECT id, metadata FROM entries WHERE database_id = ?',
    databaseId,
  );

  return new Map(rows.map((row) => [row.id, row.metadata]));
}
