import { PropertySchema, PropertyValue } from '@minddrop/properties';
import { EntriesStore } from '../EntriesStore';
import { getAllEntries } from '../getAllEntries';
import { Entry } from '../types';
import { writeEntry } from '../writeEntry';

export interface ClearedEntryProperty {
  /**
   * The entry with the property's value dropped.
   */
  entry: Entry;

  /**
   * The value the entry had for the property.
   */
  value: PropertyValue;
}

/**
 * Drops a property's value from each of a database's entries with
 * one. Their files are rewritten without it.
 *
 * @param databaseId - The ID of the database the property belonged to.
 * @param property - The property as the schema declared it before its removal.
 * @returns The rewritten entries and the value each had.
 */
export async function clearEntriesProperty(
  databaseId: string,
  property: PropertySchema,
): Promise<ClearedEntryProperty[]> {
  // Filter for entries with a value for the property
  const affectedEntries = getAllEntries(databaseId).filter(
    (entry) => property.name in entry.properties,
  );

  // Drop the value from each of them
  return Promise.all(
    affectedEntries.map(async (entry) => {
      // Separate the property's value from the entry's other values
      const { [property.name]: value, ...properties } = entry.properties;

      // Update the entry in the store. The entry updated event is
      // deliberately not dispatched, as a schema change is not an
      // edit of the entry.
      EntriesStore.update(entry.id, { properties });

      // Rewrite the entry's file, clearing the key from it
      await writeEntry(entry.id, { clearedProperties: [property] });

      // Return the cleared entry and the dropped value
      return { entry: { ...entry, properties }, value };
    }),
  );
}
