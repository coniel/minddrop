import { Events } from '@minddrop/events';
import { PropertyMap } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryUpdatedEvent } from '../events';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { DatabaseEntry } from '../types';
import { writeDatabaseEntry } from '../writeDatabaseEntry';

export interface DatabaseEntryUpdateData {
  markdown?: string;
  image?: string;
  icon?: string;
  properties?: PropertyMap;
}

/**
 * Updates an existing database entry with the provided data.
 *
 * @param id - The ID of the entry to update.
 * @param data - The data to update the entry with.
 *
 * @returns The updated entry.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 *
 * @dispatches databases:entry:updated event.
 */
export async function updateDatabaseEntry(
  id: string,
  data: DatabaseEntryUpdateData,
): Promise<DatabaseEntry> {
  let hasValidUpdateData = false;
  const originalEntry = getDatabaseEntry(id);
  // Clone the existing entry
  const updatedEntry = { ...originalEntry };

  if (data.properties !== undefined) {
    updatedEntry.properties = {
      ...originalEntry.properties,
      ...data.properties,
    };
    hasValidUpdateData = true;
  }

  // If no valid update data was provided, return the entry as is
  if (!hasValidUpdateData) {
    return updatedEntry;
  }

  // Update the last modified date
  updatedEntry.lastModified = new Date();

  // Update the entry in the store
  DatabaseEntriesStore.update(id, updatedEntry);

  // Write the updated entry files to the file system
  await writeDatabaseEntry(id);

  // Dispatch entry update event
  Events.dispatch(DatabaseEntryUpdatedEvent, {
    original: originalEntry,
    updated: updatedEntry,
  });

  // Return the updated entry
  return updatedEntry;
}
