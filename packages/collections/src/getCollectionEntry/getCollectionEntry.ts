import { getCollectionEntry as getFromStore } from '../CollectionEntriesStore';
import { CollectionEntryNotFoundError } from '../errors';
import { CollectionEntry } from '../types';

/**
 * Retrieves a collection entry by its path.
 *
 * @param entryPath - The path of the collection entry to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the entry is not found.
 * @returns The collection entry if found, or null if not found.
 */
export function getCollectionEntry(
  entryPath: string,
  throwOnNotFound: true,
): CollectionEntry;
export function getCollectionEntry(entryPath: string): CollectionEntry | null;
export function getCollectionEntry(
  path: string,
  throwOnNotFound?: boolean,
): CollectionEntry | null {
  // Get the entry
  const entry = getFromStore(path);

  // If the entry does not exist and throwOnNotFound is true, throw an error
  if (!entry && throwOnNotFound) {
    throw new CollectionEntryNotFoundError(path);
  }

  return entry;
}
