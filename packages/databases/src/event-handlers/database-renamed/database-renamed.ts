import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabaseRenamedEventData } from '../../events';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a database is renamed. Updates the names of all
 * virtual collections associated with the database's entries'
 * collection properties to reflect the new database name.
 */
export async function onRenameDatabase(
  data: DatabaseRenamedEventData,
): Promise<void> {
  const { updated } = data;

  // Find collection properties in the database schema
  const collectionProperties = updated.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === updated.id,
  );

  // Update the name of each virtual collection
  await Promise.all(
    collectionProperties.flatMap((property) =>
      entries.map(async (entry) => {
        const collectionId = virtualCollectionId(entry.id, property.name);

        // Only update if the collection exists in the store
        if (!Collections.Store.get(collectionId)) {
          return;
        }

        // Update the collection name to reflect the new database name
        const name = virtualCollectionName(
          updated.name,
          entry.title,
          property.name,
        );

        await Collections.update(collectionId, { name });
      }),
    ),
  );
}
