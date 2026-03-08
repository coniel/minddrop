import { Events } from '@minddrop/events';
import {
  DatabasePropertyRemovedEvent,
  DatabasePropertyRemovedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Removes a property from a database.
 *
 * @param databaseId - The ID of the database to remove the property from.
 * @param propertyName - The name of the property to remove.
 * @returns The updated database config.
 *
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
  const properties = config.properties.filter((p) => p.name !== propertyName);

  // Update the database
  const updated = await updateDatabase(databaseId, { properties });

  // Dispatch the property removed event if the property existed
  if (property) {
    Events.dispatch<DatabasePropertyRemovedEventData>(
      DatabasePropertyRemovedEvent,
      { database: updated, property },
    );
  }

  return updated;
}
