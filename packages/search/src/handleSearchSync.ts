import { removeIndexEntries } from './removeIndexEntries';
import { upsertIndexEntries } from './upsertIndexEntries';

/**
 * Back-end only. Handles incremental sync after entry
 * changes. Updates the MiniSearch index only; SQL sync
 * is handled by sql-databases.
 *
 * @param workspaceId - The workspace whose index to update.
 * @param action - Whether the entries were upserted or deleted.
 * @param entries - The upserted entries, on upsert.
 * @param entryIds - The IDs of the deleted entries, on delete.
 */
export function handleSearchSync({
  workspaceId,
  action,
  entries,
  entryIds,
}: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  entries?: { id: string; title: string; databaseId: string }[];
  entryIds?: string[];
}): void {
  // Re-index the changed entries
  if (action === 'upsert' && entries?.length) {
    upsertIndexEntries(workspaceId, entries);
  }

  // Drop the deleted entries from the index
  if (action === 'delete' && entryIds?.length) {
    removeIndexEntries(workspaceId, entryIds);
  }
}
