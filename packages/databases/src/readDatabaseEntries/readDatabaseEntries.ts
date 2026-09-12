import { Fs } from '@minddrop/file-system';
import { DatabaseEntrySerializersRegistry } from '../DatabaseEntrySerializersRegistry';
import { readDatabaseEntry } from '../readDatabaseEntry';
import { Database, DatabaseEntry } from '../types';
import { resolveDatabasePath } from '../utils';

/**
 * Reads all entry files from a database directory and returns
 * the deserialized DatabaseEntry objects.
 *
 * @param database - The database to read entries from.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The database entries, with null entries filtered out.
 */
export async function readDatabaseEntries(
  database: Database,
  workspacePath?: string,
): Promise<DatabaseEntry[]> {
  const hasEntrySubdirs = database.propertyFileStorage === 'entry';
  const databasePath = resolveDatabasePath(database, workspacePath);

  // Read the database's entry files
  let files = await Fs.readDir(databasePath, {
    recursive: hasEntrySubdirs,
  });

  // If the database uses entry-based storage, read the files
  // from the entry subdirectories.
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
  const serializer = DatabaseEntrySerializersRegistry.get(
    database.entrySerializer,
  );

  // Only include the serializer's expected file type
  files = files.filter((file) =>
    file.path.endsWith(`.${serializer.fileExtension}`),
  );

  // Read and deserialize the database entries, which are addressed
  // from their database.
  const entries = await Promise.all(
    files.map((file) =>
      readDatabaseEntry(
        Fs.relativePath(databasePath, file.path),
        database,
        serializer,
        workspacePath,
      ),
    ),
  );

  return entries.filter((entry): entry is DatabaseEntry => entry !== null);
}
