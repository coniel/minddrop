import { CollectionUpdatedEventData } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { getDatabase } from '../../getDatabase';
import { sqlUpsertEntries } from '../../sql';
import { convertEntryToSqlRecord, parseVirtualCollectionId } from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Called when a collection is updated. If the collection is virtual,
 * updates the corresponding entry's property with the collection's
 * current items array and persists it to disk and SQL.
 */
export async function onUpdateCollection(
  data: CollectionUpdatedEventData,
): Promise<void> {
  const { updated } = data;

  // Only handle virtual collections
  if (!updated.virtual) {
    return;
  }

  // Parse the entry ID and property name from the collection ID
  const { entryId, propertyName } = parseVirtualCollectionId(updated.id);

  // Get the entry from the store
  const entry = DatabaseEntriesStore.get(entryId);

  if (!entry) {
    return;
  }

  // Build the updated entry with the collection's items
  const updatedEntry = {
    ...entry,
    properties: {
      ...entry.properties,
      [propertyName]: updated.items,
    },
  };

  // Update the entry in the store
  DatabaseEntriesStore.update(entryId, updatedEntry);

  // Write the updated entry to the file system
  await writeDatabaseEntry(entryId);

  // Update the SQL record with the new membership
  const database = getDatabase(entry.database);
  sqlUpsertEntries(database.id, [
    convertEntryToSqlRecord(updatedEntry, database),
  ]);
}
