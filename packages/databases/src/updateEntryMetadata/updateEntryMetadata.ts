import { Events } from '@minddrop/events';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  DatabaseEntryMetadataUpdatedEvent,
  DatabaseEntryMetadataUpdatedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { readDatabaseMetadata } from '../readDatabaseMetadata';
import { DatabaseEntryMetadata } from '../types';
import { entryMetadataKey } from '../utils/entryMetadataKey';
import { writeDatabaseMetadata } from '../writeDatabaseMetadata';

const DEBOUNCE_MS = 500;

// Pending metadata updates per database path
const pendingUpdates: Map<
  string,
  Record<string, DatabaseEntryMetadata>
> = new Map();

// Debounce timers per database path
const flushTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

/**
 * Sets an entry's metadata, updating the store and queuing a debounced
 * write to the database metadata file. Successive calls for entries in
 * the same database are merged into a single read-modify-write cycle.
 *
 * Use `flushDatabaseMetadata` to force an immediate write (e.g. in tests
 * or before shutdown).
 *
 * @param entryId - The ID of the entry to update.
 * @param metadata - The new metadata for the entry.
 */
export function updateEntryMetadata(
  entryId: string,
  metadata: DatabaseEntryMetadata,
): void {
  // Look up the entry and its database to find the database path
  const entry = getDatabaseEntry(entryId);
  const database = getDatabase(entry.database);

  // Set the metadata on the stored entry so successive updates
  // compose from current state
  DatabaseEntriesStore.update(entryId, { metadata });

  // Metadata is keyed by the entry's database-relative path since the
  // file only holds this database's entries
  const key = entryMetadataKey(entry.path, database.path);

  // Merge the update into the pending map for this database
  const pending = pendingUpdates.get(database.path) ?? {};
  pending[key] = metadata;
  pendingUpdates.set(database.path, pending);

  // Clear any existing timer for this database
  const existingTimer = flushTimers.get(database.path);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Schedule a debounced flush
  flushTimers.set(
    database.path,
    setTimeout(() => {
      flushDatabaseMetadata(database.path);
    }, DEBOUNCE_MS),
  );

  // Dispatch metadata updated event
  Events.dispatch<DatabaseEntryMetadataUpdatedEventData>(
    DatabaseEntryMetadataUpdatedEvent,
    { entryId, databaseId: entry.database, metadata },
  );
}

/**
 * Re-keys a pending metadata entry from one metadata key to another.
 * Used during rename to ensure queued-but-unflushed metadata follows
 * the entry to its new key. Keys are database-relative (see
 * `entryMetadataKey`).
 *
 * No-op if the database has no pending updates or the old key
 * does not exist in the pending map.
 *
 * @param databasePath - The absolute path to the database directory.
 * @param oldKey - The metadata key to re-key from.
 * @param newKey - The metadata key to re-key to.
 */
export function rekeyPendingMetadata(
  databasePath: string,
  oldKey: string,
  newKey: string,
): void {
  const pending = pendingUpdates.get(databasePath);

  if (!pending || !(oldKey in pending)) {
    return;
  }

  // Move the value from the old key to the new key
  pending[newKey] = pending[oldKey];
  delete pending[oldKey];
}

/**
 * Immediately flushes any pending metadata updates for a database.
 * Reads the current metadata file, merges all queued updates, and
 * writes the result to disk.
 *
 * @param databasePath - The absolute path to the database directory.
 */
export async function flushDatabaseMetadata(
  databasePath: string,
): Promise<void> {
  const pending = pendingUpdates.get(databasePath);

  if (!pending) {
    return;
  }

  // Clear pending state and cancel any scheduled timer
  pendingUpdates.delete(databasePath);
  const timer = flushTimers.get(databasePath);

  if (timer) {
    clearTimeout(timer);
    flushTimers.delete(databasePath);
  }

  // Read the current metadata, merge pending updates, and write back
  const current = await readDatabaseMetadata(databasePath);
  const merged = { ...current, ...pending };

  await writeDatabaseMetadata(databasePath, merged);
}
