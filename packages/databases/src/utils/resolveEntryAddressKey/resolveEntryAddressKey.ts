import { Database, Entry } from '../../types';
import { entryAddress } from '../entryAddress';

/**
 * Resolves the key an entry's address is indexed under when entry
 * references are resolved. Addresses match case-insensitively, so the
 * key is lowercased.
 *
 * @param entry - The entry, of which only the title is read.
 * @param database - The entry's database, of which only the name is read.
 * @returns The entry's address key.
 */
export function resolveEntryAddressKey(
  entry: Pick<Entry, 'title'>,
  database: Pick<Database, 'name'>,
): string {
  return entryAddress(entry, database).toLowerCase();
}
