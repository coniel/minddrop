import { EntryFileChange } from '../../types';

/**
 * Merges the changes to each entry into one. A change to an entry's
 * sidecar takes precedence over a change to its primary file.
 *
 * @param changes - The entry file changes to merge.
 * @returns One change per entry, in the order the entries first appear.
 */
export function mergeEntryFileChanges(
  changes: EntryFileChange[],
): EntryFileChange[] {
  // The change kept for each entry, keyed by database and path
  const merged = new Map<string, EntryFileChange>();

  changes.forEach((change) => {
    // Key the change by its entry's database and path. Paths are
    // relative to their database.
    const key = `${change.databaseId}/${change.path}`;
    // Get the change kept so far for the entry
    const previous = merged.get(key);

    // Keep the first change to each entry, or its sidecar change
    if (!previous || change.file === 'metadata') {
      merged.set(key, change);
    }
  });

  return [...merged.values()];
}
