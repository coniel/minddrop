import { Events } from '@minddrop/events';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  DatabaseEntryMetadataUpdatedEvent,
  DatabaseEntryMetadataUpdatedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntryMetadata } from '../types';
import { writeEntryMetadata } from '../writeEntryMetadata';

const DEBOUNCE_MS = 500;

interface PendingWrite {
  /**
   * The absolute path to the database the entry belongs to.
   */
  databasePath: string;

  /**
   * The metadata to write.
   */
  metadata: DatabaseEntryMetadata;
}

// Pending metadata writes per entry path
const pendingUpdates: Map<string, PendingWrite> = new Map();

// Debounce timers per entry path
const flushTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

/**
 * Sets an entry's metadata, updating the store and queuing a debounced
 * write to the entry's metadata sidecar.
 *
 * Use `flushEntryMetadata` or `flushAllEntryMetadata` to force an
 * immediate write (e.g. in tests or before shutdown).
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

  // Queue the write. A sidecar holds one entry's metadata and is
  // written whole, so a later update simply replaces an earlier one
  pendingUpdates.set(entry.path, {
    databasePath: database.path,
    metadata,
  });

  // Clear any existing timer for this entry
  const existingTimer = flushTimers.get(entry.path);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Schedule a debounced flush. View config writes are churny enough
  // to still want it, even writing one file per entry
  flushTimers.set(
    entry.path,
    setTimeout(() => {
      flushEntryMetadata(entry.path);
    }, DEBOUNCE_MS),
  );

  // Dispatch metadata updated event
  Events.dispatch<DatabaseEntryMetadataUpdatedEventData>(
    DatabaseEntryMetadataUpdatedEvent,
    { entryId, databaseId: entry.database, metadata },
  );
}

/**
 * Re-keys a pending metadata write from one entry path to another.
 * Used during rename so that queued-but-unflushed metadata follows the
 * entry to its new path.
 *
 * No-op if the entry has no pending write.
 *
 * @param oldPath - The entry path to re-key from.
 * @param newPath - The entry path to re-key to.
 */
export function rekeyPendingMetadata(oldPath: string, newPath: string): void {
  const pending = pendingUpdates.get(oldPath);

  if (!pending) {
    return;
  }

  // Move the pending write to the new path
  pendingUpdates.delete(oldPath);
  pendingUpdates.set(newPath, pending);
}

/**
 * Immediately writes an entry's pending metadata to its sidecar.
 *
 * @param entryPath - The absolute path of the entry file.
 */
export async function flushEntryMetadata(entryPath: string): Promise<void> {
  const pending = pendingUpdates.get(entryPath);

  if (!pending) {
    return;
  }

  // Clear pending state and cancel any scheduled timer
  pendingUpdates.delete(entryPath);
  const timer = flushTimers.get(entryPath);

  if (timer) {
    clearTimeout(timer);
    flushTimers.delete(entryPath);
  }

  // The sidecar holds only this entry's metadata, so it is written
  // whole with no read and merge
  await writeEntryMetadata(pending.databasePath, entryPath, pending.metadata);
}

/**
 * Immediately writes every entry's pending metadata to its sidecar.
 */
export async function flushAllEntryMetadata(): Promise<void> {
  const entryPaths = [...pendingUpdates.keys()];

  await Promise.all(entryPaths.map(flushEntryMetadata));
}
