import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { createDatabaseEntry } from '../createDatabaseEntry';
import { getDatabase } from '../getDatabase';
import { DatabaseEntry } from '../types';

// TODO: Refactor to use file property

/**
 * Creates a database entry from a file path.
 *
 * @param databaseId - The ID of the database to create the entry in.
 * @param filePath - The path to the file to create the entry from.
 *
 * @returns The newly created entry.
 *
 * @throws {InvalidParameterError} If the database is not a file based database.
 * @throws {InvalidParameterError} If the file is not a valid file type for the database.
 */
export async function createDatabaseEntryFromFilePath(
  databaseId: string,
  filePath: string,
): Promise<DatabaseEntry> {
  // Get the database
  const database = getDatabase(databaseId);

  // // Ensure the database is a file based database
  // if (!dataType.file) {
  //   throw new InvalidParameterError(
  //     `Database ${databaseId} is not a file based database.`,
  //   );
  // }
  //
  // // Ensure the file is a valid file type for the database
  // if (!dataType.fileExtensions?.includes(Fs.getFileExtension(filePath))) {
  //   throw new InvalidParameterError(
  //     `File ${filePath} is not a valid file type for database ${databaseId}.`,
  //   );
  // }

  // Path to the file in the database
  const databaseFilePath = Fs.concatPath(
    database.path,
    Fs.fileNameFromPath(filePath),
  );

  // Get a unique file name for the file in case a file with the same name
  // already exists within the database.
  const { path, name } = await Fs.incrementalPath(databaseFilePath, true);

  // Copy the file to the database
  await Fs.copyFile(filePath, path);

  // Create the database entry
  return createDatabaseEntry(database.id, Fs.removeExtension(name), {}, path);
}
