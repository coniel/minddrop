import { Events } from '@minddrop/events';
import { PropertyMap } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
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
 * @param path - The path of the entry to update.
 * @param data - The data to update the entry with.
 *
 * @returns The updated entry.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 *
 * @dispatches databases:entry:updated event.
 */
export async function updateDatabaseEntry(
  path: string,
  data: DatabaseEntryUpdateData,
): Promise<DatabaseEntry> {
  let hasValidUpdateData = false;
  // Clone the existing entry
  const entry = { ...getDatabaseEntry(path) };

  // Ensure title is not being updated
  if ('title' in data) {
    throw new InvalidParameterError(
      'DatabaseEntry title cannot be updated via updateDatabaseEntry. Use renameDatabaseEntry instead.',
    );
  }

  if (data.properties !== undefined) {
    entry.properties = {
      ...entry.properties,
      ...data.properties,
    };
    hasValidUpdateData = true;
  }

  // If no valid update data was provided, return the entry as is
  if (!hasValidUpdateData) {
    return entry;
  }

  // Update the last modified date
  entry.lastModified = new Date();

  // Update the entry in the store
  DatabaseEntriesStore.update(path, entry);

  // Write the updated entry files to the file system
  await writeDatabaseEntry(path);

  // Dispatch entry update event
  Events.dispatch(DatabaseEntryUpdatedEvent, entry);

  // Return the updated entry
  return entry;
}
