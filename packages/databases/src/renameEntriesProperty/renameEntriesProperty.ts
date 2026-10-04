import { PropertySchema } from '@minddrop/properties';
import { renameObjectKey } from '@minddrop/utils';
import { EntriesStore } from '../EntriesStore';
import { getAllEntries } from '../getAllEntries';
import { getDatabase } from '../getDatabase';
import { Entry } from '../types';
import { resolveDatabasePath } from '../utils';
import { writeEntry } from '../writeEntry';
import { writeEntryMetadata } from '../writeEntryMetadata';

/**
 * Renames a property's key in each of a database's entries with a
 * value for it, and in the property's metadata. Rewrites their files
 * under the new name.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param oldProperty - The property as the schema declared it before the rename.
 * @param newName - The new property name.
 * @returns The rewritten entries.
 */
export async function renameEntriesProperty(
  databaseId: string,
  oldProperty: PropertySchema,
  newName: string,
): Promise<Entry[]> {
  // Resolve the database's path
  const databasePath = resolveDatabasePath(getDatabase(databaseId));

  // Filter for entries with a value for the renamed property
  const affectedEntries = getAllEntries(databaseId).filter(
    (entry) => oldProperty.name in entry.properties,
  );

  // Re-key each of them
  return Promise.all(
    affectedEntries.map(async (entry) => {
      // Rename the key in the entry's property values
      const properties = renameObjectKey(
        entry.properties,
        oldProperty.name,
        newName,
      );

      // Check if the property has metadata. If so, rename its key there
      // too.
      const metadata = entry.metadata.properties?.[oldProperty.name]
        ? {
            ...entry.metadata,
            properties: renameObjectKey(
              entry.metadata.properties,
              oldProperty.name,
              newName,
            ),
          }
        : entry.metadata;

      // Update the entry in the store. The entry updated event is
      // deliberately not dispatched, as a schema rename is not an
      // edit of the entry.
      EntriesStore.update(entry.id, { properties, metadata });

      // Rewrite the entry's file, clearing the old key from it
      await writeEntry(entry.id, {
        clearedProperties: [oldProperty],
      });

      // Check if the metadata changed. If so, rewrite the entry's
      // metadata sidecar.
      if (metadata !== entry.metadata) {
        await writeEntryMetadata(databasePath, entry.path, metadata);
      }

      // Return the re-keyed entry
      return { ...entry, properties, metadata };
    }),
  );
}
