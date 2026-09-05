import { Events } from '@minddrop/events';
import { Fs, recordWrittenContents } from '@minddrop/file-system';
import { DatabaseEntryWrittenEvent } from '../events';
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
 *
 * @dispatches databases:entry:written
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
  const previousContents = (await Fs.exists(entry.path))
    ? await Fs.readTextFile(entry.path)
    : undefined;

  // Serialize the entry's properties
  const serializer = getDatabaseEntrySerializer(database.entrySerializer);
  const contents = serializer.serialize(
    database.properties,
    properties,
    previousContents,
  );

  // Check whether the file already holds what would be written. If so,
  // record it as the app's own contents anyway, or a file the app has
  // just moved is taken for an external change by the watcher.
  if (contents === previousContents) {
    recordWrittenContents(entry.path, contents);

    return;
  }

  // Write the entry file
  await Fs.writeTextFile(entry.path, contents);

  Events.dispatch(DatabaseEntryWrittenEvent, {
    entry,
    database,
    previousContents,
    contents,
  });
}
