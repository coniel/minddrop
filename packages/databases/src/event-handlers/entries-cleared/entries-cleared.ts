import { Collections } from '@minddrop/collections';
import { DatabaseEntriesClearedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { sqlDeleteEntries } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database's entries are cleared. Removes the entries
 * from SQL in a single batch and deletes their virtual collections
 * for collection properties.
 */
export async function onClearEntries(data: DatabaseEntriesClearedEventData) {
  const { databaseId, entries } = data;

  // Nothing to do if no entries were cleared
  if (entries.length === 0) {
    return;
  }

  // Remove all cleared entries from the SQL index in a single batch
  sqlDeleteEntries(
    databaseId,
    entries.map((entry) => entry.id),
  );

  // Get the database to access its properties schema
  const database = getDatabase(databaseId);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing more to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Delete the virtual collection for each cleared entry's collection properties
  await Promise.all(
    entries.flatMap((entry) =>
      collectionProperties.map((property) => {
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
