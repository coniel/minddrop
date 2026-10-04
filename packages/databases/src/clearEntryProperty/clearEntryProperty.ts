import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { EntriesStore } from '../EntriesStore';
import { EntryUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getEntry } from '../getEntry';
import { Entry } from '../types';
import {
  omitEntryPropertyMetadata,
  resolveDatabasePath,
  virtualCollectionId,
} from '../utils';
import { writeEntry } from '../writeEntry';
import { writeEntryMetadata } from '../writeEntryMetadata';

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
export async function clearEntryProperty(
  entryId: string,
  propertyName: string,
): Promise<Entry> {
  // Get the entry
  const originalEntry = getEntry(entryId);
  // Get the database
  const database = getDatabase(originalEntry.database);

  // Look up the property schema
  const propertySchema = database.properties.find(
    (property) => property.name === propertyName,
  );

  // Ensure the property exists on the database
  if (!propertySchema) {
    throw new InvalidParameterError(
      `Database ${database.id} does not have a property named ${propertyName}.`,
    );
  }

  // Collection properties are cleared through their virtual
  // collection so both stores stay in sync.
  if (propertySchema.type === 'collection') {
    const collectionId = virtualCollectionId(entryId, propertyName);

    if (Collections.get(collectionId, false)) {
      await Collections.update(collectionId, { items: [] });

      return getEntry(entryId);
    }
  }

  // Build updated entry with the property and its metadata removed
  const { [propertyName]: _, ...remainingProperties } =
    originalEntry.properties;
  const updatedEntry: Entry = {
    ...originalEntry,
    properties: remainingProperties,
    metadata: omitEntryPropertyMetadata(originalEntry.metadata, [propertyName]),
    lastModified: new Date(),
  };

  // Update the entry in the store
  EntriesStore.update(entryId, updatedEntry);

  // Dispatch entry update event
  Events.dispatch(EntryUpdatedEvent, {
    original: originalEntry,
    updated: updatedEntry,
  });

  // Write the updated entry files to the file system
  await writeEntry(entryId);

  // Check if the metadata changed. If so, write the entry's metadata
  // sidecar.
  if (updatedEntry.metadata !== originalEntry.metadata) {
    await writeEntryMetadata(
      resolveDatabasePath(database),
      updatedEntry.path,
      updatedEntry.metadata,
    );
  }

  return updatedEntry;
}
