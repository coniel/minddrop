import { Fs } from '@minddrop/file-system';
import { loadCoreSerializers } from '../../EntrySerializers';
import { EntrySerializersRegistry } from '../../EntrySerializersRegistry';
import { readEntryIfChanged } from '../../readEntryIfChanged';
import { readEntryMetadata } from '../../readEntryMetadata';
import { removeEntryMetadataFile } from '../../removeEntryMetadataFile';
import type {
  BackgroundSyncChangeset,
  Database,
  Entry,
  EntryFileChange,
  EntrySyncRecord,
} from '../../types';
import {
  convertEntryToSqlRecord,
  mergeEntryFileChanges,
  mergeEntryMetadata,
  resolveCollectionProperties,
  resolveDatabasePath,
  resolveEntryAddressKey,
  resolveEntryPath,
} from '../../utils';
import { writeEntryMetadata } from '../../writeEntryMetadata';
import { sqlDeleteEntries } from '../sqlDeleteEntries';
import { sqlGetEntriesFull } from '../sqlGetEntriesFull';
import { sqlGetEntryIdsByAddress } from '../sqlGetEntryIdsByAddress';
import { sqlGetEntrySyncRecords } from '../sqlGetEntrySyncRecords';
import { sqlUpsertEntries } from '../sqlUpsertEntries';

/**
 * Re-indexes the entries whose files changed outside of the app,
 * reading only those entries' files. Returns the changeset of
 * upserted and deleted entries.
 *
 * @param workspaceId - The ID of the workspace the entries belong to.
 * @param workspacePath - The absolute path to the workspace root.
 * @param databases - The databases the changed entries belong to.
 * @param changes - The changed entry files.
 * @returns The changeset of upserted and deleted entries.
 */
export async function syncEntryFiles(
  workspaceId: string,
  workspacePath: string,
  databases: Database[],
  changes: EntryFileChange[],
): Promise<BackgroundSyncChangeset> {
  // Ensure serializers are loaded
  loadCoreSerializers();

  // The entries read from disk
  const read: { database: Database; entry: Entry }[] = [];
  // The IDs of the deleted entries
  const deletedIds: string[] = [];

  for (const database of databases) {
    // Merge the database's changes into one per entry
    const databaseChanges = mergeEntryFileChanges(
      changes.filter((change) => change.databaseId === database.id),
    );

    // Skip databases with no changed entries
    if (!databaseChanges.length) {
      continue;
    }

    // Get the database's entry serializer and directory path
    const serializer = EntrySerializersRegistry.get(database.entrySerializer);
    const databasePath = resolveDatabasePath(database, workspacePath);

    // Index the database's existing records by path
    const existingByPath = new Map(
      sqlGetEntrySyncRecords(database.id, workspaceId).map((record) => [
        record.path,
        record,
      ]),
    );

    // The records of the entries whose primary file is gone
    const deletedRecords: EntrySyncRecord[] = [];

    for (const change of databaseChanges) {
      // Get the entry's existing record, if indexed
      const existing = existingByPath.get(change.path);

      // Check if the entry's primary file is gone. If so, mark its
      // record for deletion.
      if (
        !(await Fs.exists(
          resolveEntryPath(change.path, database, workspacePath),
        ))
      ) {
        if (existing) {
          deletedRecords.push(existing);
        }

        continue;
      }

      // Read the entry unless its contents match the index. A changed
      // sidecar skips the comparison, since the entry file itself may
      // be unchanged.
      const result = await readEntryIfChanged(
        change.path,
        database,
        serializer,
        {
          workspacePath,
          indexedHash:
            change.file === 'entry' ? existing?.contentHash : undefined,
        },
      );

      // Skip unchanged and unreadable entries. Their indexed state is
      // kept.
      if (result.status !== 'changed') {
        continue;
      }

      // Stage the read entry under its existing ID. Disk reads mint
      // fresh IDs.
      read.push({
        database,
        entry: { ...result.entry, id: existing?.id ?? result.entry.id },
      });
    }

    // Check if any entries were removed. If not, there is nothing to
    // delete.
    if (!deletedRecords.length) {
      continue;
    }

    // Delete the removed entries from SQL
    const ids = deletedRecords.map((record) => record.id);

    sqlDeleteEntries(database.id, ids, { silent: true }, workspaceId);

    // Remove their sidecars. These have no owner left to remove them.
    await Promise.all(
      deletedRecords.map((record) =>
        removeEntryMetadataFile(databasePath, record.path),
      ),
    );

    // Track the deleted entries' IDs
    deletedIds.push(...ids);
  }

  // Index the workspace's entry addresses from SQL. References then
  // resolve without reading any other entry.
  const entryIdByAddress = sqlGetEntryIdsByAddress(workspaceId);

  // Add the read entries to the address index
  read.forEach(({ database, entry }) => {
    entryIdByAddress.set(resolveEntryAddressKey(entry, database), entry.id);
  });

  // The IDs of the upserted entries
  const upsertedIds: string[] = [];

  for (const { database, entry } of read) {
    // Resolve the database's directory path
    const databasePath = resolveDatabasePath(database, workspacePath);

    // Resolve the entry's references and its metadata against its
    // sidecar.
    const { entry: merged, sidecarOutdated } = mergeEntryMetadata(
      {
        ...entry,
        properties: resolveCollectionProperties(
          entry.properties,
          database,
          entryIdByAddress,
        ),
      },
      database.properties,
      await readEntryMetadata(databasePath, entry.path),
    );

    // Upsert the entry to SQL
    sqlUpsertEntries(
      database.id,
      [convertEntryToSqlRecord(merged, database)],
      { silent: true },
      workspaceId,
    );

    // Seed the sidecar's timestamps, or bring them in line with
    // timestamp properties edited outside the app.
    if (sidecarOutdated) {
      await writeEntryMetadata(databasePath, merged.path, merged.metadata);
    }

    // Track the upserted entry's ID
    upsertedIds.push(merged.id);
  }

  // Return the changeset, with the upserted entries' full SQL records
  return {
    workspaceId,
    hasChanges: upsertedIds.length > 0 || deletedIds.length > 0,
    upsertedDatabases: [],
    deletedDatabaseIds: [],
    upsertedEntries: sqlGetEntriesFull(upsertedIds, workspaceId),
    deletedEntryIds: deletedIds,
  };
}
