import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import { readDatabaseEntry } from '../readDatabaseEntry';

/**
 * Initializes database entries by reading them from the file system
 * and loading them into the store.
 */
export async function initializeDatabaseEntries(): Promise<void> {
  // Get all databases
  const databases = DatabasesStore.getAll();

  const databaseEntries = await Promise.all(
    databases.map(async (database) => {
      // Read the database's entry files
      let files = await Fs.readDir(database.path);

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
  DatabaseEntriesStore.load(
    databaseEntries.flat().filter((entry) => entry !== null),
  );
}
