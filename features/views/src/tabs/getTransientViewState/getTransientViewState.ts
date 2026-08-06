import { ViewAreaPane } from '../TabSetsStore';
import { getTabs } from '../getTabs';

/**
 * Returns the transient UI state value stored for a pane of the given
 * tab, or undefined when none is stored.
 *
 * @param viewAreaId - The id of the view area.
 * @param tabId - The id of the tab holding the state.
 * @param pane - The pane the state belongs to.
 * @param key - The scoped state key.
 */
export function getTransientViewState(
  viewAreaId: string,
  tabId: string,
  pane: ViewAreaPane,
  key: string,
): unknown {
  // Find the tab holding the state
  const tab = getTabs(viewAreaId).find((setTab) => setTab.id === tabId);

  return tab?.viewState?.[pane]?.[key];
}
