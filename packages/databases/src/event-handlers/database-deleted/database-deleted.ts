import { Collections } from '@minddrop/collections';
import { Views } from '@minddrop/views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseDeletedEventData } from '../../events';
import { sqlDeleteDatabase } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database is deleted. Removes from SQL, deletes
 * all database views, and cleans up virtual collections.
 */
export async function onDeleteDatabase(
  data: DatabaseDeletedEventData,
): Promise<void> {
  // Delete from SQL
  sqlDeleteDatabase(data.id);

  // Delete all views belonging to this database
  const databaseViews = Views.getByDataSource('database', data.id);

  await Promise.all(databaseViews.map((view) => Views.delete(view.id)));

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
