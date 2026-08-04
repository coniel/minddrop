import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseUpdatedEvent, DatabaseUpdatedEventData } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

export type UpdateDatabaseData = Partial<
  Omit<
    Database,
    | 'type'
    | 'name'
    | 'propertyFileStorage'
    | 'propertyFilesDir'
    | 'entrySerializer'
  >
>;

/**
 * Updates a database.
 *
 * @param id - The ID of the database to update.
 * @param data - The data to update the database with.
 * @returns The updated database config.
 *
 * @dispatches databases:database:update
 *
 * @throws {InvalidParameterError} If the data includes the name, property file storage, or entry serializer fields.
 */
export async function updateDatabase(
  id: string,
  data: UpdateDatabaseData,
): Promise<Database> {
  // The name is derived from the database directory and must go through
  // its dedicated rename flow
  if ('name' in data) {
    throw new InvalidParameterError(
      'Cannot change name via updateDatabase; use Databases.rename.',
    );
  }

  // Property file storage has on-disk side effects and must go through
  // its dedicated setter
  if ('propertyFileStorage' in data || 'propertyFilesDir' in data) {
    throw new InvalidParameterError(
      'Cannot change propertyFileStorage or propertyFilesDir via updateDatabase; use Databases.setPropertyFileStorage.',
    );
  }

  // The entry serializer has on-disk side effects and must go through
  // its dedicated setter
  if ('entrySerializer' in data) {
    throw new InvalidParameterError(
      'Cannot change entrySerializer via updateDatabase; use Databases.setEntrySerializer.',
    );
  }

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
  Events.dispatch<DatabaseUpdatedEventData>(DatabaseUpdatedEvent, {
    original: config,
    updated: updatedConfig,
  });

  return updatedConfig;
}
