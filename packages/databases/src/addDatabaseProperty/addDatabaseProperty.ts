import { Events } from '@minddrop/events';
import { PropertySchema } from '@minddrop/properties';
import {
  DatabasePropertyAddedEvent,
  DatabasePropertyAddedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Adds a property to a database.
 *
 * @param id - The ID of the database to add the property to.
 * @param property - The property to add.
 * @returns The updated database config.
 *
 * @dispatches 'databases:property:added' event
 */
export async function addDatabaseProperty(
  id: string,
  property: PropertySchema,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(id);

  // Add the property to the database's properties
  const properties = [...config.properties, property];

  // Update the database
  const updated = await updateDatabase(id, { properties });

  // Dispatch the property added event
  Events.dispatch<DatabasePropertyAddedEventData>(DatabasePropertyAddedEvent, {
    database: updated,
    property,
  });

  return updated;
}
