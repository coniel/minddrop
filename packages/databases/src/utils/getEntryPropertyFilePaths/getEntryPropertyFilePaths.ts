import { Properties } from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';
import { getDatabaseEntry } from '../../getDatabaseEntry';
import { getPropertyFilePath } from '../getPropertyFilePath';

/**
 * Returns the paths of the files owned by an entry's file-based
 * properties. Properties without a file value are skipped.
 *
 * @param entryId - The ID of the entry.
 * @returns The entry's property file paths.
 */
export function getEntryPropertyFilePaths(entryId: string): string[] {
  // Get the entry
  const entry = getDatabaseEntry(entryId);
  // Get the entry's database
  const database = getDatabase(entry.database);

  // Resolve the file path for each file-based property that has a value
  return database.properties
    .filter(Properties.isFileBased)
    .flatMap((property) => {
      const value = entry.properties[property.name];

      // Skip properties without a file value
      if (typeof value !== 'string' || value === '') {
        return [];
      }

      return [getPropertyFilePath(entryId, property.name, value)];
    });
}
