import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDataType } from '../../getDataType';
import { getDatabase } from '../../getDatabase';

/**
 * Filters a list of files to only include files that are valid for the given database.
 *
 * @param databaseId - The ID of the database to filter the files for.
 * @param files - The list of files to filter.
 * @returns The filtered list of files.
 *
 * @throws {InvalidParameterError} If the database is not a file based database.
 */
export function filterValidDatabaseFiles(
  databaseId: string,
  files: File[],
): { validFiles: File[]; invalidFiles: File[] } {
  // Get the database
  const database = getDatabase(databaseId);
  // Get the data type
  const dataType = getDataType(database.dataType);

  // Ensure the database is a file based database
  if (!dataType.file) {
    throw new InvalidParameterError(
      `Database ${databaseId} is not a file based database.`,
    );
  }

  // If the data type does not enforce file types, return all files
  // as valid.
  if (!dataType.fileExtensions) {
    return { validFiles: files, invalidFiles: [] };
  }

  // Filter files by validity
  const validFiles: File[] = [];
  const invalidFiles: File[] = [];

  files.forEach((file) => {
    if (dataType.fileExtensions?.includes(Fs.getFileExtension(file.name))) {
      validFiles.push(file);
    } else {
      invalidFiles.push(file);
    }
  });

  return { validFiles, invalidFiles };
}
