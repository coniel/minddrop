import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasePropertyRemovedEventData } from '../../events';
import { sqlReindexDatabaseEntries } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a property is removed from a database. Re-indexes
 * SQL entries and deletes virtual collections for collection
 * properties.
 */
export async function onRemoveProperty(
  data: DatabasePropertyRemovedEventData,
): Promise<void> {
  const { database, property } = data;

  // Re-index all entries in SQL without the removed property
  sqlReindexDatabaseEntries(database);

  // Only handle collection properties for virtual collections
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
