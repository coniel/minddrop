import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { getAllDatabases } from '../../getAllDatabases';
import { Database, DatabaseEntry } from '../../types';

export interface DatabaseEntryAddressMatch {
  /**
   * The database named by the address' first segment.
   */
  database: Database;

  /**
   * The entry named by the address' second segment, or null when the
   * database holds no entry under that title.
   */
  entry: DatabaseEntry | null;
}

/**
 * Matches an entry address, `<database name>/<entry title>`, against
 * the databases and entries in the stores. Matching is case-insensitive,
 * as titles double as file names on a potentially case-insensitive file
 * system.
 *
 * @param address - The address to match.
 * @returns The matched database and entry, or null if the address names no database.
 */
export function matchDatabaseEntryAddress(
  address: string,
): DatabaseEntryAddressMatch | null {
  const segments = address.split('/');

  // Entry addresses are exactly two segments
  if (segments.length !== 2) {
    return null;
  }

  const [databaseName, title] = segments;

  // Neither segment may be empty
  if (!databaseName || !title) {
    return null;
  }

  // The first segment names a database rather than identifying it, so
  // it is resolved against the database names
  const database = getAllDatabases().find(
    (candidate) => candidate.name.toLowerCase() === databaseName.toLowerCase(),
  );

  // Addresses outside an existing database name nothing
  if (!database) {
    return null;
  }

  // Find the database's entry under the title, if there is one
  const entry = getAllDatabaseEntries(database.id).find(
    (candidate) => candidate.title.toLowerCase() === title.toLowerCase(),
  );

  return { database, entry: entry ?? null };
}
