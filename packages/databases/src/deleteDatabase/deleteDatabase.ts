import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseDeletedEvent } from '../events';
import { getDatabase } from '../getDatabase';

/**
 * Deletes a database by moving its directory to the system trash.
 *
 * @param id - The ID of the database to delete.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 *
 * @dispatches databases:database:deleted
 */
export async function deleteDatabase(id: string): Promise<void> {
  // Get the current database config
  const database = getDatabase(id);

  // Move the database directory to the system trash
  await Fs.trashDir(database.path);

  // Dispatch the delete event before removing the database from the
  // store so consumers can tear down while it is still resolvable
  await Events.dispatch(DatabaseDeletedEvent, database);

  // Remove the database from the store
  DatabasesStore.remove(id);
}
