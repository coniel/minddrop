import { ViewAreaPane } from '../TabSetsStore';
import { getTabs } from '../getTabs';
import { updateTab } from '../updateTab';

/**
 * Stores a transient UI state value for a pane of the given tab.
 * Passing undefined removes the key. Does nothing when the tab does
 * not exist.
 *
 * @param viewAreaId - The id of the view area.
 * @param tabId - The id of the tab holding the state.
 * @param pane - The pane the state belongs to.
 * @param key - The scoped state key.
 * @param value - The JSON-serializable value to store.
 */
export function setTransientViewState(
  viewAreaId: string,
  tabId: string,
  pane: ViewAreaPane,
  key: string,
  value: unknown,
): void {
  // Find the tab holding the state
  const tab = getTabs(viewAreaId).find((setTab) => setTab.id === tabId);

  // Nothing to do when the tab does not exist
  if (!tab) {
    return;
  }

  // Copy the pane's bag, tabs hydrated from disk may lack it
  const paneState = { ...(tab.viewState?.[pane] ?? {}) };

  // Store the value, removing the key when it is undefined
  if (value === undefined) {
    delete paneState[key];
  } else {
    paneState[key] = value;
  }

  // Write the updated bag back onto the tab
  updateTab(viewAreaId, tabId, {
    viewState: { ...tab.viewState, [pane]: paneState },
  });
}
