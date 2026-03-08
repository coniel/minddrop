import { Collections } from '@minddrop/collections';
import { getDatabase } from '../../getDatabase';
import { DatabaseEntry } from '../../types';
import { virtualCollectionId, virtualCollectionName } from '../../utils';

/**
 * Called when a database entry is created. Creates a virtual collection
 * for each collection property defined in the database schema.
 */
export function onCreateEntry(entry: DatabaseEntry) {
  // Get the database to access its properties schema
  const database = getDatabase(entry.database);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Create a virtual collection for each collection property
  collectionProperties.forEach((property) => {
    // Deterministic ID based on entry and property
    const collectionId = virtualCollectionId(entry.id, property.name);

    // Collection name: [database] - [entry] - [property]
    const name = virtualCollectionName(
      database.name,
      entry.title,
      property.name,
    );

    // Get the entry IDs from the property value
    const entries = (entry.properties[property.name] as string[]) || [];

    // Create the virtual collection in the store
    Collections.createVirtual(collectionId, name, entries);
  });
}
