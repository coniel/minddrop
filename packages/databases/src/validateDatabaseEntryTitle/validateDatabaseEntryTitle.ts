import { TranslationKey } from '@minddrop/i18n';
import { DatabaseEntry } from '../types';
import { isEntryTitleTaken } from '../utils';

/**
 * Validates a new title for a database entry. Returns the
 * translation key of the validation error, or undefined when the
 * title is valid.
 *
 * An empty title is not an error: empty title updates rename the
 * entry to an untitled title instead.
 *
 * @param entry - The entry being renamed.
 * @param newTitle - The new title to validate.
 * @returns The error translation key or undefined.
 */
export function validateDatabaseEntryTitle(
  entry: DatabaseEntry,
  newTitle: string,
): TranslationKey | undefined {
  // Ignore surrounding whitespace
  const trimmedTitle = newTitle.trim();

  // Empty titles are committed as renames to an untitled title
  if (!trimmedTitle) {
    return undefined;
  }

  // Titles double as file names, so path separators are invalid
  if (trimmedTitle.includes('/') || trimmedTitle.includes('\\')) {
    return 'databases.entries.errors.titleInvalidCharacters';
  }

  // Renaming to the current title is a no-op
  if (trimmedTitle === entry.title) {
    return undefined;
  }

  // The title must be unique within the database
  if (isEntryTitleTaken(entry.database, trimmedTitle, entry.id)) {
    return 'databases.entries.errors.titleConflict';
  }

  return undefined;
}
