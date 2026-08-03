import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseRenamedEvent, DatabaseRenamedEventData } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Renames a database by renaming its directory on the file system.
 * A database's ID, name, and path are all derived from its directory
 * name, so a rename changes all three, along with the IDs of every
 * entry it contains.
 *
 * @param id - The ID of the database to rename.
 * @param newName - The new name for the database.
 * @returns The renamed database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {PathConflictError} If a database already exists at the new path.
 *
 * @dispatches databases:database:renamed
 */
export async function renameDatabase(
  id: string,
  newName: string,
): Promise<Database> {
  // Get the current database config
  const database = getDatabase(id);

  // Derive the new directory path from the new name
  const newPath = Fs.concatPath(Paths.workspace, newName);

  // Ensure no database already exists at the new path
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(newPath);
  }

  // Rename the database directory on the file system
  await Fs.rename(database.path, newPath);

  // Build the renamed database. Its ID and name both derive from the
  // directory name.
  const renamedDatabase: Database = {
    ...database,
    id: newName,
    name: newName,
    path: newPath,
    lastModified: new Date(),
  };

  // Swap the store keys in a single synchronous step so the UI never
  // renders both the old and new database.
  DatabasesStore.set(renamedDatabase);
  DatabasesStore.remove(id);

  // Dispatch the rename event
  await Events.dispatch<DatabaseRenamedEventData>(DatabaseRenamedEvent, {
    original: database,
    updated: renamedDatabase,
  });

  // Persist the updated config to the renamed directory
  await writeDatabaseConfig(newName);

  // Return the renamed database
  return renamedDatabase;
}
