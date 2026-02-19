import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { createDatabaseEntry } from '../createDatabaseEntry/createDatabaseEntry';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntry } from '../types';
import { getDefaultFileProperty } from '../utils';
import { writePropertyFile } from '../writePropertyFile';

/**
 * Creates a database entry from a file, setting the file as the value
 * of the default mathcing file based property.
 *
 * @param databaseId - The ID of the database to create the entry in.
 * @param file - The file to create the entry from.
 *
 * @returns The newly created entry.
 *
 * @throws {InvalidParameterError} If the file type is not supported by the database.
 */
export async function createDatabaseEntryFromFile(
  databaseId: string,
  file: File,
): Promise<DatabaseEntry> {
  // Get the default property for the file type
  const property = getDefaultFileProperty(databaseId, file.name);

  // Ensure that a supported property exists
  if (!property) {
    throw new InvalidParameterError(
      `Database ${databaseId} does not support file type ${Fs.getFileExtension(file.name)}.`,
    );
  }

  // Create the database entry, using the file name as its title.
  // We don't set the file property value here as the file is not yet written.
  const entry = await createDatabaseEntry(
    databaseId,
    Fs.removeExtension(file.name),
  );

  // Write the property file and update the entry's property value
  await writePropertyFile(entry.id, property.name, file, true);

  // Return the updated entry
  return getDatabaseEntry(entry.id);
}
