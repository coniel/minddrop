import { Events } from '@minddrop/events';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryMetadataUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntryMetadata } from '../types';
import { writeEntryMetadata } from '../writeEntryMetadata';

/**
 * Sets an entry's metadata, updating the store and writing the entry's
 * metadata sidecar.
 *
 * @param entryId - The ID of the entry to update.
 * @param metadata - The new metadata for the entry.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry database does not exist.
 *
 * @dispatches database-entries:entry:metadata-updated
 */
export async function updateEntryMetadata(
  entryId: string,
  metadata: DatabaseEntryMetadata,
): Promise<void> {
  // Look up the entry and its database to find the database path
  const entry = getDatabaseEntry(entryId);
  const database = getDatabase(entry.database);

  // Set the metadata on the stored entry so successive updates
  // compose from current state
  DatabaseEntriesStore.update(entryId, { metadata });

  // Write the entry's metadata sidecar
  await writeEntryMetadata(database.path, entry.path, metadata);

  // Dispatch metadata updated event
  Events.dispatch(DatabaseEntryMetadataUpdatedEvent, {
    entryId,
    databaseId: entry.database,
    metadata,
  });
}
