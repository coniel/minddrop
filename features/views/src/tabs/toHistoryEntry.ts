import { Tab, TabHistoryEntry } from './TabSetsStore';

/**
 * Snapshots a tab's current view area state as a history entry.
 *
 * @param tab - The tab to snapshot.
 */
export function toHistoryEntry(tab: Tab): TabHistoryEntry {
  // Capture the panes and split ratio, leaving out the tab's identity
  return {
    main: tab.main,
    split: tab.split,
    splitRatio: tab.splitRatio,
  };
}
