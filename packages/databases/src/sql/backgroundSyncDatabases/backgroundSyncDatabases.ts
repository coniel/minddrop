import { Fs } from '@minddrop/file-system';
import { isDeepEqual, restoreDates, titleFromPath } from '@minddrop/utils';
import { loadCoreSerializers } from '../../EntrySerializers';
import { listEntryMetadataKeys } from '../../listEntryMetadataKeys';
import { readAllEntryMetadata } from '../../readAllEntryMetadata';
import { readEntries } from '../../readEntries';
import { readEntryMetadata } from '../../readEntryMetadata';
import { readWorkspaceDatabases } from '../../readWorkspaceDatabases';
import type { BackgroundSyncChangeset, Database, Entry } from '../../types';
import {
  convertEntryToSqlRecord,
  hashDatabaseProperties,
  matchEntriesToSqlRecords,
  mergeEntryMetadata,
  resolveCollectionProperties,
  resolveDatabaseMetadataDirPath,
  resolveDatabasePath,
  resolveEntryAddressKey,
  resolveEntryMetadataKey,
} from '../../utils';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import { sqlDeleteDatabase } from '../sqlDeleteDatabase';
import { sqlDeleteEntries } from '../sqlDeleteEntries';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
import { sqlGetEntriesFull } from '../sqlGetEntriesFull';
import { sqlGetEntrySyncRecords } from '../sqlGetEntrySyncRecords';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';

/**
 * Scans the filesystem for changes that occurred while the
 * app was not running. Compares against SQL, updates SQL,
 * and returns a changeset for the frontend to patch its
 * stores.
 *
 * Called as a fire-and-forget background task after the app
 * has finished initializing from SQL.
 *
 * @param workspaceId - The ID of the workspace to sync.
 * @param workspacePath - The absolute path to the workspace root.
 * @returns The changeset of upserted and deleted databases and entries.
 */
