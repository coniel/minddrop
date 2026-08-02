import { getTabs } from './getTabs';
import { setActiveTab } from './setActiveTab';

/**
 * Activates the tab at the given index in the set, if one exists.
 *
 * @param setId - The id of the tab set.
 * @param index - The zero-based index of the tab to activate.
 */
export function activateTabByIndex(setId: string, index: number): void {
  // Get the tab at the given index
  const tab = getTabs(setId)[index];

  // Activate it when one exists at that index
  if (tab) {
    setActiveTab(setId, tab.id);
  }
}
