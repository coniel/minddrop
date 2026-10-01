import { getDatabaseEntry } from '../getDatabaseEntry';
import { EntryPropertyMetadata } from '../types';

/**
 * Returns the metadata of an entry's property. The metadata is typed
 * as the caller declares it.
 *
 * @param entryId - The ID of the entry.
 * @param property - The name of the property.
 * @returns The property's metadata, empty when it has none.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 */
export function getEntryPropertyMetadata<
  TMetadata extends EntryPropertyMetadata = EntryPropertyMetadata,
>(entryId: string, property: string): TMetadata {
  // Get the entry
  const entry = getDatabaseEntry(entryId);

  // Return the property's metadata, empty when it has none
  return (entry.metadata.properties?.[property] ?? {}) as TMetadata;
}
