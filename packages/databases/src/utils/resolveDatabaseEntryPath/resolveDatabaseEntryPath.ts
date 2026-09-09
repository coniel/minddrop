import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDatabase } from '../../getDatabase';
import { Database, DatabaseEntry } from '../../types';
import { resolveDatabasePath } from '../resolveDatabasePath';

/**
 * Resolves an entry's file system path from its database relative
 * path.
 *
 * @param entry - The entry to resolve the path of.
 * @param database - The database the entry belongs to. Looked up from the entry when omitted.
 * @returns The path to the entry's primary file.
 *
 * @throws {DatabaseNotFoundError} If the entry's database does not exist.
 */
export function resolveDatabaseEntryPath(
  entry: DatabaseEntry,
  database?: Database,
): string;

/**
 * Resolves a database relative entry path to a file system path.
 *
 * @param path - The entry path, relative to its database.
 * @param database - The database the path is relative to.
 * @returns The path to the entry's primary file.
 */
export function resolveDatabaseEntryPath(
  path: string,
  database: Database,
): string;

export function resolveDatabaseEntryPath(
  entry: DatabaseEntry | string,
  database?: Database,
): string {
  if (typeof entry === 'string') {
    // A bare path names no database to fall back to, which the
    // signatures above require alongside it.
    if (!database) {
      throw new InvalidParameterError(
        'A database is required to resolve an entry path',
      );
    }

    return Fs.concatPath(resolveDatabasePath(database), entry);
  }

  return Fs.concatPath(
    resolveDatabasePath(database ?? getDatabase(entry.database)),
    entry.path,
  );
}
