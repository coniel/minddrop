import { DatabaseEntries, Databases } from '@minddrop/databases';
import { ViewOpenMode } from '@minddrop/views';

/**
 * Resolves the open mode for a database entry. Uses the provided
 * mode if given, otherwise falls back to the database's default.
 */
export function resolveOpenMode(
  entryId: string,
  openMode?: ViewOpenMode,
): ViewOpenMode {
  if (openMode) {
    return openMode;
  }

  // Look up the entry's database to get the default open mode
  const entry = DatabaseEntries.get(entryId, false);

  if (entry) {
    const database = Databases.get(entry.database, false);

    if (database) {
      return database.entryOpenMode;
    }
  }

  // Default to dialog if database lookup fails
  return 'dialog';
}
