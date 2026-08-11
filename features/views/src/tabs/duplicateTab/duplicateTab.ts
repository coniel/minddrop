import { entityId } from '@minddrop/utils';
import { dispatchViewArea } from '../dispatchViewArea';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Duplicates the tab with the given id, inserting the copy directly
 * after it and making it active.
 *
 * @param viewAreaId - The id of the view area.
 * @param id - The id of the tab to duplicate.
 */
export function duplicateTab(viewAreaId: string, id: string): void {
  const { tabs } = getSet(viewAreaId);

  // Find the tab to duplicate
  const index = tabs.findIndex((tab) => tab.id === id);

  // Nothing to do when the tab does not exist
  if (index === -1) {
    return;
  }

  // Copy the tab's views and split ratio into a new tab, leaving
  // its history and transient state behind
  const duplicate = {
    ...tabs[index],
    id: entityId('tab'),
    backHistory: [],
    forwardHistory: [],
    viewState: {},
  };

  // Insert the copy directly after the original
  const nextTabs = [
    ...tabs.slice(0, index + 1),
    duplicate,
    ...tabs.slice(index + 1),
  ];

  // Write the new tabs and make the copy active
  writeSet(viewAreaId, { tabs: nextTabs, activeTabId: duplicate.id });

  // Show the copy's content
  dispatchViewArea(viewAreaId, duplicate);
}
