import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { DatabaseEntry } from '../../types';

/**
 * Finds the entry a wikilink reference names.
 *
 * A reference is an entry title on its own, e.g. `Book`, or a title qualified
 * by the name of its database where the title alone would be ambiguous, e.g.
 * `Books/Book`. A database is named by its directory, so a qualified
 * reference reads as the path it is. Matching is case-insensitive, as entry
 * titles double as file names on a potentially case-insensitive file system.
 *
 * An unqualified reference which several entries answer to names none of them
 * in particular, so the first is returned rather than guessing.
 *
 * @param reference - The reference to resolve.
 * @returns The entry, or null if no entry answers to the reference.
 */
export function findDatabaseEntryByReference(
  reference: string,
): DatabaseEntry | null {
  const separatorIndex = reference.lastIndexOf('/');
  const hasDatabase = separatorIndex > 0;

  const title = (
    hasDatabase ? reference.slice(separatorIndex + 1) : reference
  ).toLowerCase();
  const database = hasDatabase
    ? reference.slice(0, separatorIndex).toLowerCase()
    : null;

  // A reference with no title names nothing
  if (!title) {
    return null;
  }

  // The database segment names a database rather than identifying it, so the
  // entry's database is resolved to compare against
  const databaseId = database
    ? DatabasesStore.getAllArray().find(
        (candidate) => candidate.name.toLowerCase() === database,
      )?.id
    : null;

  // A reference qualified by a database which does not exist names nothing
  if (database && !databaseId) {
    return null;
  }

  const match = DatabaseEntriesStore.getAllArray().find(
    (entry) =>
      entry.title.toLowerCase() === title &&
      (!databaseId || entry.database === databaseId),
  );

  return match || null;
}
