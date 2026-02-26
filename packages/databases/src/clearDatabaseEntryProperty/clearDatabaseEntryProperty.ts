import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  DatabaseEntryUpdatedEvent,
  DatabaseEntryUpdatedEventData,
} from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntry } from '../types';
import { writeDatabaseEntry } from '../writeDatabaseEntry';

/**
 * Removes a property from a database entry.
 *
 * @param entryId - The ID of the entry to update.
 * @param propertyName - The name of the property to remove.
 *
 * @returns The updated entry.
 *
 * @throws {InvalidParameterError} If the database does not have a property with the specified name.
 */
export async function clearDatabaseEntryProperty(
  entryId: string,
  propertyName: string,
): Promise<DatabaseEntry> {
  // Get the entry
  const originalEntry = getDatabaseEntry(entryId);
  // Get the database
  const database = getDatabase(originalEntry.database);

  // Ensure the property exists on the database
  if (!database.properties.find((property) => property.name === propertyName)) {
    throw new InvalidParameterError(
      `Database ${database.id} does not have a property named ${propertyName}.`,
    );
  }

  // Build updated entry with the property removed
  const { [propertyName]: _, ...remainingProperties } =
    originalEntry.properties;
  const updatedEntry: DatabaseEntry = {
    ...originalEntry,
    properties: remainingProperties,
    lastModified: new Date(),
  };

  // Update the entry in the store
  DatabaseEntriesStore.update(entryId, updatedEntry);

  // Write the updated entry files to the file system
  await writeDatabaseEntry(entryId);

  // Dispatch entry update event
  Events.dispatch<DatabaseEntryUpdatedEventData>(DatabaseEntryUpdatedEvent, {
    original: originalEntry,
    updated: updatedEntry,
  });

  return updatedEntry;
}
