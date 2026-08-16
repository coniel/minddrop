import { Fs, hashContents } from '@minddrop/file-system';
import { entityId, titleFromPath } from '@minddrop/utils';
import { Database, DatabaseEntry, DatabaseEntrySerializer } from '../types';
import { getTimestampProperty } from '../utils';

/**
 * Reads a database entry from the file system.
 *
 * The returned timestamps are stat derived where the entry has no
 * timestamp properties, which is only a seed for the entry's metadata
 * sidecar. Callers with sidecar access resolve them with
 * `mergeEntryMetadata`.
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

    // Deserialize the entry's properties
    const properties = entrySerializer.deserialize(
      database.properties,
      serializedProperties,
    );

    // Use explicit timestamp properties if available, otherwise fall back
    // to file stat
    let created = getTimestampProperty(
      'created',
      database.properties,
      properties,
    );
    let lastModified = getTimestampProperty(
      'last-modified',
      database.properties,
      properties,
    );

    // Only stat the file if either timestamp is missing
    if (!created || !lastModified) {
      const stats = await Fs.stat(path);

      created = created ?? stats.created;
      lastModified = lastModified ?? stats.lastModified;
    }

    // Construct the entry object with a freshly minted ID. Background
    // sync re-resolves the ID to the existing one when the path matches
    // an already indexed entry.
    const entry: DatabaseEntry = {
      id: entityId('database-entry'),
      database: database.id,
      path,
      title: titleFromPath(path),
      created,
      lastModified,
      // Hashed from the file's text rather than stat'd, so that an
      // external edit is detected even when the database has a
      // 'last-modified' property, which only the app updates
      contentHash: hashContents(serializedProperties),
      properties,
      metadata: {},
    };

    return entry;
  } catch {
    // In case of failure, return null
    return null;
  }
}
