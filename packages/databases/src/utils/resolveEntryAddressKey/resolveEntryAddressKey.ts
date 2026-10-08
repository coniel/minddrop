import { Database, Entry } from '../../types';
import { resolveEntryAddress } from '../resolveEntryAddress';

/**
 * Resolves the key an entry's address is matched by. Addresses match
 * case-insensitively, so the key is lowercased.
 *
 * @param entry - The entry.
 * @param database - The entry's database.
 * @returns The entry's address key.
 */
export function resolveEntryAddressKey(
  entry: Pick<Entry, 'title'>,
  database: Pick<Database, 'name'>,
): string {
  return resolveEntryAddress(entry, database).toLowerCase();
}
