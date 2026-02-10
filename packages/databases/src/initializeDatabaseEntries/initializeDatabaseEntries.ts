import { Fs } from '@minddrop/file-system';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { getDataType } from '../getDataType';
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
      const dataType = getDataType(database.dataType, false);

      // If the database's data type is not registered, we can't proceed
      if (!dataType) {
        return [];
      }

      // Read the database's entry files
      let files = await Fs.readDir(database.path);

      /// Filter the database files to only include entry files
      if (dataType.file) {
        // Only include entry file types
        files = files.filter((file) =>
          dataType.fileExtensions?.includes(Fs.getFileExtension(file.path)),
        );
      } else if (database.entrySerializer === 'data-type') {
        // Only include the data type's expected file type
        files = files.filter((file) =>
          file.path.endsWith(`.${dataType.fileExtension}`),
        );
      } else {
        // Get the database's entry serializer
        const serializer = getDatabaseEntrySerializer(database.entrySerializer);

        // Only include the serializer's expected file type
        files = files.filter((file) =>
          file.path.endsWith(`.${serializer.fileExtension}`),
        );
      }

      // If the database's entry serializer is data-type, use the data type's
      // file extension.
      if (database.entrySerializer === 'data-type') {
        // Read and deserialize the database entries
        return await Promise.all(
          files.map((file) => readDatabaseEntry(file.path, database, dataType)),
        );
      } else {
        // Get the database's entry serializer
        const serializer = getDatabaseEntrySerializer(database.entrySerializer);

        // Read and deserialize the database entries
        return await Promise.all(
          files.map((file) =>
            readDatabaseEntry(file.path, database, dataType, serializer),
          ),
        );
      }
    }),
  );

  // Load all entries into the store
  DatabaseEntriesStore.load(
    databaseEntries.flat().filter((entry) => entry !== null),
  );
}