export async function backgroundSyncDatabases(
  workspaceId: string,
  workspacePath: string,
): Promise<BackgroundSyncChangeset> {
  // Ensure serializers are loaded
  loadCoreSerializers();

  // Get existing databases from SQL
  const sqlDatabases = sqlGetAllDatabases(workspaceId);
  const sqlDatabaseIds = new Set(sqlDatabases.map((database) => database.id));

  // Read current database configs from the filesystem, passing the
  // recorded paths so that a copied database directory rather than
  // the original is the one given a fresh ID.
  const fileSystemDatabases = await readWorkspaceDatabases(
    workspacePath,
    new Map(sqlDatabases.map((database) => [database.id, database.path])),
  );

  // Detect new or updated databases
  const upsertedDatabases: Database[] = [];

  // IDs of the databases whose property schema changed since they
  // were indexed. Their entries are all re-indexed.
  const schemaChangedIds = new Set<string>();

  for (const database of fileSystemDatabases) {
    const existing = sqlDatabases.find(
      (sqlDatabase) => sqlDatabase.id === database.id,
    );

    // New database or metadata changed
    const isNew = !existing;
    const schemaChanged =
      existing &&
      existing.propertiesHash !== hashDatabaseProperties(database.properties);
    const metadataChanged =
      existing &&
      (existing.name !== database.name ||
        existing.icon !== database.icon ||
        existing.path !== database.path ||
        schemaChanged);

    // Track the database if its schema changed
    if (schemaChanged) {
      schemaChangedIds.add(database.id);
    }

    if (isNew || metadataChanged) {
      // Upsert to SQL
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
    const entryIds = sqlGetEntrySyncRecords(id, workspaceId).map(
      (record) => record.id,
    );

    allDeletedEntryIds.push(...entryIds);
    sqlDeleteDatabase(id, { silent: true }, workspaceId);
  }

  // Workspace-wide address index used to resolve entry references,
  // keyed lowercased to match addresses case-insensitively
  const entryIdByAddress = new Map<string, string>();

  // Staged per-database sync data for the resolution pass
  const staged: {
    database: Database;
    entries: Entry[];
    deletedIds: string[];
    retainedPaths: string[];
  }[] = [];

  // Pass 1: read and match all entries so references can resolve
  // across databases.
  for (const database of fileSystemDatabases) {
    // Get existing sync records from SQL. Their paths are addressed
    // from the database, so a database directory renamed while the app
    // was closed still matches and its entries keep their identities.
    const existingRecords = sqlGetEntrySyncRecords(database.id, workspaceId);

    // Read the database's sidecars
    const sidecars = await readAllEntryMetadata(
      resolveDatabasePath(database, workspacePath),
    );

    // List the sidecar keys on disk, unreadable sidecars included. An
    // unreadable sidecar can then be told apart from a missing one.
    const sidecarKeys = new Set(
      await listEntryMetadataKeys(resolveDatabasePath(database, workspacePath)),
    );

    // Collect the indexed content hashes of the entries whose sidecar
    // matches their indexed metadata. Only these may be skipped, so an
    // entry whose sidecar changed is re-read. An unreadable sidecar is
    // left alone, since re-reading its entry would overwrite it.
    const indexedHashes = new Map(
      existingRecords
        .filter((record) => {
          // Resolve the record's sidecar key
          const key = resolveEntryMetadataKey(record.path);

          // Check if the sidecar exists but could not be read. If so, keep
          // the entry's content hash.
          if (sidecarKeys.has(key) && !(key in sidecars)) {
            return true;
          }

          // Compare the sidecar with the indexed metadata
          return isDeepEqual(
            sidecars[key] ?? {},
            restoreDates(JSON.parse(record.metadata)),
          );
        })
        .map((record) => [record.path, record.contentHash]),
    );

    // Read the new and modified entries from disk. Changes are detected
    // by content hash, since an entry's 'last-modified' property is
    // only updated by the app. A database whose schema changed has
    // every entry read, as the schema shapes how unchanged files are
    // indexed.
    const {
      entries: rawEntries,
      unchangedPaths,
      unreadablePaths,
    } = await readEntries(database, {
      workspacePath,
      indexedHashes: schemaChangedIds.has(database.id)
        ? undefined
        : indexedHashes,
    });

    // Retain the unchanged and unreadable entries. An unreadable file
    // is still there, so its entry is kept.
    const retainedPaths = [...unchangedPaths, ...unreadablePaths];

    // Match fresh entries to existing entries by path so they
    // take over the existing IDs (disk reads mint fresh ones)
    const { records: entries, deletedIds } = matchEntriesToSqlRecords(
      rawEntries,
      existingRecords,
      retainedPaths,
    );

    // Index the entries by address. Only the entries still on disk are
    // indexed, since an address names an entry by title rather than by
    // the location it last occupied.
    entries.forEach((entry) => {
      entryIdByAddress.set(resolveEntryAddressKey(entry, database), entry.id);
    });

    // Collect the retained paths for lookup
    const retained = new Set(retainedPaths);

    // Index the retained entries' addresses to their indexed IDs.
    // References to them then resolve.
    existingRecords
      .filter((record) => retained.has(record.path))
      .forEach((record) => {
        entryIdByAddress.set(
          resolveEntryAddressKey(
            { title: titleFromPath(record.path) },
            database,
          ),
          record.id,
        );
      });

    // Stage the matched entries for the resolution pass
    staged.push({ database, entries, deletedIds, retainedPaths });
  }

  // Entries whose sidecar timestamps need writing, collected during the
  // diff pass and written in one batch at the end.
  const outdatedSidecars: { database: Database; entry: Entry }[] = [];

  // Pass 2: resolve entry references, diff, and update SQL
  for (const { database, entries, deletedIds, retainedPaths } of staged) {
    // Resolve collection property addresses to entry IDs. Every read
    // entry is new or modified. The rest were retained.
    const changedEntries = entries.map((entry) => ({
      ...entry,
      properties: resolveCollectionProperties(
        entry.properties,
        database,
        entryIdByAddress,
      ),
    }));

    // Merge the changed entries' sidecars into them
    const merged = await Promise.all(
      changedEntries.map(async (entry) =>
        mergeEntryMetadata(
          entry,
          database.properties,
          await readEntryMetadata(
            resolveDatabasePath(database, workspacePath),
            entry.path,
          ),
        ),
      ),
    );

    // Convert the changed entries to SQL records
    const changedRecords = merged.map(({ entry }) =>
      convertEntryToSqlRecord(entry, database),
    );

    // Upsert changed entries to SQL
    if (changedRecords.length > 0) {
      sqlUpsertEntries(
        database.id,
        changedRecords,
        { silent: true },
        workspaceId,
      );
    }

    // Collect the entries whose sidecar has no timestamps yet, or whose
    // timestamp properties have since been edited outside the app.
    outdatedSidecars.push(
      ...merged
        .filter(({ sidecarOutdated }) => sidecarOutdated)
        .map(({ entry }) => ({ database, entry })),
    );

    // Delete removed entries from SQL
    if (deletedIds.length > 0) {
      sqlDeleteEntries(database.id, deletedIds, { silent: true }, workspaceId);
    }

    // Sweep sidecars belonging to entries deleted outside the app,
    // which have no owner to delete them
    await sweepOrphanedMetadata(
      database,
      [...entries.map((entry) => entry.path), ...retainedPaths],
      workspacePath,
    );

    // Track changed entry IDs
    for (const record of changedRecords) {
      allUpsertedEntryIds.add(record.id);
    }

    allDeletedEntryIds.push(...deletedIds);
  }

  // Seed the sidecars in one batch at the end, keeping the diff itself
  // a read pass.
  await Promise.all(
    outdatedSidecars.map(({ database, entry }) =>
      writeEntryMetadata(
        resolveDatabasePath(database, workspacePath),
        entry.path,
        entry.metadata,
      ),
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
      workspaceId,
      hasChanges: false,
      upsertedDatabases: [],
      deletedDatabaseIds: [],
      upsertedEntries: [],
      deletedEntryIds: [],
    };
  }

  // Query updated entries from SQL with full property data
  const upsertedEntries = sqlGetEntriesFull({
    entryIds: [...allUpsertedEntryIds],
    workspaceId,
  });

  return {
    workspaceId,
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
  workspacePath: string,
): Promise<void> {
  const databasePath = resolveDatabasePath(database, workspacePath);

  // Listed rather than read, since only the keys are needed
  const metadataKeys = await listEntryMetadataKeys(databasePath);

  // Sidecars are keyed by the entry's database-relative path
  const entryKeys = new Set(
    entryPaths.map((path) => resolveEntryMetadataKey(path)),
  );

  const orphanedKeys = metadataKeys.filter((key) => !entryKeys.has(key));

  await Promise.all(
    orphanedKeys.map((key) =>
      Fs.removeFile(
        `${resolveDatabaseMetadataDirPath(databasePath)}/${key}.json`,
      ),
    ),
  );
}
