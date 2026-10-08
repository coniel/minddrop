import { EntryFileChange } from '../../types';

/**
 * Resolves entry file changes to one change per entry. A change to an
 * entry's sidecar takes precedence over a change to its primary file.
 *
 * @param changes - The entry file changes to resolve.
 * @returns One change per entry, in the order the entries first appear.
 */
export function resolveEntryChanges(
  changes: EntryFileChange[],
): EntryFileChange[] {
  // The change kept for each entry, keyed by database and path
  const resolved = new Map<string, EntryFileChange>();

  // Keep one change per entry
  changes.forEach((change) => {
    // Key the change by its entry's database and path. Paths are
    // relative to their database.
    const key = `${change.databaseId}/${change.path}`;
    // Get the change kept so far for the entry
    const previous = resolved.get(key);

    // Keep the first change to each entry, or its sidecar change
    if (!previous || change.file === 'metadata') {
      resolved.set(key, change);
    }
  });

  return [...resolved.values()];
}
