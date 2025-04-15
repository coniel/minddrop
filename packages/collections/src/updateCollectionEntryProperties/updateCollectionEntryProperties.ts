import { getCollectionEntry } from '../getCollectionEntry';
import { CollectionEntry, CollectionEntryProperties } from '../types';
import { updateCollectionEntry } from '../updateCollectionEntry';

/**
 * Updates the properties of a collection entry.
 *
 * @param collectionPath - The path of the collection.
 * @param entryPath - The path of the entry.
 * @param propertyUpdates - The properties to update.
 * @returns The updated collection entry.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeConfigNotFoundError} If the collection type config does not exist.
 * @throws {CollectionEntryNotFoundError} If the entry does not exist.
 *
 * @dispatches collections:entry:update
 */
export async function updateCollectionEntryProperties(
  collectionPath: string,
  entryPath: string,
  propertyUpdates: CollectionEntryProperties,
): Promise<CollectionEntry> {
  // Get the entry
  const entry = getCollectionEntry(entryPath, true);

  // Merge updates into the existing properties
  const updatedProperties = {
    ...entry.properties,
    ...propertyUpdates,
  };

  // Remove properties that are set to null
  Object.keys(updatedProperties).forEach((key) => {
    if (propertyUpdates[key] === null) {
      delete updatedProperties[key];
    }
  });

  // Update the entry
  return updateCollectionEntry(collectionPath, entry.path, {
    properties: updatedProperties,
  });
}
