import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseDeletedEventData } from '../../events';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database is deleted. Deletes all virtual collections
 * associated with the database's entries' collection properties.
 */
export async function onDeleteDatabase(
  data: DatabaseDeletedEventData,
): Promise<void> {
  // Find collection properties in the database schema
  const collectionProperties = data.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === data.id,
  );

  // Delete all virtual collections for each entry's collection properties
  await Promise.all(
    collectionProperties.flatMap((property) =>
      entries.map((entry) => {
        const collectionId = virtualCollectionId(entry.id, property.name);

        // Only delete if the collection exists in the store
        if (Collections.Store.get(collectionId)) {
          return Collections.delete(collectionId);
        }

        return Promise.resolve();
      }),
    ),
  );
}
