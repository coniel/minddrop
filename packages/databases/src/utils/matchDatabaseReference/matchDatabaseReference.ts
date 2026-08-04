import { Fs } from '@minddrop/file-system';
import { ItemReferenceMatch } from '@minddrop/item-references';
import { Paths } from '@minddrop/utils';
import { DatabasesStore } from '../../DatabasesStore';

/**
 * Matches a durable reference against the database address format:
 * a bare directory name matching an existing database. Only
 * existing databases match, since any bare name could otherwise
 * claim the address.
 *
 * @param reference - The durable reference to match.
 * @returns The match, or null if the reference is not a database address.
 */
export function matchDatabaseReference(
  reference: string,
): ItemReferenceMatch | null {
  // Database addresses are bare directory names
  if (reference.includes('/')) {
    return null;
  }

  // Resolve the name to a database via its absolute path
  const databasePath = Fs.concatPath(Paths.workspace, reference);
  const database = DatabasesStore.getAllArray().find(
    ({ path }) => path === databasePath,
  );

  // Names that do not resolve to a database are not addresses
  if (!database) {
    return null;
  }

  return { type: 'database', id: database.id };
}
