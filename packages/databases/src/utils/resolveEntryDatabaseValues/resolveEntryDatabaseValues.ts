import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';

/**
 * Resolves a per-database map into a per-entry map. Each entry maps
 * to its database's value. Entries whose database has no value, and
 * entries which do not exist, are omitted.
 *
 * @param entryIds - The IDs of the entries to resolve values for.
 * @param valuesByDatabase - The values, keyed by database ID.
 * @returns The values, keyed by entry ID.
 */
export function resolveEntryDatabaseValues<TValue>(
  entryIds: string[],
  valuesByDatabase: Record<string, TValue>,
): Record<string, TValue> {
  // The values keyed by entry ID
  const result: Record<string, TValue> = {};

  // Match each entry to its database's value
  for (const entryId of entryIds) {
    // Get the entry
    const entry = DatabaseEntriesStore.get(entryId);

    if (!entry) {
      continue;
    }

    // Read its database's value
    const value = valuesByDatabase[entry.database];

    // Add the value when the database has one
    if (value) {
      result[entryId] = value;
    }
  }

  return result;
}
