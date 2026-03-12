import { Collections, VirtualCollectionData } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { readDatabaseEntryFiles } from '../readDatabaseEntryFiles';
import { readDatabaseMetadata } from '../readDatabaseMetadata';
import { virtualCollectionId, virtualCollectionName } from '../utils';

/**
 * Initializes database entries by reading them from the file system
 * and loading them into the store.
 */
export async function initializeDatabaseEntries(): Promise<void> {
  // Get all databases
  const databases = DatabasesStore.getAllArray();

  // Read all entries and metadata from all databases in parallel
  const [databaseEntries, databaseMetadata] = await Promise.all([
    Promise.all(databases.map((database) => readDatabaseEntryFiles(database))),
    Promise.all(
      databases.map((database) => readDatabaseMetadata(database.path)),
    ),
  ]);

  // Flatten entries and apply metadata from the metadata files
  const entries = databaseEntries.flat().map((entry) => {
    // Find the metadata map for this entry's database
    const databaseIndex = databases.findIndex(
      (database) => database.id === entry.database,
    );
    const metadataMap = databaseMetadata[databaseIndex];
    const metadata = metadataMap?.[entry.id];

    if (metadata) {
      return { ...entry, metadata };
    }

    return entry;
  });
  DatabaseEntriesStore.load(entries);

  // Hydrate virtual collections from entries with collection properties
  const virtualCollectionData: VirtualCollectionData[] = [];

  databases.forEach((database) => {
    // Find collection properties in the database schema
    const collectionProperties = database.properties.filter(
      (property) => property.type === 'collection',
    );

    // If there are no collection properties, there is nothing to do
    if (collectionProperties.length === 0) {
      return;
    }

    // Get entries belonging to this database
    const dbEntries = entries.filter((entry) => entry.database === database.id);

    // Create virtual collection data for each entry's collection properties
    dbEntries.forEach((entry) => {
      collectionProperties.forEach((property) => {
        virtualCollectionData.push({
          id: virtualCollectionId(entry.id, property.name),
          name: virtualCollectionName(
            database.name,
            entry.title,
            property.name,
          ),
          entries: (entry.properties[property.name] as string[]) || [],
        });
      });
    });
  });

  // Load virtual collections
  if (virtualCollectionData.length > 0) {
    Collections.loadVirtual(virtualCollectionData);
  }
}
