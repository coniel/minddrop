import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import { entryCorePropertiesFilePath } from '../utils';

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
  // Get the the parent database
  const database = getDatabase(entry.database);
  // Path to the database's core properties directory
  const corePropertiesDirPath = Fs.parentDirPath(
    entryCorePropertiesFilePath(entry.path),
  );

  // Ensure the core properties directory exists
  if (!(await Fs.exists(corePropertiesDirPath))) {
    await Fs.createDir(corePropertiesDirPath);
  }

  // If the database uses entry based storage, ensure the entry
  // subdirectory exists.
  if (database.propertyFileStorage === 'entry') {
    if (!(await Fs.exists(Fs.parentDirPath(entry.path)))) {
      await Fs.createDir(Fs.parentDirPath(entry.path));
    }
  }

  // Write the entry's core properties
  Fs.writeTextFile(
    entryCorePropertiesFilePath(entry.path),
    Properties.toYaml(database.properties, {
      id: entry.id,
      title: entry.title,
      created: entry.created,
      lastModified: entry.lastModified,
    }),
  );

  // Serialize the entry's properties
  const serializer = getDatabaseEntrySerializer(database.entrySerializer);
  const serializedEntry = serializer.serialize(
    database.properties,
    entry.properties,
  );

  Fs.writeTextFile(entry.path, serializedEntry);
}
