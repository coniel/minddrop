import { getDatabase } from '../../getDatabase';
import { getEntry } from '../../getEntry';
import { Entry } from '../../types';
import { isGloballyUniqueEntryTitle } from '../isGloballyUniqueEntryTitle';

/**
 * Resolves the reference a wikilink names an entry by: its title
 * alone when no other entry shares it, qualified by its database's
 * name otherwise, e.g. `Books/Book`. An entry whose database is
 * missing is referenced by its title alone.
 *
 * @param entry - The entry, or its ID.
 * @returns The entry's reference.
 *
 * @throws {EntryNotFoundError} If an entry with the given ID does not exist.
 */
export function resolveEntryReference(entry: Entry | string): string {
  // Look the entry up when given its ID
  const resolvedEntry = typeof entry === 'string' ? getEntry(entry) : entry;
  // Get the entry's database, if it still exists
  const database = getDatabase(resolvedEntry.database, false);

  // Check if the title alone identifies the entry, or its database is
  // missing. If so, reference it by its title.
  if (!database || isGloballyUniqueEntryTitle(resolvedEntry.title)) {
    return resolvedEntry.title;
  }

  // Qualify the title by the database's name
  return `${database.name}/${resolvedEntry.title}`;
}
