import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { DatabaseEntry } from '../../types';
import { matchDatabaseEntryAddress } from '../matchDatabaseEntryAddress';

/**
 * Finds the entry a wikilink reference names.
 *
 * A reference is either a full entry address, `Books/Book`, or an
 * entry title on its own, `Book`, the display shorthand wikilinks
 * allow where the title is unambiguous. Matching is case-insensitive.
 *
 * An unqualified reference which several entries answer to names none
 * of them in particular, so the first is returned rather than guessing.
 *
 * @param reference - The reference to resolve.
 * @returns The entry, or null if no entry answers to the reference.
 */
export function findDatabaseEntryByReference(
  reference: string,
): DatabaseEntry | null {
  // Qualified references are entry addresses
  if (reference.includes('/')) {
    return matchDatabaseEntryAddress(reference)?.entry ?? null;
  }

  const title = reference.toLowerCase();

  // A reference with no title names nothing
  if (!title) {
    return null;
  }

  // Unqualified references match on title across all databases
  const match = getAllDatabaseEntries().find(
    (entry) => entry.title.toLowerCase() === title,
  );

  return match || null;
}
