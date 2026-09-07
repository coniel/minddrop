import { DefaultSplitRatio } from '../../constants';
import { SessionHistoryEntry } from '../../types';
import { sameView } from '../sameView';
import { viewMatches } from '../viewMatches';

/**
 * Returns the history entries with the closed view removed: entries
 * showing it in the main pane are dropped, entries showing it in the
 * split have the split cleared, and adjacent entries left showing the
 * same views are collapsed into one. Returns the original array
 * unchanged when no entry matches.
 *
 * @param entries - The history entries to prune.
 * @param viewId - The instance id of the closed view.
 */
export function pruneHistoryEntries(
  entries: SessionHistoryEntry[],
  viewId: string,
): SessionHistoryEntry[] {
  // Track whether any entry actually matched
  let changed = false;

  // Build the pruned entries list
  const pruned: SessionHistoryEntry[] = [];

  entries.forEach((entry) => {
    // The main pane matches, drop the entry
    if (viewMatches(entry.main, viewId)) {
      changed = true;

      return;
    }

    let nextEntry = entry;

    // Only the split matches, clear it and reset the split ratio
    if (viewMatches(entry.split, viewId)) {
      changed = true;
      nextEntry = { ...entry, split: null, splitRatio: DefaultSplitRatio };
    }

    // Collapse the entry into the previous one when pruning left them
    // showing the same views.
    const previousEntry = pruned[pruned.length - 1];

    if (previousEntry && sameEntryViews(previousEntry, nextEntry)) {
      changed = true;

      return;
    }

    pruned.push(nextEntry);
  });

  // Keep the original array's identity when nothing matched
  return changed ? pruned : entries;
}

/**
 * Whether two history entries show the same views in both panes.
 */
function sameEntryViews(
  a: SessionHistoryEntry,
  b: SessionHistoryEntry,
): boolean {
  return sameView(a.main, b.main) && sameView(a.split, b.split);
}
