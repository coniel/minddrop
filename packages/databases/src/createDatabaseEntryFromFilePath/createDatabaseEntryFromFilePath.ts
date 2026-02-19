import { Fs } from '@minddrop/file-system';
import { InvalidParameterError, titleFromPath } from '@minddrop/utils';
import { createDatabaseEntry } from '../createDatabaseEntry';
import { getDatabase } from '../getDatabase';
import { DatabaseEntry } from '../types';
import { updateDatabaseEntry } from '../updateDatabaseEntry';
import {
  getDefaultFileProperty,
  getIncrmentalPropertyFilePath,
} from '../utils';

/**
 * Creates a database entry from a file path, setting the file as the value
 * of the default mathcing file based property.
 *
 * @param databaseId - The ID of the database to create the entry in.
 * @param filePath - The path to the file to create the entry from.
 *
 * @returns The newly created entry.
 *
 * @throws {InvalidParameterError} If the file is not a valid file type for the database.
 */
export async function createDatabaseEntryFromFilePath(
  databaseId: string,
  filePath: string,
): Promise<DatabaseEntry> {
  // Get the default property for the file type
  const property = getDefaultFileProperty(databaseId, filePath);
  // Get the database
  const database = getDatabase(databaseId);

  // Ensure that a supported property exists
  if (!property) {
    throw new InvalidParameterError(
      `Database ${databaseId} does not support file type ${Fs.getFileExtension(filePath)}.`,
    );
  }

  // Create the database entry, using the file name as its title
  const entry = await createDatabaseEntry(database.id, titleFromPath(filePath));

  // Get the path to the property file
  const { path, name } = await getIncrmentalPropertyFilePath(
    entry.id,
    property.name,
    Fs.fileNameFromPath(filePath),
  );

  // Copy the file to the target path
  await Fs.copyFile(filePath, path);

  // Update the property value on the entry and return the updated entry
  return updateDatabaseEntry(entry.id, {
    properties: {
      [property.name]: name,
    },
  });
}
