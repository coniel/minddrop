import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { getDataType } from '../getDataType';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { getDatabaseEntrySerializer } from '../getDatabaseEntrySerializer';
import {
  entryCorePropertiesFilePath,
  fileEntryPropertiesFilePath,
} from '../utils';

/**
 * Writes an entry to the file system.
 *
 * @param id - The ID of the entry to write.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 * @throws {DatabaseNotFoundError} If the entry database does not exist.
 * @throws {DataTypeNotFoundError} If the data type is not registered.
 * @throws {DatabaseEntrySerializerNotRegisteredError} If the entry serializer is not registered.
 */
export async function writeDatabaseEntry(id: string): Promise<void> {
  // Get the entry
  const entry = getDatabaseEntry(id);
  // Get the the parent database
  const database = getDatabase(entry.database);
  // Get the database's data type
  const dataType = getDataType(database.dataType);

  // Write the entry's core properties
  Fs.writeTextFile(
    entryCorePropertiesFilePath(entry.path),
    Properties.toYaml(database.properties, {
      title: entry.title,
      created: entry.created,
      lastModified: entry.lastModified,
    }),
  );

  // If the data type is file based, write the entry properties to the
  // the properties subdirectory.
  if (dataType.file) {
    const serializer = getDatabaseEntrySerializer(database.entrySerializer);
    const serializedEntry = serializer.serialize(
      database.properties,
      entry.properties,
    );

    Fs.writeTextFile(
      fileEntryPropertiesFilePath(entry.path, serializer.fileExtension),
      serializedEntry,
    );
  } else {
    // If the entry serializer is data-type, serialize the entry  using the
    // data type's serialize function.
    if (database.entrySerializer === 'data-type') {
      Fs.writeTextFile(entry.path, dataType.serialize!(database, entry));
    } else {
      // Otherwise, use the database's entry serializer's serialize function
      const serializer = getDatabaseEntrySerializer(database.entrySerializer);
      const serializedEntry = serializer.serialize(
        database.properties,
        entry.properties,
      );

      Fs.writeTextFile(entry.path, serializedEntry);
    }
  }
}
