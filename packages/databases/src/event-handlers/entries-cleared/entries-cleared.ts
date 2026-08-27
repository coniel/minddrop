import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DatabaseEntriesClearedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { removeEntriesFromCollections } from '../../removeEntriesFromCollections';
import { sqlDeleteEntries } from '../../sql';
import { virtualCollectionId } from '../../utils';

/**
 * Called when a database's entries are cleared. Removes the entries
 * from SQL in a single batch, deletes their virtual collections for
 * collection properties, and removes them from collections
 * referencing them.
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

  // Delete the entries' own virtual collections before membership
  // cleanup so no update is attempted for the cleared entries
  await Promise.all(
    entries.flatMap((entry) =>
      collectionProperties.map((property) => {
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
