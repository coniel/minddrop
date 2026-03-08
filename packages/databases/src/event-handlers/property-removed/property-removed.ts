import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasePropertyRemovedEventData } from '../../events';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a property is removed from a database. Deletes virtual
 * collections for all entries if the removed property was a collection
 * type.
 */
export async function onRemoveProperty(
  data: DatabasePropertyRemovedEventData,
): Promise<void> {
  const { database, property } = data;

  // Only handle collection properties
  if (property.type !== 'collection') {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === database.id,
  );

  // Delete virtual collections for each entry
  await Promise.all(
    entries.map((entry) => {
      const collectionId = virtualCollectionId(entry.id, property.name);

      // Only delete if the collection exists in the store
      if (Collections.Store.get(collectionId)) {
        return Collections.delete(collectionId);
      }

      return Promise.resolve();
    }),
  );
}
