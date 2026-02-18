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

  // Ensure the core properties directory exists
  const corePropertiesDirPath = Fs.parentDirPath(
    entryCorePropertiesFilePath(entry.path),
  );

  if (!(await Fs.exists(corePropertiesDirPath))) {
    await Fs.createDir(corePropertiesDirPath);
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
