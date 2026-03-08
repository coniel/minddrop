import { CollectionUpdatedEventData } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { parseVirtualCollectionId } from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Called when a collection is updated. If the collection is virtual,
 * updates the corresponding entry's property with the collection's
 * current entries array.
 */
export async function onUpdateCollection(
  data: CollectionUpdatedEventData,
): Promise<void> {
  const { updated } = data;

  // Only handle virtual collections
  if (!updated.virtual) {
    return;
  }

  // Parse the entry ID and property name from the collection ID
  const { entryId, propertyName } = parseVirtualCollectionId(updated.id);

  // Get the entry from the store
  const entry = DatabaseEntriesStore.get(entryId);

  if (!entry) {
    return;
  }

  // Update the entry's property with the collection's entries
  DatabaseEntriesStore.update(entryId, {
    ...entry,
    properties: {
      ...entry.properties,
      [propertyName]: updated.entries,
    },
  });

  // Write the updated entry to the file system
  await writeDatabaseEntry(entryId);
}
