import { Events } from '@minddrop/events';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasePropertyRemovedEvent, DatabaseUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Removes a property from a database.
 *
 * @param databaseId - The ID of the database to remove the property from.
 * @param propertyName - The name of the property to remove.
 * @returns The updated database config.
 *
 * @dispatches 'databases:database:updated' event
 * @dispatches 'databases:property:removed' event
 */
export async function removeDatabaseProperty(
  databaseId: string,
  propertyName: string,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(databaseId);

  // Find the property being removed
  const property = config.properties.find((p) => p.name === propertyName);

  // Remove the property from the database's properties
  const updated = {
    ...config,
    properties: config.properties.filter((p) => p.name !== propertyName),
    lastModified: new Date(),
  };

  // Update the database in the store
  DatabasesStore.update(databaseId, updated);

  // Dispatch a database updated event
  Events.dispatch(DatabaseUpdatedEvent, {
    original: config,
    updated,
  });

  // Dispatch the property removed event if the property existed
  if (property) {
    Events.dispatch(DatabasePropertyRemovedEvent, {
      original: config,
      updated,
      property,
    });
  }

  // Write the updated config to the file system
  await writeDatabaseConfig(databaseId);

  return updated;
}
