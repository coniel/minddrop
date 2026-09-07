import { ViewSessions } from '@minddrop/views';

/**
 * Closes every tab positioned after the tab with the given id.
 *
 * @param viewAreaId - The id of the view area.
 * @param id - The id of the tab to close the tabs after.
 */
export function closeTabsToTheRight(viewAreaId: string, id: string): void {
  const sessions = ViewSessions.getAll(viewAreaId);

  // Find the tab to close the tabs after
  const index = sessions.findIndex((session) => session.id === id);

  // Nothing to do when the tab does not exist
  if (index === -1) {
    return;
  }

  // The tabs positioned after it
  const closed = sessions.slice(index + 1);

  // When the active tab is among them, activate the tab the remaining
  // tabs end on first, so its content is shown.
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
