import { Collections } from '@minddrop/collections';

/**
 * Removes the given entry IDs from every collection that contains
 * any of them as members.
 *
 * @param entryIds - The entry IDs to remove.
 * @param workspaceId - The workspace the collections belong to. Omit for the active workspace.
 */
export async function removeEntriesFromCollections(
  entryIds: string[],
  workspaceId?: string,
): Promise<void> {
  const removedIds = new Set(entryIds);

  // Find collections containing any of the entries
  const affectedCollections = Collections.getAll(workspaceId).filter(
    (collection) => collection.items.some((id) => removedIds.has(id)),
  );

  // Remove the entries from each affected collection
  await Promise.all(
    affectedCollections.map((collection) =>
      Collections.removeItems(collection.id, entryIds, workspaceId),
    ),
  );
}
