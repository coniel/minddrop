import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryMetadataUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntryMetadata } from '../types';
import { resolveDatabaseEntryPath, resolveDatabasePath } from '../utils';
import { writeEntryMetadata } from '../writeEntryMetadata';

/**
 * Sets an entry's metadata, updating the store and writing the entry's
 * metadata sidecar.
 *
 * @param entryId - The ID of the entry to update.
 * @param metadata - The new metadata for the entry.
 * @param workspaceId - The workspace the entry belongs to. Omit for the active workspace.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry database does not exist.
 *
 * @dispatches database-entries:entry:metadata-updated
 */
export async function updateEntryMetadata(
  entryId: string,
  metadata: DatabaseEntryMetadata,
  workspaceId?: string,
): Promise<void> {
  // Look up the entry and its database to find the database path
  const entry = getDatabaseEntry(entryId, true, workspaceId);
  const database = getDatabase(entry.database, true, workspaceId);

  // Set the metadata on the stored entry so successive updates
  // compose from current state.
  DatabaseEntriesStore.in(workspaceId).update(entryId, { metadata });

  // Dispatch metadata updated event
  Events.dispatch(DatabaseEntryMetadataUpdatedEvent, {
    entryId,
    databaseId: entry.database,
    metadata,
  });

  const workspacePath = Workspaces.resolvePath(workspaceId);

  // Write the entry's metadata sidecar
  await writeEntryMetadata(
    resolveDatabasePath(database, workspacePath),
    resolveDatabaseEntryPath(entry, database, workspacePath),
    metadata,
  );
}
