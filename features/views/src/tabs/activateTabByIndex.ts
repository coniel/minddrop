import { getTabs } from './getTabs';
import { setActiveTab } from './setActiveTab';

/**
 * Activates the tab at the given index in the set, if one exists.
 *
 * @param viewAreaId - The id of the view area.
 * @param index - The zero-based index of the tab to activate.
 */
export function activateTabByIndex(viewAreaId: string, index: number): void {
  // Get the tab at the given index
  const tab = getTabs(viewAreaId)[index];

  // Activate it when one exists at that index
  if (tab) {
    setActiveTab(viewAreaId, tab.id);
  }
}
