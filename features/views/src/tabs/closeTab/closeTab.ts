import { dispatchMainContent } from '../dispatchMainContent';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Closes the tab with the given id in the set, activating a
 * neighbouring tab when the closed tab was active.
 *
 * @param setId - The id of the tab set.
 * @param id - The id of the tab to close.
 */
export function closeTab(setId: string, id: string): void {
  const { tabs, activeTabId } = getSet(setId);

  // Find the tab to close
  const index = tabs.findIndex((tab) => tab.id === id);

  // Nothing to do when the tab does not exist
  if (index === -1) {
    return;
  }

  // Remove the tab from the set
  const nextTabs = tabs.filter((tab) => tab.id !== id);

  // A background tab was closed, so the active tab is unaffected; just
  // write the remaining tabs
  if (activeTabId !== id) {
    writeSet(setId, { tabs: nextTabs });

    return;
  }

  // The active tab was closed, so activate the tab that took its place,
  // falling back to the previous tab, or none when the set is now empty
  const neighbour = nextTabs[index] ?? nextTabs[index - 1] ?? null;

  // Write the remaining tabs and the new active tab
  writeSet(setId, { tabs: nextTabs, activeTabId: neighbour?.id ?? null });

  // Show the newly active tab's content
  dispatchMainContent(neighbour);
}
