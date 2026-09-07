import { Events } from '@minddrop/events';
import { Properties, PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasePropertyAddedEvent, DatabaseUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Adds a property to a database.
 *
 * @param id - The ID of the database to add the property to.
 * @param property - The property to add.
 * @returns The updated database config.
 *
 * @throws {InvalidParameterError} If the database already has a property of a singleton type.
 *
 * @dispatches 'databases:database:updated' event
 * @dispatches 'databases:property:added' event
 */
export async function addDatabaseProperty(
  id: string,
  property: PropertySchema,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(id);

  // Guard against a second property of a singleton type, such as
  // the title or content property.
  if (
    Properties.schemas[property.type].singleton &&
    config.properties.some((existing) => existing.type === property.type)
  ) {
    throw new InvalidParameterError(
      `Database '${id}' already has a '${property.type}' property.`,
    );
  }

  // Add the property to the database's properties
  const updated = {
    ...config,
    properties: [...config.properties, property],
    lastModified: new Date(),
  };

  // Update the database in the store
  DatabasesStore.update(id, updated);

  // Dispatch a database updated event
  Events.dispatch(DatabaseUpdatedEvent, {
    original: config,
    updated,
  });

  // Dispatch the property added event
  Events.dispatch(DatabasePropertyAddedEvent, {
    original: config,
    updated,
    property,
  });

  // Write the updated config to the file system
  await writeDatabaseConfig(id);

  return updated;
}
