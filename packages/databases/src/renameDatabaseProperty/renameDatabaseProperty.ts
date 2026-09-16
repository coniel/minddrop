import { Events } from '@minddrop/events';
import { Properties } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasePropertyRenamedEvent, DatabaseUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { withImplicitMetadataProperties } from '../utils';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Renames a database property. Does nothing when the name is
 * unchanged.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param oldName - The name of the property to rename.
 * @param newName - The new property name.
 * @returns The updated database config.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {InvalidParameterError} If the property does not exist, or the new name is empty or already taken.
 *
 * @dispatches databases:database:updated
 * @dispatches databases:property:renamed
 */
export async function renameDatabaseProperty(
  databaseId: string,
  oldName: string,
  newName: string,
): Promise<Database> {
  // Get the database config
  const original = getDatabase(databaseId);

  // Do nothing if the name is unchanged
  if (oldName === newName) {
    return original;
  }

  // Ensure the renamed property exists
  if (!original.properties.some((property) => property.name === oldName)) {
    throw new InvalidParameterError(
      `Database ${databaseId} does not have a property named ${oldName}.`,
    );
  }

  // Ensure the new name is not empty
  if (!newName.trim()) {
    throw new InvalidParameterError('Property name cannot be empty.');
  }

  // Ensure the new name is not taken by another property
  const nameTaken = withImplicitMetadataProperties(original.properties).some(
    (property) => property.name === newName,
  );

  if (nameTaken) {
    throw new InvalidParameterError(
      `Database ${databaseId} already has a property named ${newName}.`,
    );
  }

  // Point any design property mapped onto the renamed property at
  // its new name.
  const designPropertyMap = Object.fromEntries(
    Object.entries(original.designPropertyMap).map(([designProperty, name]) => [
      designProperty,
      name === oldName ? newName : name,
    ]),
  );

  // Rename the property in the database config
  const updated = {
    ...original,
    properties: Properties.rename(original.properties, oldName, newName),
    designPropertyMap,
    lastModified: new Date(),
  };

  // Update the color property if it's the property being renamed
  if (original.colorProperty === oldName) {
    updated.colorProperty = newName;
  }

  // Update the database in the store
  DatabasesStore.update(databaseId, updated);

  // Dispatch a database updated event
  Events.dispatch(DatabaseUpdatedEvent, {
    original,
    updated,
  });

  // Dispatch the property renamed event
  Events.dispatch(DatabasePropertyRenamedEvent, {
    original,
    updated,
    oldName,
    newName,
  });

  // Write the updated config to the file system
  await writeDatabaseConfig(databaseId);

  return updated;
}
