import { Fs } from '@minddrop/file-system';
import { ItemReferenceMatch } from '@minddrop/item-references';
import { Paths } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { databaseEntryPathFromAddress } from '../databaseEntryPathFromAddress';

/**
 * Matches a durable reference against the entry address format: a
 * workspace-relative path whose first segment is an existing
 * database directory. A matched address whose entry does not exist
 * yet has a null ID.
 *
 * @param reference - The durable reference to match.
 * @returns The match, or null if the reference is not an entry address.
 */
export function matchDatabaseEntryReference(
  reference: string,
): ItemReferenceMatch | null {
  const separatorIndex = reference.indexOf('/');

  // Entry addresses always contain a database directory segment
  if (separatorIndex <= 0) {
    return null;
  }

  // Resolve the first segment to a database via its absolute path
  const databasePath = Fs.concatPath(
    Paths.workspace,
    reference.slice(0, separatorIndex),
  );
  const database = DatabasesStore.getAllArray().find(
    ({ path }) => path === databasePath,
  );

  // Addresses outside an existing database are not entry addresses
  if (!database) {
    return null;
  }

  // Look up the entry by its absolute path
  const entryPath = databaseEntryPathFromAddress(reference);
  const entry = DatabaseEntriesStore.getAllArray().find(
    ({ path }) => path === entryPath,
  );

  return { type: 'database-entry', id: entry?.id ?? null };
}
