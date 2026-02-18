import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { Properties, PropertyMap } from '@minddrop/properties';
import { titleFromPath, uuid } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  DatabaseEntryCreatedEvent,
  DatabaseEntryCreatedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import { DatabaseEntry } from '../types';
import { writeDatabaseEntry } from '../writeDatabaseEntry';

/**
 * Creates a new database entry in the specified database.
 *
 * @param databaseId - The ID of the database to create the entry in.
 * @param title - The entry title. Defaults to "Untitled".
 * @param properties - The entry properties.
 * @param filePath - The path to the entry's associated file. Only applicable
 * to file based entries.
 *
 * @returns The newly created entry.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {DatabaseEntrySerializerNotRegisteredError} If the entry serializer is not registered.
 *
 * @dispatches databases:entry:created
 */
export async function createDatabaseEntry<
  TProperties extends PropertyMap = PropertyMap,
>(
  databaseId: string,
  title = i18n.t('labels.untitled'),
  properties: Partial<TProperties> = {},
  filePath?: string,
): Promise<DatabaseEntry<TProperties>> {
  // The file extension for the entry's main file
  let fileExtension = '';
  // Get the database
  const database = getDatabase(databaseId);
  // Path to which to write the entry
  let parentDirPath = database.path;

  // Get the file extension for the entry file
  const serializer = getDatabaseEntrySerializer(database.entrySerializer);
  fileExtension = serializer.fileExtension;

  // Path to the entry's primary file
  let path =
    filePath || Fs.concatPath(parentDirPath, `${title}.${fileExtension}`);

  if (!filePath) {
    // Increment the file name if an entry with the same name exists.
    // Ignore the file extension to match existing entries regardless of
    // their file type (for file based entries).
    const incrementalPath = await Fs.incrementalPath(path, true);
    path = incrementalPath.path;
  }

  // Create the new entry
  const entry: DatabaseEntry<TProperties> = {
    id: uuid(),
    database: databaseId,
    title: titleFromPath(path),
    path,
    created: new Date(),
    lastModified: new Date(),
    properties: Properties.defaults(database.properties, properties),
  };

  // Add the entry to the store
  DatabaseEntriesStore.add(entry);

  // Werite the entry to the file system
  await writeDatabaseEntry(entry.id);

  // Dispatch an entry created event
  Events.dispatch<DatabaseEntryCreatedEventData>(
    DatabaseEntryCreatedEvent,
    entry,
  );

  return entry;
}
