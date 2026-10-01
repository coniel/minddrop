import { Events } from '@minddrop/events';
import { History } from '@minddrop/history';
import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseHistoryCauses } from '../constants';
import { DatabasePropertyUpdatedEvent, DatabaseUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Updates a property in a database.
 *
 * @param databaseId - The ID of the database to update the property in.
 * @param updatedProperty - The updated property schema.
 * @returns The updated database config.
 *
 * @throws {InvalidParameterError} If the database has no property of the name, or the type differs from the existing property's.
 *
 * @dispatches databases:database:updated
 * @dispatches databases:property:updated
 */
export async function updateDatabaseProperty(
  databaseId: string,
  updatedProperty: PropertySchema,
): Promise<Database> {
  // Get the database config
  const config = getDatabase(databaseId);
  // Find the existing property
  const property = config.properties.find(
    (candidate) => candidate.name === updatedProperty.name,
  );

  // Check the database has a property of the name. A name change is
  // a rename, not an update.
  if (!property) {
    throw new InvalidParameterError(
      'Cannot update property name. Use "renameProperty" method instead.',
    );
  }

  // Check the type is unchanged. A type change is not an update.
  if (property.type !== updatedProperty.type) {
    throw new InvalidParameterError(
      'Cannot update property type. Use the "changePropertyType" method instead.',
    );
  }

  // Update the property in the database's properties
  const updated = {
    ...config,
    properties: config.properties.map((candidate) =>
      candidate.name === updatedProperty.name ? updatedProperty : candidate,
    ),
    lastModified: new Date(),
  };

  // Update the database in the store
  DatabasesStore.update(databaseId, updated);

  // Dispatch a database updated event
  Events.dispatch(DatabaseUpdatedEvent, {
    original: config,
    updated,
  });

  // Dispatch the property updated event
  Events.dispatch(DatabasePropertyUpdatedEvent, {
    original: config,
    updated,
    originalProperty: property,
    updatedProperty,
    action: History.createAction(DatabaseHistoryCauses.PropertyUpdated),
  });

  // Write the updated config to the file system
  await writeDatabaseConfig(databaseId);

  return updated;
}
