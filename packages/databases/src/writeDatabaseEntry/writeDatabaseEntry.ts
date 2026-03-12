import { Fs } from '@minddrop/file-system';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';

/**
 * Writes an entry to the file system.
 *
 * @param id - The ID of the entry to write.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry database does not exist.
 * @throws {DatabaseEntrySerializerNotRegisteredError} If the entry serializer is not registered.
 */
export async function writeDatabaseEntry(id: string): Promise<void> {
  // Get the entry
  const entry = getDatabaseEntry(id);
  // Get the parent database
  const database = getDatabase(entry.database);

  // If the database uses entry based storage, ensure the entry
  // subdirectory exists.
  if (database.propertyFileStorage === 'entry') {
    if (!(await Fs.exists(Fs.parentDirPath(entry.path)))) {
      await Fs.createDir(Fs.parentDirPath(entry.path));
    }
  }

  // Serialize the entry's properties
  const serializer = getDatabaseEntrySerializer(database.entrySerializer);
  const serializedEntry = serializer.serialize(
    database.properties,
    entry.properties,
  );

  // Write the entry file
  await Fs.writeTextFile(entry.path, serializedEntry);
}
