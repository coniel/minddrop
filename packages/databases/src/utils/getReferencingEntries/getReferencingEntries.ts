import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { DatabaseEntry } from '../../types';

/**
 * Returns the entries whose collection property values reference
 * any of the given entry IDs. Each referencing entry is returned
 * once, including self-references.
 *
 * @param entryIds - The referenced entry IDs.
 * @returns The referencing entries.
 */
export function getReferencingEntries(entryIds: string[]): DatabaseEntry[] {
  const referencedIds = new Set(entryIds);

  return DatabaseEntriesStore.getAllArray().filter((entry) => {
    // Look up the entry's database schema
    const database = DatabasesStore.get(entry.database);

    if (!database) {
      return false;
    }

    // Check the entry's collection property values for references
    return database.properties.some((property) => {
      if (property.type !== 'collection') {
        return false;
      }

      const value = entry.properties[property.name];

      // Skip missing or non-array values
      if (!Array.isArray(value)) {
        return false;
      }

      return value.some((memberId) => referencedIds.has(memberId));
    });
  });
}
