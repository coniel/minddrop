import { Collections } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasePropertyAddedEventData } from '../../events';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a property is added to a database. Creates virtual
 * collections for all existing entries if the new property is a
 * collection type.
 */
export function onAddProperty(data: DatabasePropertyAddedEventData): void {
  const { database, property } = data;

  // Only handle collection properties
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
