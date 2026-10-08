import { getDatabase } from '../../getDatabase';
import { Database, Entry } from '../../types';

/**
 * Derives an entry's durable address, its title qualified by the name
 * of its database.
 *
 * @param entry - The entry to derive the address of.
 * @param database - The database to name the entry under. Defaults to the entry's stored database.
 * @returns The entry address, or null if the entry's database does not exist.
 */
export function entryAddress(
  entry: Pick<Entry, 'title'>,
  database: Pick<Database, 'name'>,
): string;
export function entryAddress(
  entry: Pick<Entry, 'title' | 'database'>,
): string | null;
export function entryAddress(
  entry: Pick<Entry, 'title'> & Partial<Pick<Entry, 'database'>>,
  database?: Pick<Database, 'name'>,
): string | null {
  // Fall back to the entry's stored database
  const entryDatabase =
    database ?? (entry.database ? getDatabase(entry.database, false) : null);

  // Entries whose database is unknown or gone cannot be addressed
  if (!entryDatabase) {
    return null;
  }

  return `${entryDatabase.name}/${entry.title}`;
}
