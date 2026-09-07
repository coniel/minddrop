import { ViewSessions } from '@minddrop/views';

/**
 * Closes every tab positioned before the tab with the given id.
 *
 * @param viewAreaId - The id of the view area.
 * @param id - The id of the tab to close the tabs before.
 */
export function closeTabsToTheLeft(viewAreaId: string, id: string): void {
  const sessions = ViewSessions.getAll(viewAreaId);

  // Find the tab to close the tabs before
  const index = sessions.findIndex((session) => session.id === id);

  // Nothing to do when the tab does not exist
  if (index === -1) {
    return;
  }

  // The tabs positioned before it
  const closed = sessions.slice(0, index);

  // When the active tab is among them, activate the tab the remaining
  // tabs start on first, so its content is shown.
  if (
    closed.some(
      (session) => session.id === ViewSessions.getActive(viewAreaId)?.id,
    )
  ) {
    ViewSessions.setActive(viewAreaId, id);
  }

  ViewSessions.close(
    viewAreaId,
    closed.map((session) => session.id),
  );
}
