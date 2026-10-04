import { Collections } from '@minddrop/collections';
import { EntryCreatedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { recordEntryHistory } from '../../recordEntryHistory';
import { sqlUpsertEntries } from '../../sql';
import {
  convertEntryToSqlRecord,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database entry is created. Syncs to SQL, opens the
 * entry's history and creates virtual collections for collection
 * properties.
 */
export async function onCreateEntry(data: EntryCreatedEventData) {
  // Get the database to access its properties schema
  const database = getDatabase(data.database);

  // Sync to SQL
  const record = convertEntryToSqlRecord(data, database);
  sqlUpsertEntries(database.id, [record]);

  // Open the entry's history
  await recordEntryHistory(database, data, {
    kind: 'created',
  });

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
    const collectionId = virtualCollectionId(data.id, property.name);

    // Collection name: [database] - [entry] - [property]
    const name = virtualCollectionName(
      database.name,
      data.title,
      property.name,
    );

    // Get the entry IDs from the property value
    const entries = (data.properties[property.name] as string[]) || [];

    // Create the virtual collection in the store
    Collections.createVirtual(collectionId, name, entries);
  });
}
