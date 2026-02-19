import { Fs } from '@minddrop/file-system';
import {
  FilePropertySupportedFileExtensions,
  Properties,
} from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';

/**
 * Filters a list of files to only include files that are valid for the given database.
 *
 * @param databaseId - The ID of the database to filter the files for.
 * @param files - The list of files to filter.
 * @returns A map of valid and invalid files.
 *
 * @throws {InvalidParameterError} If the database is not a file based database.
 */
export function filterValidDatabaseFiles(
  databaseId: string,
  files: File[],
): { validFiles: File[]; invalidFiles: File[] } {
  // Get the database
  const database = getDatabase(databaseId);

  // Get a list of file based property types used by the database
  const filePropertyTypes = [
    ...new Set(
      database.properties
        .filter(Properties.isFileBased)
        .map((property) => property.type),
    ),
  ];

  // If the database does not have any file based properties, all files
  // are invalid.
  if (filePropertyTypes.length === 0) {
    return { validFiles: [], invalidFiles: files };
  }

  // If the database contains a generic file property, all files are valid
  if (filePropertyTypes.includes('file')) {
    return { validFiles: files, invalidFiles: [] };
  }

  // Create a list of all supported file extensions
  const supportedFileExtensions = new Set(
    filePropertyTypes.flatMap(
      (type) => FilePropertySupportedFileExtensions[type],
    ),
  );

  // Sort files into valid and invalid groups
  const validFiles: File[] = [];
  const invalidFiles: File[] = [];

  files.forEach((file) => {
    if (supportedFileExtensions.has(Fs.getFileExtension(file.name))) {
      validFiles.push(file);
    } else {
      invalidFiles.push(file);
    }
  });

  return { validFiles, invalidFiles };
}
