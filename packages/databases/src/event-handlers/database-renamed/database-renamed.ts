import { Collections } from '@minddrop/collections';
import { DatabaseRenamedEventData } from '../../events';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import {
  sqlDeleteDatabase,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  convertEntryToSqlRecord,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database is renamed. Syncs to SQL and updates
 * virtual collection names.
 */
export async function onRenameDatabase(
  data: DatabaseRenamedEventData,
): Promise<void> {
  const { original, updated } = data;

  // Delete the old database record. CASCADE will clean
  // up its entries.
  sqlDeleteDatabase(original.id, { silent: true });

  // Insert the renamed database into SQL
  sqlUpsertDatabase({
    id: updated.id,
    name: updated.name,
    path: updated.path,
    icon: updated.icon,
  });

  // Re-upsert all entries under the new database ID
  const entries = getAllDatabaseEntries(updated.id);

  if (entries.length > 0) {
    const records = entries.map((entry) =>
      convertEntryToSqlRecord(entry, updated),
    );

    sqlUpsertEntries(updated.id, records);
  }

  // Find collection properties in the database schema
  const collectionProperties = updated.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Get entries belonging to this database
  const databaseEntries = getAllDatabaseEntries(updated.id);

  // Update the name of each virtual collection
  await Promise.all(
    collectionProperties.flatMap((property) =>
      databaseEntries.map(async (entry) => {
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
