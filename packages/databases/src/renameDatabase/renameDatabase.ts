import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseRenamedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { resolveDatabasePath } from '../utils';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Renames a database by renaming its directory on the file system,
 * updating its name and path.
 *
 * @param id - The ID of the database to rename.
 * @param newName - The new name for the database.
 * @returns The renamed database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {Fs.errors.PathConflict} If a database already exists at the new path.
 *
 * @dispatches databases:database:renamed
 */
export async function renameDatabase(
  id: string,
  newName: string,
): Promise<Database> {
  // Get the current database config
  const database = getDatabase(id);

  // Databases live at the workspace root, so the new name is the
  // database's new workspace relative path.
  const newPath = newName;
  const newDirPath = resolveDatabasePath(newPath);

  // Ensure no database already exists at the new path
  if (await Fs.exists(newDirPath)) {
    throw new Fs.errors.PathConflict(newPath);
  }

  // Rename the database directory on the file system
  await Fs.rename(resolveDatabasePath(database), newDirPath);

  // Build the renamed database with the new name and path
  const renamedDatabase: Database = {
    ...database,
    name: newName,
    path: newPath,
    lastModified: new Date(),
  };

  // Update the database in place under its existing store key
  DatabasesStore.update(id, {
    name: newName,
    path: newPath,
    lastModified: renamedDatabase.lastModified,
  });

  // Dispatch the rename event
  Events.dispatch(DatabaseRenamedEvent, {
    original: database,
    updated: renamedDatabase,
  });

  // Persist the updated config to the renamed directory
  await writeDatabaseConfig(id);

  // Return the renamed database
  return renamedDatabase;
}
