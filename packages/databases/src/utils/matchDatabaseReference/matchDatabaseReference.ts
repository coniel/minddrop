import { ItemReferenceMatch } from '@minddrop/item-references';
import { getAllDatabases } from '../../getAllDatabases';

/**
 * Matches a durable reference against the database address format: a
 * bare name matching an existing database. Only existing databases
 * match, since any bare name could otherwise claim the address.
 *
 * @param reference - The durable reference to match.
 * @returns The match, or null if the reference is not a database address.
 */
export function matchDatabaseReference(
  reference: string,
): ItemReferenceMatch | null {
  // Database addresses are bare names
  if (reference.includes('/')) {
    return null;
  }

  // Resolve the name to a database, case-insensitively as with entry
  // addresses
  const database = getAllDatabases().find(
    ({ name }) => name.toLowerCase() === reference.toLowerCase(),
  );

  // Names that do not resolve to a database are not addresses
  if (!database) {
    return null;
  }

  return { type: 'database', id: database.id };
}
