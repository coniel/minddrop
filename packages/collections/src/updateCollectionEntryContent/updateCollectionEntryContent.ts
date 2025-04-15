import { CollectionEntry } from '../types';
import { updateCollectionEntry } from '../updateCollectionEntry';

/**
 * Updates the content of a collection entry.
 *
 * @param collectionPath - The path of the collection.
 * @param entryPath - The path of the entry.
 * @param content - The updated content.
 * @returns The updated collection entry.
 *
 * @throws {CollectionNotFoundError} If the collection does not exist.
 * @throws {CollectionTypeConfigNotFoundError} If the collection type config does not exist.
 * @throws {CollectionEntryNotFoundError} If the entry does not exist.
 *
 * @dispatches collections:entry:update
 */
export function updateCollectionEntryContent(
  collectionPath: string,
  entryPath: string,
  content: string,
): Promise<CollectionEntry> {
  // Update the entry
  return updateCollectionEntry(collectionPath, entryPath, {
    content,
  });
}
