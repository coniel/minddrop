import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { readDatabaseEntryCoreProperties } from '../readDatabaseEntryCoreProperties';
import { Database, DatabaseEntry, DatabaseEntrySerializer } from '../types';

/**
 * Reads a database entry from the file system.
 *
 * @param path - The entry path.
 * @param database - The database the entry belongs to.
 * @param entrySerializer - The entry serializer used to deserialize the entry.
 *
 * @returns The entry object.
 */
export async function readDatabaseEntry(
  path: string,
  database: Database,
  entrySerializer: DatabaseEntrySerializer,
): Promise<DatabaseEntry | null> {
  try {
    // Read the entry's user properties
    const serializedProperties = await Fs.readTextFile(path);
    // Read the entry core properties
    const coreProperties = await readDatabaseEntryCoreProperties(
      path,
      database,
    );

    // Construct the entry object with workspace-relative path as ID
    const entry: DatabaseEntry = {
      ...coreProperties,
      id: path.replace(`${Paths.workspace}/`, ''),
      path,
      properties: {},
      database: database.id,
      metadata: {},
    };

    // Deserialize the entry's properties
    const properties = entrySerializer.deserialize(
      database.properties,
      serializedProperties,
    );

    // Add the deserialized properties to the entry
    entry.properties = properties;

    return entry;
  } catch (error) {
    // In case of failure, return null
    return null;
  }
}
