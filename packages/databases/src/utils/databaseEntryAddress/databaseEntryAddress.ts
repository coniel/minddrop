import { getDatabase } from '../../getDatabase';
import { Database, DatabaseEntry } from '../../types';

/**
 * Derives an entry's durable address, its title qualified by the name
 * of its database.
 *
 * @param entry - The entry to derive the address of.
 * @param database - The database to name the entry under. Defaults to the entry's stored database.
 * @returns The entry address, or null if the entry's database does not exist.
 */
export function databaseEntryAddress(
  entry: DatabaseEntry,
  database: Database,
): string;
export function databaseEntryAddress(entry: DatabaseEntry): string | null;
export function databaseEntryAddress(
  entry: DatabaseEntry,
  database?: Database,
): string | null {
  // Fall back to the entry's stored database
  const entryDatabase = database ?? getDatabase(entry.database, false);

  // Entries whose database is gone cannot be addressed
  if (!entryDatabase) {
    return null;
  }

  return `${entryDatabase.name}/${entry.title}`;
}
