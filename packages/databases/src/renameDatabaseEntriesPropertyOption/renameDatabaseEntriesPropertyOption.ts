import { Properties, SelectPropertySchema } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { getAllDatabaseEntries } from '../getAllDatabaseEntries';
import { DatabaseEntry } from '../types';
import { rewriteEntryPropertyValues } from '../utils';
import { writeDatabaseEntry } from '../writeDatabaseEntry';

/**
 * Renames a select option's value in each of a database's entries
 * which have it. Their files are rewritten with the new value.
 *
 * @param databaseId - The ID of the database the property belongs to.
 * @param property - The select property the option belongs to.
 * @param oldValue - The option value to rename.
 * @param newValue - The new option value.
 * @returns The rewritten entries.
 */
export async function renameDatabaseEntriesPropertyOption(
  databaseId: string,
  property: SelectPropertySchema,
  oldValue: string,
  newValue: string,
): Promise<DatabaseEntry[]> {
  // Rewrite the option value in the entries which have it
  const rewritten = getAllDatabaseEntries(databaseId)
    .map((entry) =>
      rewriteEntryPropertyValues(entry, [property.name], (value) =>
        Properties.renameValue(value, oldValue, newValue),
      ),
    )
    .filter((result) => result !== null);

  // Persist each of them
  return Promise.all(
    rewritten.map(async ({ entry }) => {
      // Update the entry in the store. The entry updated event is
      // deliberately not dispatched, as an option rename is not an
      // edit of the entry.
      DatabaseEntriesStore.update(entry.id, { properties: entry.properties });

      // Rewrite the entry's file
      await writeDatabaseEntry(entry.id);

      return entry;
    }),
  );
}
