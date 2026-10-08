import { Fs } from '@minddrop/file-system';
import { getAllEntries } from '../../getAllEntries';
import { Entry } from '../../types';

/**
 * Finds the entries of a database whose file is at, or anywhere
 * under, the given path.
 *
 * @param databaseId - The ID of the database to search.
 * @param relativePath - The path, relative to the database directory.
 * @param workspaceId - The ID of the workspace the database is in. Defaults to the active workspace.
 * @returns The entries.
 */
export function findEntriesUnderPath(
  databaseId: string,
  relativePath: string,
  workspaceId?: string,
): Entry[] {
  return getAllEntries(databaseId, workspaceId).filter((entry) =>
    Fs.isAtOrUnder(entry.path, relativePath),
  );
}
