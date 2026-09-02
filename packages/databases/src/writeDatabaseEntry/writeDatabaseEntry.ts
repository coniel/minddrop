import { Fs } from '@minddrop/file-system';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import { serializeCollectionProperties } from '../utils';

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

  // Convert collection property members to durable addresses
  const properties = serializeCollectionProperties(entry.properties, database);

  // Read the entry's current content so the serializer can merge into it
  // rather than regenerating it, preserving anything MindDrop does not model
  const existingContent = (await Fs.exists(entry.path))
    ? await Fs.readTextFile(entry.path)
    : undefined;

  // Serialize the entry's properties
  const serializer = getDatabaseEntrySerializer(database.entrySerializer);
  const serializedEntry = serializer.serialize(
    database.properties,
    properties,
    existingContent,
  );

  // Write the entry file
  await Fs.writeTextFile(entry.path, serializedEntry);
}
