import { ItemReferenceMatch } from '@minddrop/item-references';
import { matchDatabaseEntryAddress } from '../matchDatabaseEntryAddress';

/**
 * Matches a durable reference against the entry address format,
 * `<database name>/<entry title>`, whose first segment names an
 * existing database. A matched address whose entry does not exist
 * yet has a null ID.
 *
 * @param reference - The durable reference to match.
 * @returns The match, or null if the reference is not an entry address.
 */
export function matchDatabaseEntryReference(
  reference: string,
): ItemReferenceMatch | null {
  const match = matchDatabaseEntryAddress(reference);

  // References which name no database are not entry addresses
  if (!match) {
    return null;
  }

  return { type: 'database-entry', id: match.entry?.id ?? null };
}
