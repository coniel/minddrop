import { ViewSessions } from '@minddrop/views';

/**
 * Moves the main view of the source tab into the split pane of the
 * target tab, closing the source tab and making the target active.
 *
 * @param viewAreaId - The id of the view area.
 * @param tabId - The id of the tab to split.
 * @param sourceTabId - The id of the tab to move into the split pane.
 */
export function splitTabWithTab(
  viewAreaId: string,
  tabId: string,
  sourceTabId: string,
): void {
  const target = ViewSessions.get(viewAreaId, tabId);
  const source = ViewSessions.get(viewAreaId, sourceTabId);

  // Nothing to do when either tab does not exist, or the source tab
  // has no view to move.
  if (!target || !source?.main) {
    return;
  }

  // Show the source tab's view in the target tab's split pane, which
  // makes the target active.
  ViewSessions.split(viewAreaId, tabId, source.main);

  // Drop the source tab, now a background tab
  ViewSessions.close(viewAreaId, sourceTabId);
}
