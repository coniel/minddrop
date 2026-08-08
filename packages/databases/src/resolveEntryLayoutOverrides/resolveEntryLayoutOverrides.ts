import { DatabaseEntriesStore } from '../DatabaseEntriesStore';

/**
 * Resolves per-database layout overrides into a per-entry map by
 * looking up the database each entry belongs to. Entries whose
 * database has no override are omitted, leaving the caller to fall
 * back to the database default.
 *
 * @param entries - The IDs of the entries to resolve overrides for.
 * @param overrides - The layout overrides, keyed by database ID.
 * @returns The layout overrides, keyed by entry ID.
 */
export function resolveEntryLayoutOverrides<TOverride>(
  entries: string[],
  overrides?: Record<string, TOverride>,
): Record<string, TOverride> {
  // Nothing to resolve without overrides
  if (!overrides) {
    return {};
  }

  const result: Record<string, TOverride> = {};

  // Match each entry to its database's override
  for (const entryId of entries) {
    const entry = DatabaseEntriesStore.get(entryId);

    if (!entry) {
      continue;
    }

    const override = overrides[entry.database];

    if (override) {
      result[entryId] = override;
    }
  }

  return result;
}
