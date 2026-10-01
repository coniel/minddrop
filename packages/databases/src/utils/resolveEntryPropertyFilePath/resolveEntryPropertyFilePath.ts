import { getDatabase } from '../../getDatabase';
import { getDatabaseEntry } from '../../getDatabaseEntry';
import { DatabaseEntry } from '../../types';
import { resolveDatabasePath } from '../resolveDatabasePath';
import { resolvePropertyFilePath } from '../resolvePropertyFilePath';
import { resolvePropertyFilesDirName } from '../resolvePropertyFilesDirName';

/**
 * Returns the path to an entry property's file.
 *
 * @param entry - The entry, or its ID.
 * @param propertyName - The name of the property.
 * @param fileName - The name of the file, i.e. the value of the property.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the property file.
 */
export function resolveEntryPropertyFilePath(
  entry: DatabaseEntry | string,
  propertyName: string,
  fileName: string,
  workspacePath?: string,
): string {
  // Look the entry up when given its ID
  const resolvedEntry =
    typeof entry === 'string' ? getDatabaseEntry(entry) : entry;

  // Get the entry's database
  const database = getDatabase(resolvedEntry.database);

  // Resolve the path against the database's current storage mode
  return resolvePropertyFilePath({
    databasePath: resolveDatabasePath(database, workspacePath),
    mode: database.propertyFileStorage,
    propertyFilesDirName: resolvePropertyFilesDirName(
      database.propertyFilesDir,
    ),
    entryTitle: resolvedEntry.title,
    propertyName,
    fileName,
  });
}
