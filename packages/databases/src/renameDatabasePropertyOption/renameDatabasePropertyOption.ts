import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import {
  DatabasePropertyOptionRenamedEvent,
  DatabaseUpdatedEvent,
} from '../events';
import { getDatabase } from '../getDatabase';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Renames an option of a select property. The option value held
 * by entries is rewritten as an event side effect.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param propertyName - The name of the select property.
 * @param oldValue - The option value to rename.
 * @param newValue - The new option value.
 *
 * @throws {InvalidParameterError} If the property is not a select property, the old option does not exist, or the new value is empty or already an option.
 *
 * @dispatches 'databases:database:updated' event
 * @dispatches 'databases:property-option:renamed' event
 */
export async function renameDatabasePropertyOption(
  databaseId: string,
  propertyName: string,
  oldValue: string,
  newValue: string,
): Promise<void> {
  // Get the database config
  const original = getDatabase(databaseId);
  // Find the property the option belongs to
  const property = original.properties.find(
    (candidate) => candidate.name === propertyName,
  );

  // Ensure the property is a select property
  if (!property || property.type !== 'select') {
    throw new InvalidParameterError(
      `Database ${databaseId} does not have a select property named ${propertyName}.`,
    );
  }

  // Ensure the renamed option exists
  if (!property.options.some((option) => option.value === oldValue)) {
    throw new InvalidParameterError(
      `Property ${propertyName} does not have an option ${oldValue}.`,
    );
  }

  // Ensure the new value names a valid, unused option
  if (
    !newValue.trim() ||
    property.options.some((option) => option.value === newValue)
  ) {
    throw new InvalidParameterError(
      `Cannot rename option ${oldValue} to ${newValue}.`,
    );
  }

  // Rename the option in the property schema
  const updatedProperty = {
    ...property,
    options: property.options.map((option) =>
      option.value === oldValue ? { ...option, value: newValue } : option,
    ),
  };

  // Update the property in the database config
  const updated = {
    ...original,
    properties: original.properties.map((candidate) =>
      candidate.name === propertyName ? updatedProperty : candidate,
    ),
    lastModified: new Date(),
  };

  // Update the database in the store
  DatabasesStore.update(databaseId, updated);

  // Dispatch a database updated event
  Events.dispatch(DatabaseUpdatedEvent, {
    original,
    updated,
  });

  // Dispatch the option renamed event
  Events.dispatch(DatabasePropertyOptionRenamedEvent, {
    original,
    updated,
    property: updatedProperty,
    oldValue,
    newValue,
  });

  // Write the updated config to the file system
  await writeDatabaseConfig(databaseId);
}
