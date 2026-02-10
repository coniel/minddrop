import { Fs } from '@minddrop/file-system';
import { readDatabaseEntryCoreProperties } from '../readDatabaseEntryCoreProperties';
import {
  DataType,
  Database,
  DatabaseEntry,
  DatabaseEntrySerializer,
} from '../types';
import { fileEntryPropertiesFilePath } from '../utils';

/**
 * Reads a database entry from the file system.
 *
 * @param path - The entry path.
 * @param database - The database the entry belongs to.
 * @param dataType - The data type of the entry.
 * @param entrySerializer - The entry serializer used to deserialize the entry.
 *
 * @returns The entry object.
 */
export async function readDatabaseEntry(
  path: string,
  database: Database,
  dataType: DataType,
  entrySerializer?: DatabaseEntrySerializer,
): Promise<DatabaseEntry | null> {
  try {
    let propertiesFilePath = '';

    if (dataType.file) {
      // If the entry is file based, the entry's properties file is in the
      // properties subdirectory.
      const propertiesFileExtension =
        entrySerializer?.fileExtension || dataType.fileExtension || 'yaml';
      propertiesFilePath = dataType.file
        ? fileEntryPropertiesFilePath(path, propertiesFileExtension)
        : path;
    } else {
      // The properties file path is the entry's path
      propertiesFilePath = path;
    }

    // Read the entry's user properties
    const serializedProperties = await Fs.readTextFile(propertiesFilePath);
    // Read the entry core properties
    const coreProperties = await readDatabaseEntryCoreProperties(
      path,
      database,
    );

    // Construct the entry object
    const entry: DatabaseEntry = {
      path,
      properties: {},
      database: database.id,
      ...coreProperties,
    };

    // If the data-type is responsible for deserializing the entry, deserialize
    // the entry using the data type's deserializer.
    if (database.entrySerializer === 'data-type') {
      // Deserialize the entry using the data type's deserializer
      const { properties, data } = dataType.deserialize!(
        database,
        serializedProperties,
      );

      // Add the deserialized properties to the entry
      entry.properties = properties;

      // If the entry has data, add it to the entry
      if (data) {
        entry.data = data;
      }

      return entry;
    } else {
      // Otherwise, use the entry serializer's deserializer to deserialize the
      // entry.
      const properties = entrySerializer!.deserialize(
        database.properties,
        serializedProperties,
      );

      // Add the deserialized properties to the entry
      entry.properties = properties;

      return entry;
    }
  } catch (error) {
    // In case of failure, return null
    return null;
  }
}
