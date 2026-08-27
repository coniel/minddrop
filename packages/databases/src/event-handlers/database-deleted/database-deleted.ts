import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseDeletedEventData } from '../../events';
import { removeEntriesFromCollections } from '../../removeEntriesFromCollections';
import { sqlDeleteDatabase } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database is deleted. Removes from SQL, deletes
 * all database views, cleans up virtual collections, and removes
 * the database's entries from collections referencing them.
 */
export async function onDeleteDatabase(
  data: DatabaseDeletedEventData,
): Promise<void> {
  // Delete from SQL
  sqlDeleteDatabase(data.id);

  // Delete all views belonging to this database
  const databaseViews = DataViews.getByDataSource('database', data.id);

  await Promise.all(databaseViews.map((view) => DataViews.delete(view.id)));

  // Find collection properties in the database schema
  const collectionProperties = data.properties.filter(
    (property) => property.type === 'collection',
  );

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === data.id,
  );

  // Delete the entries' own virtual collections before membership
  // cleanup so no update is attempted for the deleted entries
  await Promise.all(
    collectionProperties.flatMap((property) =>
      entries.map((entry) => {
        const collectionId = virtualCollectionId(entry.id, property.name);

        // Only delete if the collection exists in the store
        if (Collections.get(collectionId, false)) {
          return Collections.delete(collectionId);
        }

        return Promise.resolve();
      }),
    ),
  );

  // Remove the entries from collections referencing them as members
  await removeEntriesFromCollections(entries.map((entry) => entry.id));

  // Remove the entries from view configs referencing them
  await DataViews.removeReferences(entries.map((entry) => entry.id));
}
