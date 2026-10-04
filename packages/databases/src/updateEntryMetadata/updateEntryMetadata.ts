import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';
import { EntriesStore } from '../EntriesStore';
import { EntryMetadataUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getEntry } from '../getEntry';
import { EntryMetadata } from '../types';
import { resolveDatabasePath, resolveEntryPath } from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';

/**
 * Sets an entry's metadata, updating the store and writing the entry's
 * metadata sidecar.
 *
 * @param entryId - The ID of the entry to update.
 * @param metadata - The new metadata for the entry.
 * @param workspaceId - The workspace the entry belongs to. Omit for the active workspace.
 *
 * @throws {EntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry database does not exist.
 *
 * @dispatches databases:entry:metadata-updated
 */
export async function updateEntryMetadata(
  entryId: string,
  metadata: EntryMetadata,
  workspaceId?: string,
): Promise<void> {
  // Look up the entry and its database to find the database path
  const entry = getEntry(entryId, true, workspaceId);
  const database = getDatabase(entry.database, true, workspaceId);

  // Set the metadata on the stored entry so successive updates
  // compose from current state.
  EntriesStore.in(workspaceId).update(entryId, { metadata });

  // Dispatch metadata updated event
  Events.dispatch(EntryMetadataUpdatedEvent, {
    entryId,
    databaseId: entry.database,
    metadata,
  });

  const workspacePath = Workspaces.resolvePath(workspaceId);

  // Write the entry's metadata sidecar
  await writeEntryMetadata(
    resolveDatabasePath(database, workspacePath),
    resolveEntryPath(entry, database, workspacePath),
    metadata,
  );
}
