import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { Properties, PropertyMap } from '@minddrop/properties';
import { entityId, titleFromPath } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryCreatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import { DatabaseEntry, DatabaseEntryId } from '../types';
import { setTimestampProperties } from '../utils';
import { writeDatabaseEntry } from '../writeDatabaseEntry';
import { writeEntryMetadata } from '../writeEntryMetadata';

/**
 * Creates a new database entry in the specified database.
 *
 * @param databaseId - The ID of the database to create the entry in.
 * @param title - The entry title. Defaults to "Untitled".
 * @param properties - The entry properties.
 * @param duplicatedFrom - The ID of the entry this entry duplicates, held in the store for the session only.
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
  duplicatedFrom?: DatabaseEntryId,
): Promise<DatabaseEntry<TProperties>> {
  // The file extension for the entry's main file
  let fileExtension = '';
  // Get the database
  const database = getDatabase(databaseId);
  // Path to which to write the entry
  const parentDirPath = database.path;

  // Get the file extension for the entry file
  const serializer = getDatabaseEntrySerializer(database.entrySerializer);
  fileExtension = serializer.fileExtension;

  // Path to the entry's primary file
  let path = Fs.concatPath(parentDirPath, `${title}.${fileExtension}`);

  // If the database uses entry based storage, we want to increment based
  // on entry subdirectory conflits, not file conflicts.
  if (database.propertyFileStorage === 'entry') {
    path = Fs.removeExtension(path);
  }

  // Increment the file name if an entry with the same name exists.
  const incrementalPath = await Fs.incrementalPath(path);
  path = incrementalPath.path;

  // If the database uses entry based storage, add the entry file name back
  // into the path.
  if (database.propertyFileStorage === 'entry') {
    path = Fs.concatPath(path, `${incrementalPath.name}.${fileExtension}`);
  }

  // The entry's creation and last modified timestamp
  const now = new Date();

  // Create the new entry
  const entry: DatabaseEntry<TProperties> = {
    id: entityId('database-entry'),
    database: database.id,
    title: titleFromPath(path),
    path,
    created: now,
    lastModified: now,
    // Populate the created/last-modified timestamp property values so they
    // persist to the entry file
    properties: setTimestampProperties(
      database.properties,
      Properties.defaults(database.properties, properties),
      ['created', 'last-modified'],
      now,
    ),
    // Persist the timestamps to the entry's sidecar, from where they are
    // read from then on, since file stat does not survive rewrites
    metadata: { created: now, lastModified: now },
    ...(duplicatedFrom && { duplicatedFrom }),
  };

  // Add the entry to the store
  DatabaseEntriesStore.set(entry);

  // Dispatch an entry created event
  Events.dispatch(DatabaseEntryCreatedEvent, entry);

  // Write the entry to the file system
  await writeDatabaseEntry(entry.id);

  // Write the entry's metadata sidecar
  await writeEntryMetadata(database.path, entry.path, entry.metadata);

  return entry;
}
