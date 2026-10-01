import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';
import { getDatabaseContentDefaults } from '../../getDatabaseContentDefaults';
import { findCustomContentTypeByMatcher } from '../findCustomContentTypeByMatcher';
import { getDefaultFileProperty } from '../getDefaultFileProperty';

/**
 * Resolves the ID of the database a file is added to. The target
 * database when it exists and can hold the file, otherwise the first
 * of these which is set:
 *
 * - The database of the custom content type listing the file's
 *   extension.
 * - The database set for the file's built-in content type.
 * - The catch-all files database.
 *
 * @param fileName - The file name.
 * @param targetDatabaseId - The ID of the database preferred when it can hold the file.
 * @returns The database ID, or null when no default applies.
 */
export function resolveDefaultDatabaseIdForFile(
  fileName: string,
  targetDatabaseId?: string,
): string | null {
  // Check if the target database exists and can hold the file. If
  // so, use it.
  if (
    targetDatabaseId &&
    getDatabase(targetDatabaseId, false) &&
    getDefaultFileProperty(targetDatabaseId, fileName)
  ) {
    return targetDatabaseId;
  }

  // Get the configured content defaults
  const defaults = getDatabaseContentDefaults();
  // Get the file's extension
  const extension = Fs.getFileExtension(fileName);

  // Check for a custom content type listing the extension
  const customType = findCustomContentTypeByMatcher('file', extension);

  // Check if the custom type has a database. If so, use it.
  if (customType?.databaseId) {
    return customType.databaseId;
  }

  // Check for the file's content type default
  const contentTypeDatabaseId =
    defaults[Properties.resolveFilePropertyType(extension)];

  // Check if the content type default is set. If so, use it.
  if (contentTypeDatabaseId) {
    return contentTypeDatabaseId;
  }

  // Fall back to the catch-all file default
  return defaults.file;
}
