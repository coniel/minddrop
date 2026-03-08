import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasePropertyRenamedEventData } from '../../events';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a database property is renamed. Updates the virtual
 * collections' IDs and names to reflect the new property name.
 */
export async function onRenameProperty(
  data: DatabasePropertyRenamedEventData,
): Promise<void> {
  const { database, oldName, newName } = data;

  // Check if the renamed property is a collection property
  const property = database.properties.find((p) => p.name === newName);

  if (!property || property.type !== 'collection') {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === database.id,
  );

  // Update virtual collection IDs and names
  await Promise.all(
    entries.map(async (entry) => {
      const oldCollectionId = virtualCollectionId(entry.id, oldName);

      // Only update if the collection exists in the store
      if (!Collections.Store.get(oldCollectionId)) {
        return;
      }

      const newCollectionId = virtualCollectionId(entry.id, newName);
      const name = virtualCollectionName(database.name, entry.title, newName);

      await Collections.update(oldCollectionId, { id: newCollectionId, name });
    }),
  );
}
