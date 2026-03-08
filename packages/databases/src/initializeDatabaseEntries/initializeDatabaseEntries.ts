import { Collections, VirtualCollectionData } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import { readDatabaseEntry } from '../readDatabaseEntry';
import { DatabaseEntry } from '../types';
import { virtualCollectionId, virtualCollectionName } from '../utils';

/**
 * Initializes database entries by reading them from the file system
 * and loading them into the store.
 */
export async function initializeDatabaseEntries(): Promise<void> {
  // Get all databases
  const databases = DatabasesStore.getAllArray();

  const databaseEntries = await Promise.all(
    databases.map(async (database) => {
      const hasEntrySubdirs = database.propertyFileStorage === 'entry';

      // Read the database's entry files
      let files = await Fs.readDir(database.path, {
        recursive: hasEntrySubdirs,
      });

      // If the database uses entry based storage, read the files
      // from the entry subdirectories.
      if (hasEntrySubdirs) {
        const entrySubdirectories = files.filter(
          (file) =>
            'children' in file &&
            file.children?.length &&
            !file.name?.startsWith('.'),
        );

        files = entrySubdirectories.reduce(
          (acc, entrySubdirectory) =>
            acc.concat(entrySubdirectory.children || []),
          files,
        );
      }

      // Get the database's entry serializer
      const serializer = getDatabaseEntrySerializer(database.entrySerializer);

      // Only include the serializer's expected file type
      files = files.filter((file) =>
        file.path.endsWith(`.${serializer.fileExtension}`),
      );

      // Read and deserialize the database entries
      return await Promise.all(
        files.map((file) => readDatabaseEntry(file.path, database, serializer)),
      );
    }),
  );

  // Load all entries into the store
  const entries = databaseEntries.flat().filter((entry) => entry !== null);
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
