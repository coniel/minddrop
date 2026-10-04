import { Events } from '@minddrop/events';
import { Properties, PropertyMap } from '@minddrop/properties';
import { EntriesStore } from '../EntriesStore';
import { EntryUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getEntry } from '../getEntry';
import { Entry } from '../types';
import {
  omitEntryPropertyMetadata,
  resolveDatabasePath,
  setTimestampProperties,
} from '../utils';
import { writeEntry } from '../writeEntry';
import { writeEntryMetadata } from '../writeEntryMetadata';

export interface EntryUpdateData {
  markdown?: string;
  image?: string;
  icon?: string;
  properties?: PropertyMap;
}

/**
 * Updates an existing database entry with the provided data. An
 * update which changes only timestamp properties, or nothing, leaves
 * the entry as is. The entry is not written and no event is
 * dispatched.
 *
 * @param id - The ID of the entry to update.
 * @param data - The data to update the entry with.
 *
 * @returns The updated entry.
 *
 * @throws {EntryNotFoundError} If the entry does not exist.
 *
 * @dispatches databases:entry:updated event.
 */
export async function updateEntry(
  id: string,
  data: EntryUpdateData,
): Promise<Entry> {
  // Get the entry and its database
  const originalEntry = getEntry(id);
  const database = getDatabase(originalEntry.database);

  // Merge the update's property values into the entry's
  const properties = { ...originalEntry.properties, ...data.properties };

  // Get the names of the properties the update gives a different value
  const changedPropertyNames = Properties.resolveChangedNames(
    database.properties,
    originalEntry.properties,
    properties,
  );

  // If the update changes no property, return the entry as is
  if (!changedPropertyNames.length) {
    return originalEntry;
  }

  // Get the update time
  const now = new Date();

  // Create the updated entry
  const updatedEntry: Entry = {
    // Copy the original entry
    ...originalEntry,
    // Update the last modified date
    lastModified: now,
    // Populate the last-modified timestamp property value so it
    // persists to the entry file.
    properties: setTimestampProperties(
      database.properties,
      properties,
      ['last-modified'],
      now,
    ),
    // Record the timestamp in the entry's metadata too, so that it
    // does not drift from the property. Drop the metadata of the
    // changed properties, as it described their old values.
    metadata: omitEntryPropertyMetadata(
      { ...originalEntry.metadata, lastModified: now },
      changedPropertyNames,
    ),
  };

  // Update the entry in the store
  EntriesStore.update(id, updatedEntry);

  // Dispatch an entry updated event
  Events.dispatch(EntryUpdatedEvent, {
    original: originalEntry,
    updated: updatedEntry,
  });

  // Write the updated entry files to the file system
  await writeEntry(id);

  // Write the entry's metadata sidecar
  await writeEntryMetadata(
    resolveDatabasePath(database),
    updatedEntry.path,
    updatedEntry.metadata,
  );

  // Return the updated entry
  return updatedEntry;
}
