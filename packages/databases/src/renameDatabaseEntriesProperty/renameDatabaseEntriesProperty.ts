import { PropertySchema } from '@minddrop/properties';
import { renameObjectKey } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import { writeDatabaseEntry } from '../writeDatabaseEntry';

/**
 * Renames a property's key in each of a database's entries with a
 * value for it, rewriting their files under the new name.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param oldProperty - The property as the schema declared it before the rename.
 * @param newName - The new property name.
 */
export async function renameDatabaseEntriesProperty(
  databaseId: string,
  oldProperty: PropertySchema,
  newName: string,
): Promise<void> {
  // Filter for entries with a value for the renamed property
  const affectedEntries = getAllDatabaseEntries(databaseId).filter(
    (entry) => oldProperty.name in entry.properties,
  );

  // Re-key each of them
  await Promise.all(
    affectedEntries.map(async (entry) => {
      // Rename the key in the entry's property values
      const properties = renameObjectKey(
        entry.properties,
        oldProperty.name,
        newName,
      );

      // Update the entry in the store. The entry updated event is
      // deliberately not dispatched, as a schema rename is not an
      // edit of the entry.
      DatabaseEntriesStore.update(entry.id, { properties });

      // Rewrite the entry's file, clearing the old key from it
      await writeDatabaseEntry(entry.id, {
        clearedProperties: [oldProperty],
      });
    }),
  );
}
