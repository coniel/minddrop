import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasePropertyAddedEventData } from '../../events';
import { sqlReindexDatabaseEntries } from '../../sql';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a property is added to a database. Re-indexes
 * SQL entries and creates virtual collections for collection
 * properties.
 */
export function onAddProperty(data: DatabasePropertyAddedEventData): void {
  const { database, property } = data;

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
    const collectionEntries =
      (entry.properties[property.name] as string[]) || [];

    Collections.createVirtual(collectionId, name, collectionEntries);
  });
}
