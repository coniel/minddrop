import { Fs } from '@minddrop/file-system';
import { PropertySchema } from '@minddrop/properties';
import { Paths, titleFromPath } from '@minddrop/utils';
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

    // Deserialize the entry's properties
    const properties = entrySerializer.deserialize(
      database.properties,
      serializedProperties,
    );

    // Use explicit timestamp properties if available, otherwise fall back
    // to file stat
    let created = getTimestampFromProperties(
      'created',
      database.properties,
      properties,
    );
    let lastModified = getTimestampFromProperties(
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

    // Construct the entry object with workspace-relative path as ID
    const entry: DatabaseEntry = {
      id: path.replace(`${Paths.workspace}/`, ''),
      database: database.id,
      path,
      title: titleFromPath(path),
      created,
      lastModified,
      properties,
      metadata: {},
    };

    return entry;
  } catch {
    // In case of failure, return null
    return null;
  }
}

/**
 * Looks up a timestamp property value from the entry's deserialized
 * properties. Returns the Date if found, or null if the database has
 * no property of the given type.
 */
function getTimestampFromProperties(
  type: 'created' | 'last-modified',
  schema: PropertySchema[],
  properties: Record<string, unknown>,
): Date | null {
  // Find a property in the schema with the matching type
  const property = schema.find((property) => property.type === type);

  if (!property) {
    return null;
  }

  // Get the value from the deserialized properties
  const value = properties[property.name];

  if (value instanceof Date) {
    return value;
  }

  // Try parsing string values as dates
  if (typeof value === 'string') {
    const parsed = new Date(value);

    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}
