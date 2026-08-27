import { Collections } from '@minddrop/collections';

/**
 * Removes the given entry IDs from every collection that contains
 * any of them as members.
 *
 * @param entryIds - The entry IDs to remove.
 */
export async function removeEntriesFromCollections(
  entryIds: string[],
): Promise<void> {
  const removedIds = new Set(entryIds);

  // Find collections containing any of the entries
  const affectedCollections = Collections.getAll().filter((collection) =>
    collection.items.some((id) => removedIds.has(id)),
  );

  // Remove the entries from each affected collection
  await Promise.all(
    affectedCollections.map((collection) =>
      Collections.removeItems(collection.id, entryIds),
    ),
  );
}
