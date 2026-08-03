import { getDatabase } from '../../getDatabase';
import { getDatabaseEntry } from '../../getDatabaseEntry';
import { resolvePropertyFilePath } from '../resolvePropertyFilePath';
import { resolvePropertyFilesDirName } from '../resolvePropertyFilesDirName';

/**
 * Returns the path to an entry property's file.
 *
 * @param entryId - The ID of the entry.
 * @param propertyName - The name of the property.
 * @param fileName - The name of the file, i.e. the value of the property.
 * @returns The path to the property file.
 */
export function getPropertyFilePath(
  entryId: string,
  propertyName: string,
  fileName: string,
): string {
  // Get the entry
  const entry = getDatabaseEntry(entryId);

  // Get the entry's database
  const database = getDatabase(entry.database);

  // Resolve the path against the database's current storage mode
  return resolvePropertyFilePath({
    databasePath: database.path,
    mode: database.propertyFileStorage,
    propertyFilesDirName: resolvePropertyFilesDirName(
      database.propertyFilesDir,
    ),
    entryTitle: entry.title,
    propertyName,
    fileName,
  });
}
