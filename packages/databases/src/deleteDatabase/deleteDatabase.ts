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

  // Remove the database from the store
  DatabasesStore.remove(id);

  // Dispatch the delete event
  Events.dispatch(DatabaseDeletedEvent, database);

  // Move the database directory to the system trash
  await Fs.trashDir(database.path);
}
