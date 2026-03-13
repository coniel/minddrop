import { Fs } from '@minddrop/file-system';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import { readDatabaseEntry } from '../readDatabaseEntry';
import { Database, DatabaseEntry } from '../types';

/**
 * Reads all entry files from a database directory and returns
 * the deserialized DatabaseEntry objects.
 *
 * @param database - The database to read entries from.
 * @returns The database entries, with null entries filtered out.
 */
export async function readDatabaseEntries(
  database: Database,
): Promise<DatabaseEntry[]> {
  const hasEntrySubdirs = database.propertyFileStorage === 'entry';

  // Read the database's entry files
  let files = await Fs.readDir(database.path, {
    recursive: hasEntrySubdirs,
  });

  // If the database uses entry-based storage, read the files
  // from the entry subdirectories
  if (hasEntrySubdirs) {
    const entrySubdirectories = files.filter(
      (file) =>
        'children' in file &&
        file.children?.length &&
        !file.name?.startsWith('.'),
    );

    files = entrySubdirectories.reduce(
      (acc, entrySubdirectory) => acc.concat(entrySubdirectory.children || []),
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
  const entries = await Promise.all(
    files.map((file) => readDatabaseEntry(file.path, database, serializer)),
  );

  return entries.filter((entry): entry is DatabaseEntry => entry !== null);
}
