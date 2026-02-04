import { Events } from '@minddrop/events';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

export type UpdateDatabaseData = Partial<Omit<Database, 'type'>>;

/**
 * Updates a database.
 *
 * @param id - The ID of the database to update.
 * @param data - The data to update the database with.
 * @returns The updated database config.
 *
 * @dispatches databases:database:update
 */
export async function updateDatabase(
  id: string,
  data: UpdateDatabaseData,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(id);

  // Merge in the new data
  const updatedConfig = {
    ...config,
    ...data,
    lastModified: new Date(),
  };

  // Update the database in the store
  DatabasesStore.update(id, updatedConfig);

  // Write the updated config to the file system
  await writeDatabaseConfig(id);

  // Dispatch a database updated event
  Events.dispatch(DatabaseUpdatedEvent, updatedConfig);

  return updatedConfig;
}
