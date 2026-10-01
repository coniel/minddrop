import { getDatabaseEntry } from '../getDatabaseEntry';
import { EntryPropertyMetadata } from '../types';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Merges data into the metadata of an entry's property, updating the
 * store and writing the entry's metadata sidecar.
 *
 * @param entryId - The ID of the entry.
 * @param property - The name of the property.
 * @param data - The data to merge into the property's metadata.
 *
 * @throws {DatabaseEntryNotFoundError} If the entry does not exist.
 *
 * @dispatches database-entries:entry:metadata-updated
 */
export async function updateEntryPropertyMetadata(
  entryId: string,
  property: string,
  data: EntryPropertyMetadata,
): Promise<void> {
  // Get the entry's metadata
  const { metadata } = getDatabaseEntry(entryId);

  // Merge the data into the property's metadata
  await updateEntryMetadata(entryId, {
    ...metadata,
    properties: {
      ...metadata.properties,
      [property]: { ...metadata.properties?.[property], ...data },
    },
  });
}
