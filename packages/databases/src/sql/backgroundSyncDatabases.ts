import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { loadCoreSerializers } from '../DatabaseEntrySerializers';
import { listEntryMetadataKeys } from '../listEntryMetadataKeys';
import { readDatabaseEntries } from '../readDatabaseEntries';
import { readEntryMetadata } from '../readEntryMetadata';
import { readWorkspaceDatabases } from '../readWorkspaceDatabases';
import type {
  BackgroundSyncChangeset,
  Database,
  DatabaseEntry,
  EntrySyncRecord,
} from '../types';
import {
  convertEntryToSqlRecord,
  entryMetadataKey,
  matchEntriesToSqlRecords,
  mergeEntryMetadata,
  resolveCollectionProperties,
  resolveDatabaseMetadataDirPath,
} from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';
import { sqlDeleteDatabase } from './sqlDeleteDatabase';
import { sqlDeleteEntries } from './sqlDeleteEntries';
import { sqlGetAllDatabases } from './sqlGetAllDatabases';
import { sqlGetAllEntriesFull } from './sqlGetAllEntriesFull';
import { sqlGetEntrySyncRecords } from './sqlGetEntrySyncRecords';
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

  // Get existing databases from SQL
  const sqlDatabases = sqlGetAllDatabases();
  const sqlDatabaseIds = new Set(sqlDatabases.map((database) => database.id));

  // Read current database configs from the filesystem, passing the
  // recorded paths so that a copied database directory rather than
  // the original is the one given a fresh ID
  const fileSystemDatabases = await readWorkspaceDatabases(
    workspacePath,
    new Map(sqlDatabases.map((database) => [database.id, database.path])),
  );

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
  const fileSystemDatabaseIds = new Set<string>(
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
    const entryIds = sqlGetEntrySyncRecords(id).map((record) => record.id);

    allDeletedEntryIds.push(...entryIds);
    sqlDeleteDatabase(id, { silent: true });
  }

  // Workspace-wide path index used to resolve entry references
  const entryIdByPath = new Map<string, string>();

  // Staged per-database sync data for the resolution pass
  const staged: {
    database: Database;
    entries: DatabaseEntry[];
    existingRecords: EntrySyncRecord[];
    deletedIds: string[];
  }[] = [];

  // Pass 1: read and match all entries so references can resolve
  // across databases
  for (const database of fileSystemDatabases) {
    // Read the entries from disk. Their metadata is read after the
    // diff, for the changed entries only.
    const rawEntries = await readDatabaseEntries(database);

    // The database's SQL record holds its path as of the last sync
    const sqlDatabase = sqlDatabases.find(
      (record) => record.id === database.id,
    );

    // Get existing sync records from SQL, rebasing their paths onto
    // the database's current path so entries keep their identities
    // when the database directory was renamed while the app was closed
    const existingRecords = sqlGetEntrySyncRecords(database.id).map(
      (record) => {
        if (!sqlDatabase || !record.path.startsWith(`${sqlDatabase.path}/`)) {
          return record;
        }

        return {
          ...record,
          path: database.path + record.path.slice(sqlDatabase.path.length),
        };
      },
    );

    // Match fresh entries to existing entries by path so they
    // take over the existing IDs (disk reads mint fresh ones)
    const { records: entries, deletedIds } = matchEntriesToSqlRecords(
      rawEntries,
      existingRecords,
    );

    const deletedIdSet = new Set(deletedIds);

    // Index the existing entries by path, skipping deleted ones
    existingRecords.forEach((record) => {
      if (!deletedIdSet.has(record.id)) {
        entryIdByPath.set(record.path, record.id);
      }
    });

    // Index the fresh entries by path
    entries.forEach((entry) => {
      entryIdByPath.set(entry.path, entry.id);
    });

    // Stage the matched entries for the resolution pass
    staged.push({ database, entries, existingRecords, deletedIds });
  }

  // Entries whose sidecar timestamps need writing, collected during the
  // diff pass and written in one batch at the end
  const outdatedSidecars: { database: Database; entry: DatabaseEntry }[] = [];

  // Pass 2: resolve entry references, diff, and update SQL
  for (const { database, entries, existingRecords, deletedIds } of staged) {
    // Resolve collection property addresses to entry IDs
    const resolvedEntries = entries.map((entry) => ({
      ...entry,
      properties: resolveCollectionProperties(
        entry.properties,
        database,
        entryIdByPath,
      ),
    }));

    // Index the existing content hashes by entry ID. Hashes rather
    // than timestamps, since an entry's 'last-modified' property is
    // only updated by the app, leaving external edits undetected in
    // databases which define one.
    const existingHashes = new Map(
      existingRecords.map((record) => [record.id, record.contentHash]),
    );

    // Find new or modified entries
    const changedEntries = resolvedEntries.filter((entry) => {
      const existingHash = existingHashes.get(entry.id);

      return existingHash === undefined || existingHash !== entry.contentHash;
    });

    // Read the sidecars of the changed entries only. Sidecars hold
    // app-managed state written alongside the entry, so one changing
    // on its own is not a case worth scanning every entry for.
    const merged = await Promise.all(
      changedEntries.map(async (entry) =>
        mergeEntryMetadata(
          entry,
          database.properties,
          await readEntryMetadata(database.path, entry.path),
        ),
      ),
    );

    // Convert the changed entries to SQL records
    const changedRecords = merged.map(({ entry }) =>
      convertEntryToSqlRecord(entry, database),
    );

    // Upsert changed entries to SQL
    if (changedRecords.length > 0) {
      sqlUpsertEntries(database.id, changedRecords, { silent: true });
    }

    // Collect the entries whose sidecar has no timestamps yet, or whose
    // timestamp properties have since been edited outside the app
    outdatedSidecars.push(
      ...merged
        .filter(({ sidecarOutdated }) => sidecarOutdated)
        .map(({ entry }) => ({ database, entry })),
    );

    // Delete removed entries from SQL
    if (deletedIds.length > 0) {
      sqlDeleteEntries(database.id, deletedIds, { silent: true });
    }

    // Sweep sidecars belonging to entries deleted outside the app,
    // which have no owner to delete them
    await sweepOrphanedMetadata(
      database,
      entries.map((entry) => entry.path),
    );

    // Track changed entry IDs
    for (const record of changedRecords) {
      allUpsertedEntryIds.add(record.id);
    }

    allDeletedEntryIds.push(...deletedIds);
  }

  // Seed the sidecars in one batch at the end, keeping the diff itself
  // a read pass
  await Promise.all(
    outdatedSidecars.map(({ database, entry }) =>
      writeEntryMetadata(database.path, entry.path, entry.metadata),
    ),
  );

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
 * Removes metadata sidecars which no longer have an entry at their
 * path, as when an entry file is deleted outside the app.
 */
async function sweepOrphanedMetadata(
  database: Database,
  entryPaths: string[],
): Promise<void> {
  // Listed rather than read, since only the keys are needed
  const metadataKeys = await listEntryMetadataKeys(database.path);

  // Sidecars are keyed by the entry's database-relative path
  const entryKeys = new Set(entryPaths.map((path) => entryMetadataKey(path)));

  const orphanedKeys = metadataKeys.filter((key) => !entryKeys.has(key));

  await Promise.all(
    orphanedKeys.map((key) =>
      Fs.removeFile(
        `${resolveDatabaseMetadataDirPath(database.path)}/${key}.json`,
      ),
    ),
  );
}
