import { Collections } from '@minddrop/collections';
import { toJsonValue } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasePropertyAddedEventData } from '../../events';
import { recordDatabaseHistory } from '../../recordDatabaseHistory';
import { sqlReindexDatabaseEntries } from '../../sql';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a property is added to a database. Sets up the state
 * derived from it.
 *
 * @param data - The added property's event data.
 */
export async function onAddProperty(
  data: DatabasePropertyAddedEventData,
): Promise<void> {
  const { updated: database, property, action } = data;

  // Record the property's definition against the database's history
  await recordDatabaseHistory(database, {
    kind: 'definition',
    changes: [
      {
        part: property.name,
        from: null,
        to: toJsonValue(property),
      },
    ],
    action,
  });

  // Re-index all entries in SQL for the new property
  sqlReindexDatabaseEntries(database);

  // Only handle collection properties for virtual collections
  if (property.type !== 'collection') {
    return;
  }

  // Get entries belonging to this database
  const entries = DatabaseEntriesStore.getAllArray().filter(
    (entry) => entry.database === database.id,
  );

  // Create a virtual collection for each entry
  entries.forEach((entry) => {
    const collectionId = virtualCollectionId(entry.id, property.name);
    const name = virtualCollectionName(
      database.name,
      entry.title,
      property.name,
    );
    const collectionItems = (entry.properties[property.name] as string[]) || [];

    Collections.createVirtual(collectionId, name, collectionItems);
  });
}
